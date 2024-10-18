const express = require("express");
const router = express.Router();

const percentToDecimal = require("../util");

const handleCalc = ({ principalAmount = 0, rate = 0, term = 0, freqType = null, deposit = 0 }) => {
  principalAmount = parseInt(principalAmount);
  rate = parseFloat(rate);
  term = parseInt(term); // years
  deposit = parseInt(deposit);

  const totalPayments = term * 12; // TODO
  const monthlyRate = getMonthlyInterestRate(rate);
  const monthlyPayment = getMonthlyPayment(principalAmount, monthlyRate, totalPayments); // this is to be updated based on frequency;
  const totalInterest = getTotalInterest(principalAmount, monthlyPayment, totalPayments).toFixed(2);
  const totalCost = getTotalCost(monthlyPayment, totalPayments).toFixed(2);

  const summary = {
    principalAmount,
    rate,
    term,
    totalPayments,
    monthlyPayment: monthlyPayment.toFixed(2),
    totalCost,
    totalInterest,
  };

  console.log(`summary: `, summary);

  const schedule = createPaymentSchedule(principalAmount, monthlyPayment, totalPayments, monthlyRate);

  return { summary, schedule };
};

const getMonthlyInterestRate = (ratePercent) => {
  const annualRate = percentToDecimal(ratePercent);
  return annualRate / 12; // TODO fix hardcoded 12 to frequency provided
};

const getMonthlyPayment = (principalAmount, monthlyRate, totalPayments) => {
  // M=P×(r(1+r)n/(1+r)n-1) monthly payment formula

  return (
    principalAmount *
    ((monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1))
  );
};

const getAnnualFreq = (type) => {
  switch (type) {
    case "weekly":
      return 52;
    case "bi-weekly":
      return 26;
    case "semi-monthly":
      return 24;
    case "monthly":
      return 12;
    default:
      return null;
  }
};

const getTotalCost = (monthlyPayment, totalPayments) => {
  return monthlyPayment * totalPayments;
};

const getTotalInterest = (principalAmount, monthlyPayment, totalPayments) => {
  return monthlyPayment * totalPayments - principalAmount;
};

const createPaymentSchedule = (principalAmount, monthlyPayment, totalPayments, monthlyRate) => {
  const schedule = [];
  let remainingBalance = principalAmount; // init

  for (let i = 1; i <= totalPayments; i++) {
    const interestPayment = remainingBalance * monthlyRate; // interest for this period
    const principalPayment = monthlyPayment - interestPayment; // principal paid
    remainingBalance -= principalPayment; // new remaining balance after this payment

    if (remainingBalance < 0) remainingBalance = 0; // edge case

    schedule.push({
      payment: i,
      principalPayment: principalPayment.toFixed(2),
      interestPayment: interestPayment.toFixed(2),
      totalPayment: monthlyPayment.toFixed(2),
      endingBalance: remainingBalance.toFixed(2),
    });
  }

  return schedule;
};

router.post("/", (req, res) => {
  const userInput = req.body;
  const { summary, schedule } = handleCalc(userInput);
  res.json({ summary, schedule });
});

// router.get("/schedule", (req, res) => {
//   const { schedule } = handleCalc(userInput);
//   res.json(schedule);
// });

module.exports = router;

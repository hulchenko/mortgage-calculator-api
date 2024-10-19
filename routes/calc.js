import express from "express";
import { percentToDecimal } from "../public/js/util.js";

const router = express.Router();

const handleCalc = ({ principalAmount = 0, rate = 0, term = 0, freqType = "monthly", deposit = 0 }) => {
  principalAmount = parseInt(principalAmount);
  rate = parseFloat(rate);
  term = parseInt(term); // years
  deposit = parseInt(deposit);

  const paymentsPerYear = getAnnualFreq(freqType);
  const totalPayments = term * paymentsPerYear;
  const ratePerPayment = getRatePerPayment(rate, paymentsPerYear);
  const singlePayment = getSinglePayment(principalAmount, ratePerPayment, totalPayments);
  const totalInterest = getTotalInterest(principalAmount, singlePayment, totalPayments).toFixed(2);
  const totalCost = getTotalCost(singlePayment, totalPayments).toFixed(2);

  const summary = {
    principalAmount,
    rate,
    term,
    totalPayments,
    singlePayment: singlePayment.toFixed(2),
    totalCost,
    totalInterest,
    deposit,
  };

  console.log(`summary: `, summary);

  const schedule = createPaymentSchedule(principalAmount, singlePayment, totalPayments, ratePerPayment, deposit);

  return { summary, schedule };
};

const getRatePerPayment = (ratePercent, paymentsPerYear) => {
  const annualRate = percentToDecimal(ratePercent);
  return annualRate / paymentsPerYear;
};

const getSinglePayment = (principalAmount, ratePerPayment, totalPayments) => {
  // M=P×(r(1+r)n/(1+r)n-1) monthly payment formula

  return (
    principalAmount *
    ((ratePerPayment * Math.pow(1 + ratePerPayment, totalPayments)) / (Math.pow(1 + ratePerPayment, totalPayments) - 1))
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

const getTotalCost = (singlePayment, totalPayments) => {
  return singlePayment * totalPayments;
};

const getTotalInterest = (principalAmount, singlePayment, totalPayments) => {
  return singlePayment * totalPayments - principalAmount;
};

const createPaymentSchedule = (principalAmount, singlePayment, totalPayments, ratePerPayment, deposit) => {
  const schedule = [];
  let remainingBalance = principalAmount; // init
  let prepayment = deposit;

  for (let i = 1; i <= totalPayments; i++) {
    const interestPayment = remainingBalance * ratePerPayment; // interest for this period
    const principalPayment = prepayment + singlePayment - interestPayment; // principal paid
    let lastPayment = remainingBalance;

    remainingBalance -= principalPayment; // new remaining balance after this payment
    prepayment = 0; // use down payment towards the first payment and deplete it afterwards

    if (remainingBalance < 0) {
      // calculate last payment
      schedule.push({
        payment: i,
        principalPayment: lastPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        totalPayment: (lastPayment + interestPayment).toFixed(2),
        endingBalance: 0,
      });
      break;
    }

    schedule.push({
      payment: i,
      principalPayment: principalPayment.toFixed(2),
      interestPayment: interestPayment.toFixed(2),
      totalPayment: singlePayment.toFixed(2),
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

export default router;

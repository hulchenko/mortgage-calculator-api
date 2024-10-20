import express from "express";
import { percentToDecimal } from "../public/js/util.js";

const router = express.Router();

const handleCalc = ({ principalAmount = 0, rate = 0, amortization = 0, freqType = "monthly", term = 0, deposit = 0 }) => {
  principalAmount = parseInt(principalAmount) || 0;
  rate = parseFloat(rate) || 0;
  amortization = parseInt(amortization) || 0;
  term = parseInt(term) || 0;
  deposit = parseInt(deposit) || 0;

  console.log({ principalAmount, rate, amortization, freqType, term, deposit });

  const paymentsPerYear = getAnnualFreq(freqType);
  const ratePerPayment = getRatePerPayment(rate, paymentsPerYear);

  // Per amortization period
  const amortizationPaymentsQty = amortization * paymentsPerYear;
  const singlePayment = getSinglePayment(principalAmount, ratePerPayment, amortizationPaymentsQty);
  const amortizationInterest = getTotalInterest(principalAmount, singlePayment, amortizationPaymentsQty);
  const amortizationCost = getTotalCost(singlePayment, amortizationPaymentsQty);

  // Per term period
  const termPaymentsQty = term * paymentsPerYear;
  const { termInterest, termPrincipalAmount } = getTermData(principalAmount, singlePayment, termPaymentsQty, ratePerPayment, deposit);
  const termCost = getTotalCost(singlePayment, termPaymentsQty);

  const summary = {
    termPaymentsQty,
    termPrincipalAmount: termPrincipalAmount.toFixed(2),
    termInterest: termInterest.toFixed(2),
    termCost: termCost.toFixed(2),
    amortizationPaymentsQty,
    singlePayment: singlePayment.toFixed(2),
    deposit,
    principalAmount: principalAmount.toFixed(2),
    amortizationInterest: amortizationInterest.toFixed(2),
    amortizationCost: amortizationCost.toFixed(2),
  };

  console.log(`summary: `, summary);

  const schedule = createPaymentSchedule(principalAmount, singlePayment, amortizationPaymentsQty, ratePerPayment, deposit);

  return { summary, schedule };
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

const getRatePerPayment = (ratePercent, paymentsPerYear) => {
  const annualRate = percentToDecimal(ratePercent);
  return annualRate / paymentsPerYear;
};

const getSinglePayment = (principalAmount, ratePerPayment, totalPayments) => {
  // M=P×(r(1+r)n/(1+r)n-1) monthly payment formula

  return principalAmount * ((ratePerPayment * Math.pow(1 + ratePerPayment, totalPayments)) / (Math.pow(1 + ratePerPayment, totalPayments) - 1));
};

const getTotalCost = (singlePayment, totalPayments) => {
  console.log(`answer: `, [singlePayment, totalPayments]);
  return singlePayment * totalPayments;
};

const getTotalInterest = (principalAmount, singlePayment, totalPayments) => {
  return singlePayment * totalPayments - principalAmount;
};

const getTermData = (principalAmount, singlePayment, termPayments, ratePerPayment, deposit) => {
  let remainingBalance = principalAmount;
  let prepayment = deposit;

  let termInterest = 0;
  let termPrincipalAmount = 0;

  while (termPayments) {
    const currInterest = remainingBalance * ratePerPayment;
    const currPrincipal = prepayment + singlePayment - currInterest;

    remainingBalance -= currPrincipal;
    prepayment = 0;
    termPayments--;

    termInterest += currInterest;
    termPrincipalAmount += currPrincipal;
  }

  return { termInterest, termPrincipalAmount };
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

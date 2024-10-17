const express = require("express");
const router = express.Router();

let calculations = [];

const handleCalc = ({
  amount = 0,
  interest = 0,
  term = 0,
  freqType,
  deposit = 0,
}) => {
  // Calculation logic
  // 1. Amount
  // 2. Interest rate
  // 3. Amortization Period(First time buyer ? max(30) : max(25))
  // 4. Payment frequency
  // 5. Deposit amount
  calculations = [];
  // Calculate monthly mortgage payment
  const annualPayments = getAnnualFreq(freqType); // annual amount of payments
  const interestPayment = getInterestPayment(interest, amount, annualPayments); // interest rate per payment
  console.log(interestPayment);
  const totalPayments = term * annualPayments; // total amount of payments
  console.log(totalPayments);
  const principalPayment =
    (amount * interestPayment) /
    (1 - Math.pow(1 + interestPayment, -totalPayments));
  console.log(principalPayment);

  // Store the calculation result
  const result = {
    amount,
    interestRate: interest,
    term,
    deposit,
    principalPayment: principalPayment.toFixed(2),
    interestPayment: interestPayment.toFixed(2),
    timestamp: new Date().toISOString(),
  };

  console.log(`result: `, result);

  calculations.push(result);
};

const getAnnualFreq = (type) => {
  console.log(`TYPE: `, type);
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

const getInterestPayment = (int, amount, freq) => {
  return int / amount / freq;
};

// router.get("/", (req, res) => {
//   console.log(`get fired`);
//   res.json(calculations);
// });

router.post("/", (req, res) => {
  console.log(`post fired`);
  const userInput = req.body;
  handleCalc(userInput);
  res.json(calculations);
});

module.exports = router;

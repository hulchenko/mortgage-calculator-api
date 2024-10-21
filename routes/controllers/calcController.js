import { formatNum } from "../utils/format.js";

export const calculateMortgage = (req, res, next) => {
  let { principalAmount, rate, amortization, freqType, term, deposit } = req.body;

  principalAmount = parseInt(principalAmount) || 0;
  rate = parseFloat(rate) || 0;
  amortization = parseInt(amortization) || 0;
  term = parseInt(term) || 0;
  deposit = parseInt(deposit) || 0;

  try {
    const paymentsPerYear = getAnnualFreq(freqType);
    const ratePerPayment = getRatePerPayment(rate, paymentsPerYear);
    const amortizationPeriodPaymentsQty = amortization * paymentsPerYear; // pre deposit calculation
    const singlePayment = getSinglePayment(principalAmount, ratePerPayment, amortizationPeriodPaymentsQty);

    // Per term period
    const termPaymentsQty = term * paymentsPerYear;
    const { termInterest, termPrincipalAmount } = getTermData(principalAmount, singlePayment, termPaymentsQty, ratePerPayment, deposit);
    const termCost = getTotalCost(singlePayment, termPaymentsQty);

    // Generate schedule
    const schedule = createPaymentSchedule(principalAmount, singlePayment, amortizationPeriodPaymentsQty, ratePerPayment, deposit);

    // Per amortization period
    const amortizationPaymentsQty = depositReduceAmortizationPaymentQty(schedule, amortizationPeriodPaymentsQty, deposit);
    const amortizationInterest = getTotalInterest(principalAmount, singlePayment, amortizationPaymentsQty);
    const amortizationCost = getTotalCost(singlePayment, amortizationPaymentsQty);

    const summary = {
      termPaymentsQty,
      termPrincipalAmount: formatNum(termPrincipalAmount),
      termInterest: formatNum(termInterest),
      termCost: formatNum(termCost),
      amortizationPaymentsQty,
      singlePayment: formatNum(singlePayment),
      deposit: formatNum(deposit),
      principalAmount: formatNum(principalAmount),
      amortizationInterest: formatNum(amortizationInterest),
      amortizationCost: formatNum(amortizationCost),
    };

    res.status(200).json({ summary, schedule });
  } catch (error) {
    return next(error);
  }
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
  const annualRate = parseFloat(ratePercent) / 100;
  return annualRate / paymentsPerYear;
};

const getSinglePayment = (principalAmount, ratePerPayment, totalPayments) => {
  // M=P×(r(1+r)n/(1+r)n-1) monthly payment formula

  return principalAmount * ((ratePerPayment * Math.pow(1 + ratePerPayment, totalPayments)) / (Math.pow(1 + ratePerPayment, totalPayments) - 1));
};

const getTotalCost = (singlePayment, totalPayments) => {
  return singlePayment * totalPayments;
};

const getTotalInterest = (principalAmount, singlePayment, totalPayments) => {
  return singlePayment * totalPayments - principalAmount;
};

const depositReduceAmortizationPaymentQty = (list, originalQty, deposit) => {
  // total amount changes based on deposit
  if (deposit && list.length) {
    return list[list.length - 1].payment;
  }
  return originalQty;
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
        principalPayment: formatNum(lastPayment),
        interestPayment: formatNum(interestPayment),
        totalPayment: formatNum(lastPayment + interestPayment),
        endingBalance: 0,
      });
      break;
    }

    schedule.push({
      payment: i,
      principalPayment: formatNum(principalPayment),
      interestPayment: formatNum(interestPayment),
      totalPayment: formatNum(singlePayment),
      endingBalance: formatNum(remainingBalance),
    });
  }

  return schedule;
};

const parseIntoCSV = (payments) => {
  let result = "Period, Principal Payment, Interest Payment, Total Payment, Ending Balance\n";
  payments.forEach((row) => {
    const { payment, principalPayment, interestPayment, totalPayment, endingBalance } = row;
    const rowStr = `${payment}, ${principalPayment}, ${interestPayment}, ${totalPayment}, ${endingBalance}\n`;
    result += rowStr;
  });
  return result;
};

export const generateCSV = (req, res, next) => {
  const paymentsList = req.body;
  const csvData = parseIntoCSV(paymentsList);

  if (!paymentsList.length || !csvData) {
    const error = new Error("Failed to parse CSV data");
    error.status = 500;
    return next(error);
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename='mortgage_report.csv'");
  res.status(201).send(csvData);
};

import fs from "node:fs";

const parseIntoCSV = (payments) => {
  let result = "Period, Principal Payment, Interest Payment, Total Payment, Ending Balance\n";
  payments.forEach((row) => {
    const { payment, principalPayment, interestPayment, totalPayment, endingBalance } = row;
    const rowStr = `${payment}, ${principalPayment}, ${interestPayment}, ${totalPayment}, ${endingBalance}\n`;
    result += rowStr;
  });
  return result;
};

const createFile = (payments) => {
  const path = `./test/mortgage_report.csv`; // TODO update
  const text = parseIntoCSV(payments);

  try {
    fs.writeFileSync(path, text);
    return { ok: false, msg: `Successfully saved to ${path}` };
  } catch (error) {
    return { ok: false, msg: `Failed to save the file to ${path}` };
  }
};

export const generateCSV = (req, res, next) => {
  const paymentsList = req.body;
  const response = createFile(paymentsList);
  if (!response.ok) {
    const error = new Error(response.msg);
    error.status = 500;
    return next(error);
  }
  res.status(200).json(response);
};

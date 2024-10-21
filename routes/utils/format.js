export const formatNum = (val) => {
  const fixedVal = val.toFixed(2);
  const formattedStr = fixedVal.toLocaleString("en-US");
  return `$${formattedStr}`;
};

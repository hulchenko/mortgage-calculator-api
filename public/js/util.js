export const percentToDecimal = (percent) => parseFloat(percent) / 100;

export const getFormData = () => {
  const principalAmount = document.getElementById("principal-amount").value;
  const rate = document.getElementById("rate").value;
  const term = document.getElementById("term").value;
  const freqType = document.getElementById("freq-type").value;
  const deposit = document.getElementById("deposit").value;

  // if (isNaN(loanAmount) || isNaN(intRate) || isNaN(loanTerm)) {
  //   alert("Please enter valid numeric values.");
  //   return null;
  // }
  // TODO replace with on - screen message

  return { principalAmount, rate, term, freqType, deposit };
};

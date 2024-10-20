export const percentToDecimal = (percent) => parseFloat(percent) / 100;

export const getFormData = () => {
  const principalAmount = document.getElementById("principal-amount").value;
  const rate = document.getElementById("rate").value;
  const amortization = document.getElementById("amortization").value;
  const freqType = document.getElementById("freq-type").value;
  const term = document.getElementById("term").value;
  const deposit = document.getElementById("deposit").value;

  // if (isNaN(loanAmount) || isNaN(intRate) || isNaN(loanTerm)) {
  //   alert("Please enter valid numeric values.");
  //   return null;
  // }
  // TODO replace with on - screen message

  return { principalAmount, rate, amortization, term, freqType, deposit };
};

export const store = (schedule) => {
  sessionStorage.removeItem("schedule");
  sessionStorage.setItem("schedule", JSON.stringify(schedule));
};

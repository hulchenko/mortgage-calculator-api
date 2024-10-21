const calcBtn = document.getElementById("calc");
const resetBtn = document.getElementById("reset");

const term = document.getElementById("term");
const amortization = document.getElementById("amortization");

const calculateMortgage = async () => {
  try {
    const formData = getFormData();

    const response = await fetch("/api/calc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const { summary, schedule } = await response.json();

    displaySummary(summary);
    storePaymentsList(schedule);
  } catch (error) {
    console.error("Failed to calculate mortgage:", error);
  }
};

const getFormData = () => {
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

const storePaymentsList = (schedule) => {
  sessionStorage.removeItem("schedule");
  sessionStorage.setItem("schedule", JSON.stringify(schedule));
};

const displaySummary = (data) => {
  const {
    termPaymentsQty,
    termPrincipalAmount,
    termInterest,
    termCost,
    amortizationPaymentsQty,
    singlePayment,
    deposit,
    principalAmount,
    amortizationInterest,
    amortizationCost,
  } = data;
  // {"principalAmount":100000,"rate":5,"term":5,"totalPayments":60,"monthlyPayment":"1887.12","totalCost":"113227.40","totalInterest":"13227.40"}
  const payments = document.getElementById("total-payments");
  payments.querySelector("td:nth-child(2)").textContent = termPaymentsQty;
  payments.querySelector("td:nth-child(3)").textContent = amortizationPaymentsQty;

  const mortgage = document.getElementById("mortage-payment");
  mortgage.querySelector("td:nth-child(2)").textContent = singlePayment;
  mortgage.querySelector("td:nth-child(3)").textContent = singlePayment;

  const prepayment = document.getElementById("prepayment");
  prepayment.querySelector("td:nth-child(2)").textContent = deposit;
  prepayment.querySelector("td:nth-child(3)").textContent = deposit;

  const principal = document.getElementById("principal");
  principal.querySelector("td:nth-child(2)").textContent = termPrincipalAmount;
  principal.querySelector("td:nth-child(3)").textContent = principalAmount;

  const interest = document.getElementById("interest");
  interest.querySelector("td:nth-child(2)").textContent = termInterest;
  interest.querySelector("td:nth-child(3)").textContent = amortizationInterest;

  const total = document.getElementById("total-cost");
  total.querySelector("td:nth-child(2)").textContent = termCost;
  total.querySelector("td:nth-child(3)").textContent = amortizationCost;
};

const generateAmortizationOptions = () => {
  const min = 1;
  const max = 30;

  for (let i = min; i <= max; i++) {
    amortization.options[amortization.options.length] = new Option(i, i);
  }
};

const generateTermOptions = () => {
  const min = 1;
  const max = 10;

  for (let i = min; i <= max; i++) {
    term.options[term.options.length] = new Option(i, i);
  }
};

// Event listeners
calcBtn.addEventListener("click", () => calculateMortgage());
resetBtn.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.reload();
});

// Generate HTML
generateAmortizationOptions();
generateTermOptions();

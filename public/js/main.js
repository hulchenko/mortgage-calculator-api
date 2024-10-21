const calcBtn = document.getElementById("calc");
const resetBtn = document.getElementById("reset");
const inputs = document.querySelectorAll("input");

const term = document.getElementById("term");
const amortization = document.getElementById("amortization");

const calculateMortgage = async () => {
  try {
    const formData = getFormData();
    if (!formData) return;

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

  if (parseInt(amortization) < parseInt(term)) {
    alert("The amortization period must be equal to or greater than the term.");
    return null;
  }

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
calcBtn.addEventListener("click", (event) => {
  // Below is a workaround to prevent form from clearing while preserving native HTML required fields check
  event.preventDefault();
  const form = document.getElementById("mortgageForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  calculateMortgage();
});
resetBtn.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.reload();
});
inputs.forEach((input) =>
  // 46 for delimeter/period
  // 48 -> 57 for 0-9
  input.addEventListener("keypress", (e) => {
    if (!(e.charCode >= 48 && e.charCode <= 57) && e.charCode !== 46) {
      e.preventDefault();
    }
  })
);

// Generate HTML
generateAmortizationOptions();
generateTermOptions();

const btn = document.getElementById("calc");
const summary = document.getElementById("calc-summary");

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

    // add another GET method for schedule
    // add another GET for fs for csv
    // use routing for schedule list + back to homepage

    const { summary, schedule } = await response.json();
    displaySummary(summary);
    displaySchedule(schedule);
    console.log(`SCHEDULE: `, schedule);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const getFormData = () => {
  const principalAmount = document.getElementById("principal-amount").value;
  const rate = document.getElementById("rate").value;
  const term = document.getElementById("term").value;
  // const freqType = document.getElementById("freq-type").value;
  // const deposit = document.getElementById("deposit").value;

  // if (isNaN(loanAmount) || isNaN(intRate) || isNaN(loanTerm)) {
  //   alert("Please enter valid numeric values.");
  //   return null;
  // }
  // TODO replace with on - screen message

  // return { principalAmount, rate, term, freqType, deposit };
  return { principalAmount, rate, term };
};

const displaySummary = (data) => {
  console.log(data);
  // {"principalAmount":100000,"rate":5,"term":5,"totalPayments":60,"monthlyPayment":"1887.12","totalCost":"113227.40","totalInterest":"13227.40"}
  const payments = document.getElementById("total-payments");
  payments.querySelector("td:nth-child(2)").textContent = data.totalPayments;
  payments.querySelector("td:nth-child(3)").textContent = data.totalPayments;

  const mortgage = document.getElementById("mortage-payment");
  mortgage.querySelector("td:nth-child(2)").textContent = data.monthlyPayment;
  mortgage.querySelector("td:nth-child(3)").textContent = data.monthlyPayment;

  const prepayment = document.getElementById("prepayment");
  prepayment.querySelector("td:nth-child(2)").textContent = data.prepayment;
  prepayment.querySelector("td:nth-child(3)").textContent = data.prepayment;

  const principal = document.getElementById("principal");
  principal.querySelector("td:nth-child(2)").textContent = data.principalAmount;
  principal.querySelector("td:nth-child(3)").textContent = data.principalAmount;

  const interest = document.getElementById("interest");
  interest.querySelector("td:nth-child(2)").textContent = data.totalInterest;
  interest.querySelector("td:nth-child(3)").textContent = data.totalInterest;

  const total = document.getElementById("total-cost");
  total.querySelector("td:nth-child(2)").textContent = data.totalCost;
  total.querySelector("td:nth-child(3)").textContent = data.totalCost;
};

const displaySchedule = (payments) => {
  document.getElementById("schedule").classList.remove("hidden"); // change table visibility
  const tableBody = document.getElementById("schedule-body");

  for (p of payments) {
    const row = document.createElement("tr");

    const period = document.createElement("th");
    period.textContent = p.payment;

    const principal = document.createElement("td");
    principal.textContent = p.principalPayment;

    const interest = document.createElement("td");
    interest.textContent = p.interestPayment;

    const total = document.createElement("td");
    total.textContent = p.totalPayment;

    const balance = document.createElement("td");
    balance.textContent = p.endingBalance;

    row.append(period, principal, interest, total, balance);
    tableBody.append(row);
  }
};

btn.addEventListener("click", () => calculateMortgage());

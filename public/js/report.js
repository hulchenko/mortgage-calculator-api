const generateBtn = document.getElementById("generate-btn");
const paymentsList = JSON.parse(sessionStorage.getItem("schedule"));

const displaySchedule = (payments) => {
  document.getElementById("schedule").classList.remove("hidden"); // change table visibility

  if (!payments) return;

  const tableBody = document.getElementById("schedule-body");
  tableBody.innerHTML = ""; // clean-up for subsequent calls

  for (const p of payments) {
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

const generateFile = async () => {
  const response = await fetch("/api/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentsList),
  });
};

// Event listeners
generateBtn.addEventListener("click", () => generateFile());

// Generate HTML
displaySchedule(paymentsList);

const downloadBtn = document.getElementById("download-btn");
const paymentsList = JSON.parse(sessionStorage.getItem("schedule"));

const displaySchedule = (payments) => {
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

const downloadBlob = (blob) => {
  // Create a download link and trigger it
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);

  link.href = url;
  link.download = "mortgage_report.csv"; // The file name the user will download
  document.body.appendChild(link);
  link.click();

  // Clean up DOM
  window.URL.revokeObjectURL(url);
  link.remove();
};

const downloadFile = async () => {
  if (!paymentsList) return;

  try {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentsList),
    });

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();
    downloadBlob(blob);
  } catch (error) {
    console.error(error);
  }
};

// Event listeners
downloadBtn.addEventListener("click", () => downloadFile());

// Generate HTML
displaySchedule(paymentsList);

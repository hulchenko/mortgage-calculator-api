const btn = document.getElementById("calc");

const calculateMortgage = async () => {
  try {
    const formData = getFormData();
    console.log(`FORM DATA: `, formData);

    const response = await fetch("/api/calc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log(`RESPONSE: `, response);

    const data = await response.json();

    console.log(`DATA: `, data);

    document.getElementById("calc-summary").innerHTML = JSON.stringify(data[0]);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const getFormData = () => {
  const amount = document.getElementById("amount").value;
  const interest = document.getElementById("interest").value;
  const term = document.getElementById("term").value;
  const freqType = document.getElementById("freq-type").value;
  const deposit = document.getElementById("deposit").value;

  // if (isNaN(loanAmount) || isNaN(intRate) || isNaN(loanTerm)) {
  //   alert("Please enter valid numeric values.");
  //   return null;
  // }
  // TODO replace with on - screen message

  return { amount, interest, term, freqType, deposit };
};

btn.addEventListener("click", () => calculateMortgage());

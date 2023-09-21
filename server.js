const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// In-memory data storage
const calculations = [];

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define an API endpoint for calculating mortgage
app.post('/calculate-mortgage', (req, res) => {
    // Get loan details from the request body
    const { loanAmount, interestRate, loanTerm } = req.body;

    // Calculate monthly mortgage payment
    const monthlyInterestRate = (interestRate / 100) / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

    // Store the calculation result
    const calculationResult = {
        loanAmount,
        interestRate,
        loanTerm,
        monthlyPayment: monthlyPayment.toFixed(2),
        timestamp: new Date().toISOString(),
    };
    calculations.push(calculationResult);
    // Respond with the calculated monthly payment in JSON format
    res.json(calculationResult);
});

// Define an API endpoint to retrieve all calculations
app.get('/calculations', (req, res) => {
    res.json(calculations);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

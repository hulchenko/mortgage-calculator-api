## Mortgage Calculator API

This is a **Mortgage Calculator** API built using **Express.js**.
The application provides functionality to calculate mortgage payment schedules and generate CSV reports of the mortgage payment breakdown.
The API takes into account variables such as the principal loan amount, interest rate, amortization period, term, and optional deposit, returning a detailed payment schedule and cost summary.

<img src="https://raw.githubusercontent.com/hulchenko/mortgage-calculator-api/refs/heads/main/public/images/mortgage_calculator.jpg" alt="App Screenshot"/>

### Features:

- **Mortgage Calculation**: Calculates mortgage payment schedules based on user-provided data (principal, interest rate, term, etc.).
- **Down Payment Support**: Adjusts payment schedule and calculations if a deposit/down payment is made.
- **CSV Generation**: Generates downloadable CSV reports for the mortgage payment schedule.
- **Error Handling**: Manages various input errors (such as invalid values) and handles them gracefully with proper error messages.

### Technologies Used:

- **Express.js**: Backend framework.
- **JavaScript**: Core programming logic for mortgage calculation.
- **CSV Parsing**: Generates downloadable CSV reports. See [example_mortgage_report.csv](./public/docs/example_mortgage_report.csv).

### Live Demo:
You can access the live demo of app here: https://mortgage-calculator-api-ten.vercel.app

### Example Usage:

1. **Fill Out the Form**
2. **Calculate Mortgage**
3. **Download Reports**

---

Enjoy calculating your mortgage payments and generating easy-to-read reports!

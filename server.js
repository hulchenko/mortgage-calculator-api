const express = require("express");
const calc = require("./routes/calc");

// Initialize app
const app = express();

// Render homepage
app.use(express.static(__dirname));

// Body parse for json, raw and x-www-form-urlencoded methods
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // extended arg for body-parser deprecated undefined error

// API routes
app.use("/api/calc", calc);

app.listen(3000);

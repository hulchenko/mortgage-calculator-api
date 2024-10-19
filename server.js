import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import calc from "./routes/calc.js";
import report from "./routes/report.js";

// Initialize app
const app = express();

// Render homepage (__dirname's workaround for ES module update from CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// Body parse for json, raw and x-www-form-urlencoded methods
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // extended arg for body-parser deprecated undefined error

// API routes
app.use("/api/calc", calc);
app.use("/api/report", report);

app.listen(3000, () => console.log("Server is running on port 3000"));

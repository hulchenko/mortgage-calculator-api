import { generateCSV } from "./controllers/reportController.js";
import express from "express";

const router = express.Router();

router.post("/", generateCSV);

export default router;

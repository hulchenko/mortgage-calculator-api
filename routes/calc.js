import { calculateMortgage } from "./controllers/calcController.js";
import express from "express";

const router = express.Router();

router.post("/", calculateMortgage);

export default router;

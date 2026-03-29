import express from "express";
import { negotiatePrice } from "../controllers/ai.controller.js";

const router = express.Router();

// POST /api/ai
router.post("/", negotiatePrice);

export default router;
import express from "express";
import { addScore, getLeaderboard } from "../controllers/score.controller.js";

const router = express.Router();

router.get("/", getLeaderboard);
router.post("/", addScore);

export default router;
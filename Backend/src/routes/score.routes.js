import { Router } from "express";
import { addScore, getLeaderboard } from "../controllers/score.controller.js";

const router = Router();

router.post("/", addScore);
router.get("/", getLeaderboard);

export default router;
import express from "express";
import cors from "cors";

import scoreRoutes from "./routes/score.routes.js";
import aiRoutes from "./routes/ai.routes.js"; // 🔥 ADD THIS

const app = express();

// 🔧 middlewares
app.use(cors());
app.use(express.json());

// 🏠 test route (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 📊 score routes
app.use("/api/score", scoreRoutes);

// 🤖 AI routes (IMPORTANT)
app.use("/api/ai", aiRoutes);

export default app;
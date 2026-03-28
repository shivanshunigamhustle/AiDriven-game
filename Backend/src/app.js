import express from "express";
import cors from "cors";
import scoreRoutes from "./routes/score.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/score", scoreRoutes);

export default app;
import Score from "../models/Score.js";
import { getIO } from "../sockets/socket.js";

export const addScore = async (req, res) => {
  try {
    const { name, score } = req.body;

    const newScore = await Score.create({ name, score });
const io = getIO(); 
io.emit("new_score", newScore);
    res.json(newScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const data = await Score.find()
      .sort({ score: -1 })
      .limit(10);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
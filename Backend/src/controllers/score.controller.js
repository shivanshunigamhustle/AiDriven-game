import Score from "../models/Score.js";
import { getIO } from "../sockets/socket.js";

export const addScore = async (req, res) => {
  try {
    const { name, score, product, dealPrice, rounds } = req.body;

    if (!name || !score) {
      return res.status(400).json({ error: "Name and score required" });
    }

    // ✅ Same player ka best score hi save hoga
    const existing = await Score.findOne({ name });

    let saved;
    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.product = product || existing.product;
        existing.dealPrice = dealPrice || existing.dealPrice;
        existing.rounds = rounds || existing.rounds;
        saved = await existing.save();
      } else {
        // Purana score better tha — update mat karo
        saved = existing;
      }
    } else {
      // Naya player
      saved = await Score.create({ name, score, product, dealPrice, rounds });
    }

    // ✅ Socket broadcast
    const io = getIO();
    io.emit("new_score", saved);

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const data = await Score.find()
      .sort({ score: -1 })
      .limit(50);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
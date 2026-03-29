import { useEffect, useState } from "react";
import API from "../services/api";
import { socket } from "../services/socket";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/score").then(res => setScores(res.data));
  }, []);

  useEffect(() => {
    socket.on("new_score", (data) => {
      setScores(prev => [data, ...prev]);
    });

    return () => socket.off("new_score");
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">

      <button onClick={() => navigate("/")}>🏠 Home</button>

      <h1 className="text-3xl mb-6">🏆 Leaderboard</h1>

      {scores.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gray-800 p-4 mb-3 rounded-xl flex justify-between shadow"
        >
          <span>{s.name}</span>
          <span>{s.score}</span>
        </motion.div>
      ))}

    </div>
  );
}
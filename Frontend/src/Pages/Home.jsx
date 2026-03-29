import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold mb-12"
      >
        🎮 Negotiation Arena
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-5 w-72"
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/game")}
          className="bg-blue-600 py-4 rounded-xl text-lg shadow-lg"
        >
          ▶ Start Game
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/leaderboard")}
          className="bg-gray-700 py-4 rounded-xl text-lg shadow-lg"
        >
          🏆 Leaderboard
        </motion.button>
      </motion.div>

    </div>
  );
}
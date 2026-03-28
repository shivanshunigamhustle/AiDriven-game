import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-6">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-center"
      >
        🧠 AI Negotiation Game
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-gray-400 text-center max-w-xl"
      >
        Convince the AI seller. Crack the lowest deal.  
        Outsmart the system and dominate the leaderboard.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex gap-4"
      >
        {/* 🎮 Start Game */}
        <button
          onClick={() => navigate("/game")}
          className="bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:scale-105 transition"
        >
          🎮 Start Game
        </button>

        {/* 🏆 Leaderboard */}
        <button
          onClick={() => navigate("/leaderboard")}
          className="bg-gray-700 px-6 py-3 rounded-lg text-lg hover:bg-gray-600 hover:scale-105 transition"
        >
          🏆 Leaderboard
        </button>
      </motion.div>

      {/* Feature Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">

        {[
          {
            title: "🤖 Smart AI",
            desc: "AI adapts to your negotiation style dynamically.",
          },
          {
            title: "🎯 Strategy",
            desc: "Every message impacts the deal outcome.",
          },
          {
            title: "🏆 Compete",
            desc: "Get lowest price and climb leaderboard.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.2 }}
            className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm">{card.desc}</p>
          </motion.div>
        ))}

      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-16 text-gray-500 text-sm"
      >
        Built with ❤️ using MERN + AI
      </motion.p>

    </div>
  );
}
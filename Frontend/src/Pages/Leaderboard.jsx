import { motion } from "framer-motion";

export default function Leaderboard() {

  // fake data (later backend se ayega)
  const players = [
    { name: "Shivanshu", price: 620 },
    { name: "Aman", price: 650 },
    { name: "Riya", price: 670 },
    { name: "Rahul", price: 700 },
    { name: "Neha", price: 720 },
  ];

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 py-10">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-10">
        🏆 Leaderboard
      </h1>

      {/* 🥇 Top 3 Section */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-12">

        {top3.map((player, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className={`p-6 rounded-xl text-center w-40 ${
              index === 0
                ? "bg-yellow-500 text-black scale-110"
                : index === 1
                ? "bg-gray-300 text-black"
                : "bg-orange-400 text-black"
            }`}
          >
            <h2 className="text-2xl font-bold">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </h2>
            <p className="mt-2 font-semibold">{player.name}</p>
            <p className="text-sm">₹{player.price}</p>
          </motion.div>
        ))}

      </div>

      {/* 📊 Rest Leaderboard */}
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-4 shadow-lg">

        {rest.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex justify-between items-center p-3 border-b border-gray-700 hover:bg-gray-700 rounded-lg transition"
          >
            <span>#{index + 4}</span>
            <span>{player.name}</span>
            <span className="font-semibold text-green-400">
              ₹{player.price}
            </span>
          </motion.div>
        ))}

      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 mt-10 text-sm">
        Lowest price wins 🚀
      </p>

    </div>
  );
}
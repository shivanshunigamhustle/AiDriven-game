import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../services/socket";
import { motion, AnimatePresence } from "framer-motion";

const Game = () => {
  const [offer, setOffer] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [score, setScore] = useState(0);

  const chatRef = useRef(null);

  const roomId = "room1";
  const playerName = "You";

  // 🔌 socket connect
  useEffect(() => {
    socket.emit("join_room", { roomId, username: playerName });

    socket.on("receive_offer", (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "other", text: `${data.player}: ₹${data.offer}` },
      ]);
    });

    return () => {
      socket.off("receive_offer");
    };
  }, []);

  // 📜 auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 💰 submit offer
  const handleSubmit = async () => {
    if (!offer || loading) return;

    const userMsg = { role: "user", text: `₹${offer}` };
    setMessages((prev) => [...prev, userMsg]);

    socket.emit("send_offer", {
      roomId,
      offer,
      player: playerName,
    });

    setLoading(true);
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:3000/api/ai", {
        offer,
        history: messages,
      });

      setTimeout(() => {
        const aiMsg = { role: "ai", text: res.data.reply };

        setMessages((prev) => [...prev, aiMsg]);
        setScore(res.data.score);

        setTyping(false);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setTyping(false);
    }

    setOffer("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      
      {/* 🎮 Main Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4">

        {/* 🔥 Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">💰 Bargain Battle</h1>
          <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-sm">
            Score: {score}
          </div>
        </div>

        {/* 💬 Chat */}
        <div
          ref={chatRef}
          className="h-80 overflow-y-auto space-y-2 mb-4 pr-1"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`p-2 px-3 rounded-xl text-sm max-w-[75%] ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : msg.role === "ai"
                    ? "bg-green-500 text-white"
                    : "bg-purple-500 text-white"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 🤖 typing indicator */}
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-sm"
            >
              Shopkeeper is typing... 🤖
            </motion.div>
          )}
        </div>

        {/* 💸 FORM INPUT (ENTER FIXED) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex gap-2"
        >
          <input
            type="number"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="Enter your offer ₹..."
            className="flex-1 p-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg transition font-semibold"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Game;
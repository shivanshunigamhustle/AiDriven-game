import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../services/socket";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const [offer, setOffer] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // "win" | "lose"

  const chatRef = useRef(null);
  const navigate = useNavigate();

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

  // 🔄 restart game
  const handleRestart = () => {
    setMessages([]);
    setOffer("");
    setScore(0);
    setGameOver(false);
    setGameResult(null);
    setLoading(false);
    setTyping(false);
  };

  // 💰 submit offer
  const handleSubmit = async () => {
    if (!offer || loading || gameOver) return;

    const numOffer = parseInt(offer);

    // Win/lose logic
    if (numOffer >= 700 && numOffer <= 1000) {
      if (numOffer <= 750) {
        setGameOver(true);
        setGameResult("win");
      }
    } else if (numOffer < 500) {
      setGameOver(true);
      setGameResult("lose");
    }

    const userMsg = { role: "user", text: `₹${offer}` };
    setMessages((prev) => [...prev, userMsg]);

    socket.emit("send_offer", { roomId, offer, player: playerName });

    setLoading(true);
    setTyping(true);

    try {
      const res = await axios.post("https://aidriven-game.onrender.com/api/ai", {
        offer,
        history: messages,
      });

      setTimeout(() => {
        const aiMsg = { role: "ai", text: res.data.reply };
        setMessages((prev) => [...prev, aiMsg]);
        if (res.data.score) setScore(res.data.score);
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
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>

      {/* 🌟 Glow BG Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">

        {/* 🔙 Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-all duration-200 group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-lg font-black text-white tracking-widest uppercase">
              💰 Bargain Battle
            </h1>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-white/60 hover:text-yellow-400 transition-all duration-200 group"
            title="Restart Game"
          >
            <span className="text-sm font-medium">Restart</span>
            <span className="text-xl group-hover:rotate-180 transition-transform duration-300">↺</span>
          </button>
        </div>

        {/* 🎮 Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* 🏷️ Score Bar */}
          <div className="flex justify-between items-center px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-xs font-medium uppercase tracking-widest">Live</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
              <span className="text-yellow-400 text-xs font-bold">🏆 Score: {score}</span>
            </div>
            <div className="text-white/30 text-xs">Room: {roomId}</div>
          </div>

          {/* 💬 Chat Area */}
          <div
            ref={chatRef}
            className="h-80 overflow-y-auto px-4 py-3 space-y-3"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Intro message */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center gap-3"
              >
                <div className="text-4xl">🛒</div>
                <p className="text-white/40 text-sm">
                  Shopkeeper ka starting price hai <span className="text-white font-bold">₹1000</span>
                </p>
                <p className="text-white/30 text-xs">
                  Apna offer bhejo aur bargain karo!
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role !== "user" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1"
                      style={{ background: msg.role === "ai" ? "rgba(34,197,94,0.2)" : "rgba(168,85,247,0.2)" }}>
                      {msg.role === "ai" ? "🧔" : "👤"}
                    </div>
                  )}
                  <div
                    className="px-4 py-2 rounded-2xl text-sm max-w-[72%] leading-relaxed"
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                          : msg.role === "ai"
                          ? "linear-gradient(135deg, #059669, #10b981)"
                          : "linear-gradient(135deg, #7c3aed, #a855f7)",
                      borderRadius:
                        msg.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span className="text-white">{msg.text}</span>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1"
                      style={{ background: "rgba(99,102,241,0.2)" }}>
                      😎
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 🤖 Typing Indicator */}
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "rgba(34,197,94,0.2)" }}>🧔</div>
                <div className="px-4 py-3 rounded-2xl flex gap-1 items-center"
                  style={{ background: "rgba(255,255,255,0.08)", borderRadius: "18px 18px 18px 4px" }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-white/50"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* 🏁 Game Over Banner */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                className="mx-4 mb-3 p-3 rounded-2xl text-center"
                style={{
                  background: gameResult === "win"
                    ? "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.1))"
                    : "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.1))",
                  border: `1px solid ${gameResult === "win" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                <p className="text-2xl mb-1">{gameResult === "win" ? "🎉" : "😢"}</p>
                <p className="text-white font-bold text-sm">
                  {gameResult === "win" ? "Badiya deal! Jeet gaye aap!" : "Deal nahi bani... Try again!"}
                </p>
                <button onClick={handleRestart}
                  className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all"
                  style={{ background: gameResult === "win" ? "#10b981" : "#ef4444" }}>
                  Play Again ↺
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 💸 Input Area */}
          <div className="px-4 pb-4">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder="Apna offer daalo..."
                  disabled={gameOver}
                  className="w-full pl-7 pr-3 py-3 rounded-xl text-white placeholder-white/30 outline-none text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || gameOver}
                className="px-5 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-40"
                style={{
                  background: loading
                    ? "rgba(99,102,241,0.4)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(99,102,241,0.4)",
                }}
              >
                {loading ? "⏳" : "Send 🚀"}
              </button>
            </form>

            {/* 💡 Hint */}
            <p className="text-center text-white/20 text-xs mt-2">
              Min: ₹700 · Start: ₹1000 · Sweet spot: ₹750
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Game;
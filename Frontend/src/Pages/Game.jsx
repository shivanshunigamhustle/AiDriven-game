import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PRODUCTS = [
  {
    id: "phone",
    name: "Smartphone",
    emoji: "📱",
    description: "Latest Android, 128GB",
    startPrice: 15000,
    minPrice: 10000,
    category: "Electronics",
  },
  {
    id: "jacket",
    name: "Leather Jacket",
    emoji: "🧥",
    description: "Genuine leather, brown",
    startPrice: 3000,
    minPrice: 1800,
    category: "Clothes",
  },
  {
    id: "veggies",
    name: "Vegetable Basket",
    emoji: "🥦",
    description: "1kg each — tomato, onion, potato",
    startPrice: 300,
    minPrice: 180,
    category: "Grocery",
  },
  {
    id: "sofa",
    name: "3-Seater Sofa",
    emoji: "🛋️",
    description: "Fabric sofa, grey color",
    startPrice: 25000,
    minPrice: 17000,
    category: "Furniture",
  },
];

const calcScore = (product, dealPrice, rounds) => {
  const savings = product.startPrice - dealPrice;
  const maxSavings = product.startPrice - product.minPrice;
  const savingsPct = Math.min(savings / maxSavings, 1);
  const roundBonus = Math.max(0, 10 - rounds) * 5;
  return Math.round(savingsPct * 800 + roundBonus + 100);
};

export default function Game({ playerName }) {
  const [phase, setPhase] = useState("select");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [offer, setOffer] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [dealPrice, setDealPrice] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const chatRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const startGame = (product) => {
    setSelectedProduct(product);
    setPhase("play");
    setMessages([{
      role: "ai",
      text: `Namaste! Aaj main aapko yeh ${product.name} sirf ₹${product.startPrice.toLocaleString()} mein de sakta hoon. Kya offer karenge? 😊`,
    }]);
    setScore(0);
    setRounds(0);
    setDealPrice(null);
    setGameResult(null);
    setOffer("");
  };

  const handleRestart = () => {
    setPhase("select");
    setSelectedProduct(null);
    setMessages([]);
    setOffer("");
    setScore(0);
    setRounds(0);
    setDealPrice(null);
    setGameResult(null);
    setLoading(false);
    setTyping(false);
  };

  const handleSubmit = async () => {
    if (!offer || loading || phase !== "play") return;
    const numOffer = parseInt(offer);
    if (isNaN(numOffer) || numOffer <= 0) return;

    const newRounds = rounds + 1;
    setRounds(newRounds);

    const userMsg = { role: "user", text: `₹${numOffer.toLocaleString()}` };
    setMessages((prev) => [...prev, userMsg]);
    setOffer("");
    setLoading(true);
    setTyping(true);

    const isWin = numOffer >= selectedProduct.minPrice && numOffer <= selectedProduct.startPrice * 0.75;
    const isLose = numOffer < selectedProduct.minPrice * 0.6;

    try {
      const res = await API.post("/ai", {
        offer: numOffer,
        history: messages,
        product: {
          name: selectedProduct.name,
          startPrice: selectedProduct.startPrice,
          minPrice: selectedProduct.minPrice,
        },
      });

      setTimeout(async () => {
        const aiMsg = { role: "ai", text: res.data.reply };
        setMessages((prev) => [...prev, aiMsg]);
        setTyping(false);
        setLoading(false);

        if (isWin) {
          const finalScore = calcScore(selectedProduct, numOffer, newRounds);
          setScore(finalScore);
          setDealPrice(numOffer);
          setGameResult("win");
          setPhase("result");

          // ✅ Score backend pe save karo
          try {
            await API.post("/score", {
              name: playerName,
              score: finalScore,
              product: selectedProduct.name,
              dealPrice: numOffer,
              rounds: newRounds,
            });
          } catch (e) {
            console.error("Score save failed:", e);
          }

        } else if (isLose) {
          setGameResult("lose");
          setPhase("result");
        }
      }, 900);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setTyping(false);
    }
  };

  // ════════════════════════════════════════
  // SCREEN 1 — Product Selection
  // ════════════════════════════════════════
  if (phase === "select") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #0a0818, #1a1040, #0d1526)" }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:"absolute", top:"15%", left:"20%", width:350, height:350,
            borderRadius:"50%", background:"rgba(99,102,241,0.12)", filter:"blur(80px)" }} />
          <div style={{ position:"absolute", bottom:"15%", right:"15%", width:300, height:300,
            borderRadius:"50%", background:"rgba(139,92,246,0.1)", filter:"blur(80px)" }} />
        </div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="relative z-10 w-full max-w-lg">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate("/")}
              className="flex items-center gap-1 text-white/50 hover:text-white transition-all group text-sm">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Home
            </button>
            <div className="text-center">
              <h1 className="text-xl font-black text-white tracking-wide">🛒 Pick a Product</h1>
              <p className="text-white/30 text-xs mt-0.5">Kya kharidna hai aaj?</p>
            </div>
            <div className="w-16" />
          </div>

          {/* Player badge */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm"
              style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.25)", color:"#a5b4fc" }}>
              👤 {playerName}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale:1.04, y:-2 }}
                whileTap={{ scale:0.97 }}
                onClick={() => startGame(p)}
                className="text-left rounded-2xl p-4 transition-all"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}
              >
                <div style={{ fontSize:36, marginBottom:10 }}>{p.emoji}</div>
                <div className="text-white font-bold text-base">{p.name}</div>
                <div className="text-white/40 text-xs mt-1 mb-3">{p.description}</div>

                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/30">Shopkeeper asks</span>
                    <span className="text-white font-semibold">₹{p.startPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/30">Your target</span>
                    <span className="text-green-400 font-semibold">
                      ≤ ₹{Math.round(p.startPrice * 0.75).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-center py-1.5 rounded-xl text-xs font-bold text-white"
                  style={{ background:"rgba(99,102,241,0.3)", border:"1px solid rgba(99,102,241,0.4)" }}>
                  Bargain Now →
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // SCREEN 2 — Result
  // ════════════════════════════════════════
  if (phase === "result") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #0a0818, #1a1040, #0d1526)" }}>

        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          className="w-full max-w-sm text-center rounded-3xl p-8"
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(20px)" }}>

          <motion.div
            animate={{ scale:[1, 1.2, 1] }}
            transition={{ duration:0.6, delay:0.2 }}
            style={{ fontSize:64, marginBottom:16 }}>
            {gameResult === "win" ? "🎉" : "😢"}
          </motion.div>

          <h2 className="text-2xl font-black text-white mb-2">
            {gameResult === "win" ? "Deal Ho Gayi!" : "Deal Nahi Bani!"}
          </h2>

          {gameResult === "win" && (
            <>
              <p className="text-white/50 text-sm mb-6">
                {selectedProduct.emoji} {selectedProduct.name} — ₹{dealPrice?.toLocaleString()} mein liya!
              </p>

              <div className="rounded-2xl p-4 mb-6 text-left space-y-2"
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>

                {/* Player name */}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Player</span>
                  <span className="text-white font-semibold">👤 {playerName}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Starting price</span>
                  <span className="text-white">₹{selectedProduct.startPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Your deal</span>
                  <span className="text-green-400 font-bold">₹{dealPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">You saved</span>
                  <span className="text-yellow-400 font-bold">
                    ₹{(selectedProduct.startPrice - (dealPrice || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Rounds taken</span>
                  <span className="text-white">{rounds}</span>
                </div>

                <div className="h-px" style={{ background:"rgba(255,255,255,0.08)" }} />

                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Final Score</span>
                  <motion.span
                    initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ delay:0.4, type:"spring" }}
                    className="text-yellow-400 font-black text-xl">
                    🏆 {score}
                  </motion.span>
                </div>

                {/* Save confirmation */}
                <div className="flex items-center justify-center gap-2 text-xs rounded-lg py-1.5 mt-1"
                  style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#4ade80" }}>
                  ✅ Score leaderboard pe save ho gaya!
                </div>
              </div>
            </>
          )}

          {gameResult === "lose" && (
            <p className="text-white/50 text-sm mb-6">
              Offer bahut kam tha! Shopkeeper ne deal tod di. 😤<br />
              <span className="text-white/30 text-xs">
                Min price tha: ₹{selectedProduct?.minPrice.toLocaleString()}
              </span>
            </p>
          )}

          <div className="flex gap-3">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={handleRestart}
              className="flex-1 py-3 rounded-xl font-bold text-white"
              style={{ background:"rgba(99,102,241,0.3)", border:"1px solid rgba(99,102,241,0.4)" }}>
              ↺ Play Again
            </motion.button>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => navigate("/leaderboard")}
              className="flex-1 py-3 rounded-xl font-bold"
              style={{ background:"rgba(234,179,8,0.15)", border:"1px solid rgba(234,179,8,0.3)", color:"#fbbf24" }}>
              🏆 Scores
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // SCREEN 3 — Game / Chat
  // ════════════════════════════════════════
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0a0818, #1a1040, #0d1526)" }}>

      <div className="relative w-full max-w-md z-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={handleRestart}
            className="flex items-center gap-1 text-white/50 hover:text-white transition-all group text-sm">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
          </button>
          <div className="text-center">
            <div className="text-white font-black text-base">
              {selectedProduct?.emoji} {selectedProduct?.name}
            </div>
            <div className="text-white/30 text-xs">{selectedProduct?.category}</div>
          </div>
          <button onClick={handleRestart}
            className="text-white/50 hover:text-yellow-400 transition-all text-sm flex items-center gap-1">
            New <span className="text-lg">↺</span>
          </button>
        </div>

        {/* Main card */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(20px)" }}>

          {/* Stats bar */}
          <div className="flex justify-between items-center px-5 py-3"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.2)" }}>
            <div className="flex flex-col items-center">
              <span className="text-white/30 text-xs">Asks</span>
              <span className="text-white font-bold text-sm">₹{selectedProduct?.startPrice.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white/30 text-xs">Target</span>
              <span className="text-green-400 font-bold text-sm">
                ≤ ₹{selectedProduct ? Math.round(selectedProduct.startPrice * 0.75).toLocaleString() : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white/30 text-xs">Rounds</span>
              <span className="text-white font-bold text-sm">{rounds}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ background:"rgba(234,179,8,0.15)", border:"1px solid rgba(234,179,8,0.25)" }}>
              <span className="text-yellow-400 text-xs font-bold">🏆 {score}</span>
            </div>
          </div>

          {/* Chat area */}
          <div ref={chatRef} className="h-80 overflow-y-auto px-4 py-3 space-y-3"
            style={{ scrollbarWidth:"none" }}>

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                <div style={{ fontSize:40 }}>{selectedProduct?.emoji}</div>
                <p className="text-white/30 text-sm">Bargaining shuru karo!</p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:8, scale:0.96 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration:0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1"
                      style={{ background:"rgba(34,197,94,0.2)" }}>🧔</div>
                  )}
                  <div className="px-4 py-2 text-sm max-w-[72%] leading-relaxed text-white"
                    style={{
                      background: msg.role === "user"
                        ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                        : "linear-gradient(135deg, #059669, #10b981)",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      boxShadow:"0 4px 15px rgba(0,0,0,0.2)",
                    }}>
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1"
                      style={{ background:"rgba(99,102,241,0.2)" }}>😎</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background:"rgba(34,197,94,0.2)" }}>🧔</div>
                <div className="px-4 py-3 flex gap-1 items-center"
                  style={{ background:"rgba(255,255,255,0.08)", borderRadius:"18px 18px 18px 4px" }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-white/50"
                      animate={{ y:[0,-4,0] }}
                      transition={{ duration:0.6, repeat:Infinity, delay:i*0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input area */}
          <div className="px-4 pb-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder="Apna offer daalo..."
                  className="w-full pl-7 pr-3 py-3 rounded-xl text-white placeholder-white/30 outline-none text-sm"
                  style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)" }}
                />
              </div>
              <button type="submit" disabled={loading}
                className="px-5 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
                style={{ background:"linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(99,102,241,0.4)" }}>
                {loading ? "⏳" : "Send 🚀"}
              </button>
            </form>

            <p className="text-center text-white/20 text-xs mt-2">
              Min: ₹{selectedProduct?.minPrice.toLocaleString()} · Target: ≤ ₹
              {selectedProduct ? Math.round(selectedProduct.startPrice * 0.75).toLocaleString() : "—"}
            </p>
          </div>
        </motion.div>

        {/* Player tag */}
        <div className="flex justify-center mt-3">
          <div className="text-white/20 text-xs">Playing as 👤 {playerName}</div>
        </div>
      </div>
    </div>
  );
}
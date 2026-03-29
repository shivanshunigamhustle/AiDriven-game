import { useState } from "react";
import { motion } from "framer-motion";

export default function Auth({ onSave }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    if (!input.trim()) return setError("Naam toh batao bhai! 😅");
    if (input.trim().length < 2) return setError("Kam se kam 2 characters chahiye");
    onSave(input.trim());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0a0818, #1a1040, #0d1526)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:"absolute", top:"20%", left:"20%", width:300, height:300,
          borderRadius:"50%", background:"rgba(99,102,241,0.15)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", bottom:"20%", right:"15%", width:280, height:280,
          borderRadius:"50%", background:"rgba(139,92,246,0.12)", filter:"blur(80px)" }} />
      </div>

      <motion.div
        initial={{ opacity:0, y:30, scale:0.95 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-3xl p-8 text-center"
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(20px)" }}>

          <motion.div
            animate={{ rotate:[0,-10,10,-10,0] }}
            transition={{ delay:0.5, duration:0.6 }}
            style={{ fontSize:56, marginBottom:16 }}
          >
            🛒
          </motion.div>

          <h1 className="text-2xl font-black text-white mb-2">Negotiation Arena</h1>
          <p className="text-white/40 text-sm mb-8">
            Pehle apna naam batao — leaderboard pe immortal ho jao!
          </p>

          <div className="mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              placeholder="Tumhara naam kya hai? 😎"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none text-center text-base"
              style={{
                background:"rgba(255,255,255,0.08)",
                border:`1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"}`,
              }}
            />
            {error && (
              <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
                className="text-red-400 text-xs mt-2">{error}</motion.p>
            )}
          </div>

          <p className="text-white/20 text-xs mb-6">{input.length}/20 characters</p>

          <motion.button
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={handle}
            disabled={!input.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-white text-base disabled:opacity-40"
            style={{
              background:"linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: input.trim() ? "0 4px 20px rgba(99,102,241,0.4)" : "none",
            }}
          >
            Let's Play! 🎮
          </motion.button>

          <p className="text-white/20 text-xs mt-4">Naam sirf is device pe save hoga</p>
        </div>
      </motion.div>
    </div>
  );
}
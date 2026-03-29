import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const features = [
  { icon: "🤖", label: "AI Shopkeeper", desc: "Powered by Groq LLaMA" },
  { icon: "🛒", label: "4 Products", desc: "Phone, Clothes, Veggies, Furniture" },
  { icon: "🏆", label: "Leaderboard", desc: "Compete globally" },
];

export default function Home() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);
  const [hovered, setHovered] = useState(null);

  const theme = {
    bg: dark
      ? "linear-gradient(135deg, #0a0818 0%, #1a1040 50%, #0d1526 100%)"
      : "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%)",
    text: dark ? "#ffffff" : "#0f0a2e",
    textSub: dark ? "rgba(255,255,255,0.65)" : "rgba(15,10,46,0.65)",
    textMuted: dark ? "rgba(255,255,255,0.4)" : "rgba(15,10,46,0.45)",
    toggleBg: dark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.1)",
    toggleBorder: dark ? "rgba(255,255,255,0.15)" : "rgba(99,102,241,0.25)",
    toggleColor: dark ? "#fff" : "#4338ca",
    featBg: dark ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.04)",
    featBorder: dark ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.12)",
    featText: dark ? "rgba(255,255,255,0.5)" : "rgba(15,10,46,0.5)",
    divider: dark ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.1)",
    badge: dark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.12)",
    badgeText: dark ? "#a5b4fc" : "#4338ca",
    badgeBorder: dark ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.25)",
    btnSecBg: dark ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.08)",
    btnSecBorder: dark ? "rgba(255,255,255,0.12)" : "rgba(99,102,241,0.2)",
    btnSecColor: dark ? "rgba(255,255,255,0.85)" : "#3730a3",
    orb1: dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.12)",
    orb2: dark ? "rgba(139,92,246,0.12)" : "rgba(167,139,250,0.15)",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: theme.bg, transition: "background 0.5s ease" }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0,30,0], y: [0,-20,0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position:"absolute", top:"10%", left:"15%", width:400, height:400, borderRadius:"50%", background:theme.orb1, filter:"blur(80px)" }} />
        <motion.div animate={{ x: [0,-25,0], y: [0,30,0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{ position:"absolute", bottom:"15%", right:"10%", width:350, height:350, borderRadius:"50%", background:theme.orb2, filter:"blur(80px)" }} />
        <svg width="100%" height="100%" style={{ opacity: dark?0.04:0.06, position:"absolute", inset:0 }}>
          <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={dark?"white":"#4f46e5"} strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Theme toggle */}
      <motion.button initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        onClick={() => setDark(!dark)}
        style={{ position:"absolute", top:20, right:20, display:"flex", alignItems:"center", gap:8,
          padding:"8px 14px", borderRadius:50, background:theme.toggleBg, border:`1px solid ${theme.toggleBorder}`,
          color:theme.toggleColor, cursor:"pointer", fontSize:13, fontWeight:500, transition:"all 0.3s ease", zIndex:10 }}>
        <AnimatePresence mode="wait">
          <motion.span key={dark?"moon":"sun"} initial={{ rotate:-90, opacity:0 }} animate={{ rotate:0, opacity:1 }}
            exit={{ rotate:90, opacity:0 }} transition={{ duration:0.2 }}>
            {dark ? <MoonIcon /> : <SunIcon />}
          </motion.span>
        </AnimatePresence>
        {dark ? "Dark" : "Light"}
      </motion.button>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 16px", borderRadius:50,
            marginBottom:24, background:theme.badge, border:`1px solid ${theme.badgeBorder}`,
            color:theme.badgeText, fontSize:12, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>
          <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
          AI-Powered Negotiation Game
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }} style={{ marginBottom:12 }}>
          <h1 style={{ fontSize:"clamp(2.8rem, 8vw, 4rem)", fontWeight:900, lineHeight:1.1,
            letterSpacing:"-0.03em", color:theme.text, transition:"color 0.4s ease" }}>
            Negotiation
          </h1>
          <h1 style={{ fontSize:"clamp(2.8rem, 8vw, 4rem)", fontWeight:900, lineHeight:1.1,
            letterSpacing:"-0.03em", background:"linear-gradient(135deg, #818cf8, #c084fc, #fb7185)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Arena
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          style={{ fontSize:16, lineHeight:1.6, marginBottom:40, color:theme.textSub,
            transition:"color 0.4s ease", maxWidth:340 }}>
          Bargain with an AI shopkeeper. Pick a product,
          make your offer, and outsmart the AI.
        </motion.p>

        {/* Buttons */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          style={{ display:"flex", flexDirection:"column", gap:12, width:"100%" }}>

          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onHoverStart={() => setHovered("game")} onHoverEnd={() => setHovered(null)}
            onClick={() => navigate("/game")}
            style={{ padding:"16px 24px", borderRadius:16,
              background:"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border:"none", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              boxShadow:"0 4px 20px rgba(99,102,241,0.35)", letterSpacing:"-0.01em" }}>
            <motion.span animate={{ x: hovered==="game" ? 3 : 0 }} transition={{ type:"spring", stiffness:400 }} style={{ fontSize:20 }}>▶</motion.span>
            Start Game
            <span style={{ marginLeft:"auto", fontSize:11, fontWeight:500,
              background:"rgba(255,255,255,0.2)", padding:"3px 8px", borderRadius:20 }}>
              vs AI
            </span>
          </motion.button>

          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onHoverStart={() => setHovered("lb")} onHoverEnd={() => setHovered(null)}
            onClick={() => navigate("/leaderboard")}
            style={{ padding:"16px 24px", borderRadius:16, background:theme.btnSecBg,
              border:`1px solid ${theme.btnSecBorder}`, color:theme.btnSecColor,
              fontSize:16, fontWeight:600, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              transition:"all 0.3s ease", letterSpacing:"-0.01em" }}>
            <span style={{ fontSize:18 }}>🏆</span>
            Leaderboard
            <motion.span animate={{ x: hovered==="lb" ? 4 : 0 }} transition={{ type:"spring", stiffness:400 }}
              style={{ marginLeft:"auto", opacity:0.5, fontSize:16 }}>→</motion.span>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }} transition={{ delay:0.6, duration:0.5 }}
          style={{ width:"100%", height:1, background:theme.divider, margin:"32px 0", transition:"background 0.4s ease" }} />

        {/* Feature cards */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}
          style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, width:"100%" }}>
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y:-3 }} transition={{ type:"spring", stiffness:300 }}
              style={{ padding:"14px 10px", borderRadius:14, background:theme.featBg,
                border:`1px solid ${theme.featBorder}`, textAlign:"center",
                transition:"background 0.4s ease, border 0.4s ease" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{f.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:theme.text, marginBottom:2, transition:"color 0.4s" }}>{f.label}</div>
              <div style={{ fontSize:10, color:theme.featText, transition:"color 0.4s" }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
          style={{ marginTop:28, fontSize:11, color:theme.textMuted, transition:"color 0.4s" }}>
          Offer below minimum price and the deal is off. You've been warned.
        </motion.p>
      </div>
    </div>
  );
}
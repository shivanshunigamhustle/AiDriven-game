import { useEffect, useState } from "react";
import API from "../services/api";
import { socket } from "../services/socket";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "top3" | "recent"
  const [newEntries, setNewEntries] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/score")
      .then((res) => setScores(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    socket.on("new_score", (data) => {
      setScores((prev) => [data, ...prev]);
      setNewEntries((prev) => new Set([...prev, data.name + Date.now()]));
    });
    return () => socket.off("new_score");
  }, []);

  const filtered = scores
    .filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((_, i) => filter === "top3" ? i < 3 : filter === "recent" ? i < 10 : true);

  const topScore = scores[0]?.score || 0;
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + (b.score || 0), 0) / scores.length)
    : 0;

  const getRankIcon = (i) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  const getBarWidth = (score) =>
    topScore > 0 ? `${Math.min((score / topScore) * 100, 100)}%` : "0%";

  const getBadgeColor = (score) => {
    if (score >= 900) return { bg: "rgba(234,179,8,0.15)", color: "#ca8a04", border: "rgba(234,179,8,0.3)" };
    if (score >= 700) return { bg: "rgba(99,102,241,0.15)", color: "#818cf8", border: "rgba(99,102,241,0.3)" };
    return { bg: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "rgba(255,255,255,0.1)" };
  };

  return (
    <div
      className="min-h-screen px-4 py-8 flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
    >
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-700 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-all group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm">Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-wider">🏆 Leaderboard</h1>
            <p className="text-white/30 text-xs mt-0.5">Bargain Battle Rankings</p>
          </div>

          <button
            onClick={() => navigate("/game")}
            className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            Play ▶
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Players", value: scores.length, icon: "👥" },
            { label: "Top Score", value: topScore, icon: "🔥" },
            { label: "Avg Score", value: avgScore, icon: "📊" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-3 text-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-white font-black text-lg leading-none">{stat.value}</div>
              <div className="text-white/30 text-xs mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player..."
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm text-white outline-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <option value="all" style={{ background: "#1e1b4b" }}>All</option>
            <option value="top3" style={{ background: "#1e1b4b" }}>Top 3</option>
            <option value="recent" style={{ background: "#1e1b4b" }}>Top 10</option>
          </select>
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-white/30">
              <div className="text-4xl mb-3">😶</div>
              <p className="text-sm">Koi nahi mila...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((s, i) => {
                const badge = getBadgeColor(s.score);
                return (
                  <motion.div
                    key={s.name + i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="relative rounded-2xl p-4 overflow-hidden"
                    style={{
                      background: i < 3
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(255,255,255,0.04)",
                      border: i === 0
                        ? "1px solid rgba(234,179,8,0.3)"
                        : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* Score bar bg */}
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-700"
                      style={{
                        width: getBarWidth(s.score),
                        background: i === 0
                          ? "rgba(234,179,8,0.07)"
                          : i === 1
                          ? "rgba(192,192,192,0.05)"
                          : i === 2
                          ? "rgba(180,100,50,0.05)"
                          : "rgba(99,102,241,0.04)",
                        borderRadius: "inherit",
                      }}
                    />

                    <div className="relative flex items-center gap-3">
                      {/* Rank */}
                      <div
                        className="text-xl w-10 text-center flex-shrink-0 font-black"
                        style={{ color: i < 3 ? undefined : "#4b5563" }}
                      >
                        {getRankIcon(i)}
                      </div>

                      {/* Avatar circle */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: `hsl(${(s.name?.charCodeAt(0) || 65) * 7}, 60%, 35%)`,
                          color: "white",
                        }}
                      >
                        {s.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate">{s.name}</div>
                        <div className="text-white/30 text-xs">
                          {s.score >= 900 ? "Master Bargainer 🔥" : s.score >= 700 ? "Good Dealer 💪" : "Rookie 🌱"}
                        </div>
                      </div>

                      {/* Score badge */}
                      <div
                        className="px-3 py-1.5 rounded-xl text-sm font-black flex-shrink-0"
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {s.score}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mt-5 text-white/20 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live updates via socket
        </div>

      </div>
    </div>
  );
}
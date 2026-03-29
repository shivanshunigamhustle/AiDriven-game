import { motion } from "framer-motion";

export default function OfferInput({
  input,
  setInput,
  handleSend,
  gameOver,
  loading,
}) {

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !gameOver) {
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-gray-900 flex gap-2 items-center">

      {/* INPUT */}
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your offer..."
        disabled={gameOver || loading}
        className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        onClick={handleSend}
        disabled={loading || gameOver}
        className={`px-5 py-3 rounded-xl font-semibold shadow-md transition-all
          ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Sending...
          </span>
        ) : (
          "Send"
        )}
      </motion.button>

    </div>
  );
}
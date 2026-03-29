import { motion } from "framer-motion";

export default function MessageBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-4 py-2 rounded-xl max-w-xs shadow-md ${
          isUser ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}
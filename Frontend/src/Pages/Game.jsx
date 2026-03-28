import { useState } from "react";
import ChatBox from "../components/chat/ChatBox";
import OfferInput from "../components/game/OfferInput";

export default function Game() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Welcome! Price is ₹1000. Start bargaining." },
  ]);

  const [input, setInput] = useState("");
  const [round, setRound] = useState(1);
  const maxRounds = 5;
  const [gameOver, setGameOver] = useState(false);
  const [finalPrice, setFinalPrice] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleRestart = () => {
    setMessages([
      { sender: "ai", text: "Welcome! Price is ₹1000. Start bargaining." },
    ]);
    setRound(1);
    setGameOver(false);
    setFinalPrice(null);
    setInput("");
  };

  const handleSend = () => {
    if (!input.trim() || gameOver) return;

    const offer = parseInt(input);

    addMessage({ sender: "user", text: input });
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      let aiPrice = 1000;

      if (offer >= 900) {
        aiResponse = "🤝 Deal! You got it for ₹900.";
        aiPrice = 900;
      } else if (offer >= 800) {
        aiResponse = "Hmm… you're close. ₹920 😐";
        aiPrice = 920;
      } else if (offer >= 700) {
        aiResponse = "Too low! ₹950 😤";
        aiPrice = 950;
      } else {
        aiResponse = "No chance 😑";
        aiPrice = 1000;
      }

      setIsTyping(false);
      addMessage({ sender: "ai", text: aiResponse });

      if (round === maxRounds) {
        setGameOver(true);
        setFinalPrice(aiPrice);

        setTimeout(() => {
          addMessage({
            sender: "ai",
            text:
              aiPrice <= 900
                ? "🎉 Deal done! You win!"
                : "❌ You lost. Price too high.",
          });
        }, 500);
      } else {
        setRound((prev) => prev + 1);
      }
    }, 1200);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center px-6 py-4 bg-white/5 backdrop-blur border-b border-gray-800">

        <h1 className="text-2xl font-bold">🎮 Negotiation Arena</h1>

        <div className="flex gap-3">
          <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
            Round {round}/{maxRounds}
          </span>
          <span className="bg-red-500 px-3 py-1 rounded-full text-sm">
            😠 Aggressive
          </span>
        </div>

        <button
          onClick={handleRestart}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Restart
        </button>
      </div>

      {/* 💬 CHAT */}
      <div className="flex-1 overflow-hidden">
        <ChatBox messages={messages} />
      </div>

      {/* 🤖 TYPING */}
      {isTyping && (
        <div className="px-4 text-gray-400 text-sm animate-pulse">
          🤖 AI is typing...
        </div>
      )}

      {/* 💰 INPUT */}
      <OfferInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        gameOver={gameOver}
      />

      {/* 🎉 RESULT */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-2">Game Over</h2>
            <p>Final Price: ₹{finalPrice}</p>
            <button
              onClick={handleRestart}
              className="mt-3 bg-blue-500 px-4 py-2 rounded"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
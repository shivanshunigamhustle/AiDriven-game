import API from "../services/api";
import { useGameStore } from "../store/gameStore";

export const useGame = () => {
  const {
    addMessage,
    nextRound,
    endGame,
    round,
    maxRounds,
    messages,
  } = useGameStore();

  const handleSend = async (input, setInput, setLoading) => {
    if (!input) return;

    const offer = parseInt(input);
    if (isNaN(offer)) return;

    // 🔒 prevent spam
    setLoading(true);

    // 👤 user message
    addMessage({ sender: "user", text: `₹${offer}` });

    setInput("");

    try {
      // 🧠 build history for AI
      const history = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        text: msg.text,
      }));

      const res = await API.post("/ai", {
        offer,
        history,
      });

      const aiReply = res.data.reply;

      // 🤖 AI message
      addMessage({ sender: "ai", text: aiReply });

      // 🎯 simple deal logic detect
      if (aiReply.toLowerCase().includes("final")) {
        const priceMatch = aiReply.match(/\d+/);
        const finalPrice = priceMatch ? parseInt(priceMatch[0]) : 900;

        endGame(finalPrice);
      } else if (round === maxRounds) {
        endGame(900);
      } else {
        nextRound();
      }

    } catch (err) {
      console.error(err);
      addMessage({ sender: "ai", text: "Server error 😢" });
    }

    setLoading(false);
  };

  return { handleSend };
};
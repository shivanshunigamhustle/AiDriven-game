import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

export const negotiatePrice = async (req, res) => {
  console.log("GROQ KEY LOADED:", process.env.GROQ_API_KEY ? "✅ Found" : "❌ Undefined");

  try {
    const { offer, history } = req.body;

    if (!offer) return res.status(400).json({ error: "Offer is required" });

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const formattedHistory =
      Array.isArray(history) && history.length > 0
        ? history.map((msg) => `${msg.role}: ${msg.text}`).join("\n")
        : "No previous conversation.";

    const completion = await client.chat.completions.create({
     model: "llama-3.3-70b-versatile", // ✅ latest & free, // free & fast
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `You are a smart, slightly greedy Indian shopkeeper selling a product.
Rules:
- Starting price = ₹1000
- Minimum price = ₹700 (never go below this)
- Keep replies short (1-2 lines max)
- Use casual Hinglish occasionally
- If offer >= ₹900, accept happily
- If offer between ₹700-₹900, negotiate middle ground
- If offer < ₹700, firmly refuse and counter at ₹900
Respond as the shopkeeper only. Be natural and human-like.`,
        },
        {
          role: "user",
          content: `Conversation so far:\n${formattedHistory}\n\nCustomer's Offer: ₹${offer}`,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    console.log("✅ Groq reply:", reply);

    return res.json({ reply });

  } catch (err) {
    console.error("❌ Groq Error:", err.message);
    return res.status(500).json({ error: "AI failed. Try again." });
  }
};

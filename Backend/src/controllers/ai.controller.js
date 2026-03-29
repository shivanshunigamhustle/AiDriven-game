import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

export const negotiatePrice = async (req, res) => {
  console.log(
    "GROQ KEY LOADED:",
    process.env.GROQ_API_KEY ? "✅ Found" : "❌ Undefined"
  );

  try {
    const { offer, history, product } = req.body;

    if (!offer) return res.status(400).json({ error: "Offer is required" });

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const formattedHistory =
      Array.isArray(history) && history.length > 0
        ? history.map((msg) => `${msg.role}: ${msg.text}`).join("\n")
        : "No previous conversation.";

    const startPrice = product?.startPrice || 1000;
    const minPrice = product?.minPrice || 700;
    const acceptThreshold = Math.round(startPrice * 0.75); // ≥75% accept

    // Compute dynamic middle-ground counteroffer
    let counterOffer = null;
    if (offer >= acceptThreshold) {
      counterOffer = null; // accept
    } else if (offer >= minPrice) {
      // negotiate: middle between offer & startPrice
      counterOffer = Math.round((offer + startPrice) / 2);
    } else {
      // offer < minPrice: firm counter at ~85% of startPrice
      counterOffer = Math.round(startPrice * 0.85);
    }

    const prompt = `
You are a smart, slightly greedy Indian shopkeeper selling a ${product?.name || "product"}.

Rules:
- Starting price = ₹${startPrice}
- Minimum price = ₹${minPrice} (NEVER go below this)
- If offer >= ₹${acceptThreshold}, accept happily
- If offer between minimum and ₹${acceptThreshold}, negotiate middle-ground
- If offer < minimum, firmly refuse and counter at ₹${counterOffer}
- Short replies (1-2 lines), use casual Hinglish
- Always return JSON in this format:
  {
    "reply": "<shopkeeper message>",
    "counterOffer": <number or null if accepting>
  }

Conversation so far:
${formattedHistory}

Customer's Offer: ₹${offer}

Respond as the shopkeeper only.
`.trim();

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });

    let aiResponse = completion.choices[0].message.content;

    // Try to parse JSON from AI (structured response)
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      console.warn("⚠️ AI response not JSON, falling back to text:", aiResponse);
      parsedResponse = { reply: aiResponse, counterOffer };
    }

    console.log("✅ Groq reply:", parsedResponse);

    return res.json(parsedResponse);
  } catch (err) {
    console.error("❌ Groq Error:", err.message);
    return res.status(500).json({ error: "AI failed. Try again." });
  }
};
import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true }, // ✅ ek naam ek baar
  score:     { type: Number, required: true },
  product:   { type: String, default: "" },
  dealPrice: { type: Number, default: 0 },
  rounds:    { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Score", scoreSchema);
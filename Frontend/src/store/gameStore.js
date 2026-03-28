import { create } from "zustand";

export const useGameStore = create((set) => ({
  price: 1000,
  messages: [
    { sender: "ai", text: "I can offer this for ₹1000" }
  ],

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  updatePrice: (newPrice) => set({ price: newPrice }),
}));
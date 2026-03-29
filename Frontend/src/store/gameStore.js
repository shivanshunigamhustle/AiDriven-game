import { create } from "zustand";

export const useGameStore = create((set) => ({
  messages: [
    { sender: "ai", text: "Welcome! Price is ₹1000. Start bargaining." },
  ],
  round: 1,
  maxRounds: 5,
  gameOver: false,
  finalPrice: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  nextRound: () =>
    set((state) => ({
      round: state.round + 1,
    })),

  endGame: (price) =>
    set({
      gameOver: true,
      finalPrice: price,
    }),

  resetGame: () =>
    set({
      messages: [
        { sender: "ai", text: "Welcome! Price is ₹1000. Start bargaining." },
      ],
      round: 1,
      gameOver: false,
      finalPrice: null,
    }),
}));
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("send_offer", (data) => {
      console.log("Offer:", data);
      socket.broadcast.emit("receive_offer", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

// 🔥 IMPORTANT
export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized!");
  }
  return io;
};
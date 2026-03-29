import { Server } from "socket.io";

let io; // 🌐 global instance
let rooms = {}; // 🧠 game state

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ User Connected:", socket.id);

    // 🏠 JOIN ROOM
    socket.on("join_room", ({ roomId, username }) => {
      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          players: [],
          scores: {},
        };
      }

      // duplicate avoid
      if (!rooms[roomId].players.includes(username)) {
        rooms[roomId].players.push(username);
        rooms[roomId].scores[username] = 0;
      }

      console.log(`👤 ${username} joined ${roomId}`);

      io.to(roomId).emit("room_data", rooms[roomId]);
    });

    // 💰 SEND OFFER
    socket.on("send_offer", ({ roomId, offer, player }) => {
      socket.to(roomId).emit("receive_offer", {
        offer,
        player,
      });
    });

    // 🏆 UPDATE SCORE
    socket.on("update_score", ({ roomId, player, score }) => {
      if (!rooms[roomId]) return;

      rooms[roomId].scores[player] = score;

      io.to(roomId).emit("score_update", rooms[roomId].scores);
    });

    // 🏁 END GAME
    socket.on("end_game", ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;

      const winner = Object.keys(room.scores).reduce((a, b) =>
        room.scores[a] > room.scores[b] ? a : b
      );

      io.to(roomId).emit("game_over", {
        winner,
        scores: room.scores,
      });
    });

    // ❌ DISCONNECT
    socket.on("disconnect", () => {
      console.log("❌ User Disconnected:", socket.id);
    });
  });
};

// ✅ IMPORTANT (error fix)
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
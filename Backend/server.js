import dotenv from "dotenv";
dotenv.config();
import http from "http";


import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/sockets/socket.js";



const PORT = process.env.PORT || 3000;

// 🔥 create HTTP server
const server = http.createServer(app);

// 🔥 initialize socket.io
initSocket(server);

// 🔥 start server ONLY after DB connect
const startServer = async () => {
  try {
    await connectDB();
    console.log(" MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1);
  }
};

startServer();
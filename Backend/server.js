import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js"
import { initSocket } from "./src/sockets/socket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// 🔥 create server
const server = http.createServer(app);

// 🔥 init socket
initSocket(server);

// 🔥 DB connect
connectDB();

// 🔥 start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});   






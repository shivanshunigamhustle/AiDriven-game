import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.emit("send_offer", { offer: 800 });

socket.on("receive_offer", (data) => {
  console.log(data);
});
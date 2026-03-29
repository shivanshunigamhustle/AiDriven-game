import axios from "axios";

const API = axios.create({
  baseURL: "https://aidriven-game.onrender.com/api",
});

export default API;
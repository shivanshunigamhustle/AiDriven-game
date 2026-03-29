import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Game from "./Pages/Game";
import Leaderboard from "./Pages/Leaderboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}
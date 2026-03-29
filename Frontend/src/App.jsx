import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePlayer } from "./hooks/usePlayer";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import Game from "./Pages/Game";
import Leaderboard from "./Pages/Leaderboard";

export default function App() {
  const { name, saveName } = usePlayer();

  // ✅ Naam nahi hai toh Auth screen dikhao
  if (!name) return <Auth onSave={saveName} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game playerName={name} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}
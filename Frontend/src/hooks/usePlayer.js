import { useState } from "react";

const KEY = "negotiation_player_name";

export function usePlayer() {
  const [name, setName] = useState(() => localStorage.getItem(KEY) || "");

  const saveName = (n) => {
    localStorage.setItem(KEY, n.trim());
    setName(n.trim());
  };

  const clearName = () => {
    localStorage.removeItem(KEY);
    setName("");
  };

  return { name, saveName, clearName };
}
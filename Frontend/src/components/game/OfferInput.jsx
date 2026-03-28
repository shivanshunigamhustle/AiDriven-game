export default function OfferInput({
  input,
  setInput,
  handleSend,
  gameOver,
}) {
  return (
    <div className="flex p-4 border-t border-gray-800 gap-2">

      <input
        type="number"
        value={input}
        disabled={gameOver}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Enter your offer..."
        className="flex-1 px-4 py-2 rounded bg-gray-800 outline-none"
      />

      <button
        onClick={handleSend}
        disabled={gameOver}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Send
      </button>

    </div>
  );
}
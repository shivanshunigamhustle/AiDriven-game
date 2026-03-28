export default function MessageBubble({ sender, text }) {
  return (
    <div
      className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${
        sender === "user"
          ? "bg-blue-500 text-white"
          : "bg-gray-700 text-white"
      }`}
    >
      {text}
    </div>
  );
}
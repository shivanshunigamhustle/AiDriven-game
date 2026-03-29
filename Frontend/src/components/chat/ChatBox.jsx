import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

export default function ChatBox({ messages }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black">
      {messages.map((msg, i) => (
        <MessageBubble key={i} {...msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
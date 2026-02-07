import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          role: "seller",
          user_id: user?.id || null
        })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: data.response }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." }
      ]);
    }

    setLoading(false);
  };

return (
  <div className="fixed bottom-24 right-6 w-[420px] h-[600px]
                  bg-white
                  rounded-3xl shadow-2xl
                  flex flex-col overflow-hidden z-50
                  border border-gray-200">

    {/* Header */}
    <div className="bg-emerald-700 text-white px-6 py-4
                    flex justify-between items-center">
      <span className="font-semibold text-lg">
        AI Sustainability Assistant
      </span>
      <button
        onClick={onClose}
        className="hover:opacity-70 transition text-xl"
      >
        ✕
      </button>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">

      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`
              px-5 py-3 rounded-2xl max-w-[85%]
              text-[14px] leading-relaxed shadow-md
              ${
                m.role === "user"
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-100 text-black border border-emerald-200"
              }
            `}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-black mb-2 last:mb-0">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-black">
                    {children}
                  </strong>
                ),
                li: ({ children }) => (
                  <li className="ml-4 list-disc text-black">
                    {children}
                  </li>
                )
              }}
            >
              {m.text}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {loading && (
        <div className="text-sm text-gray-500 italic animate-pulse">
          AI is thinking...
        </div>
      )}
    </div>

    {/* Input */}
    <div className="p-4 border-t border-gray-200 bg-white">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        className="w-full px-5 py-3 rounded-2xl
                   bg-white text-black
                   border border-emerald-400
                   focus:outline-none focus:ring-2 focus:ring-emerald-500
                   transition shadow-sm"
      />
    </div>
  </div>
);



}

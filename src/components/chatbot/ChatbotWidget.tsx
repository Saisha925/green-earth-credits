import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}

      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#2e7d32",
          color: "white",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000
        }}
      >
        🌿
      </button>
    </>
  );
}

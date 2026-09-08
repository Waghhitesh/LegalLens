"use client";

import { useRef, useState } from "react";
import { agentChat } from "../lib/api";

export default function OllamaAgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "I'm your local Ollama compliance agent. Ask me about a Rule, or paste an issue you found." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const { reply } = await agentChat(
        input,
        next.filter((m) => m.role !== "system").slice(-8)
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not reach your local Ollama agent. Make sure `ollama serve` is running."
      );
    } finally {
      setBusy(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-20 font-ui">
      {open && (
        <div className="w-80 sm:w-96 h-[28rem] bg-paper border-2 border-gold/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3">
          <div className="bg-navy text-paper px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Local Agent</p>
              <p className="text-[10px] text-gold-light">Ollama • llama3.2-vision • runs on your PC</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-paper/70 hover:text-paper text-lg leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-xs px-3 py-2 rounded-lg max-w-[85%] ${
                  m.role === "user"
                    ? "bg-navy text-paper ml-auto"
                    : "bg-gold/15 text-ink border border-gold/30"
                }`}
              >
                {m.content}
              </div>
            ))}
            {error && <p className="text-xs text-maroon">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 p-2 border-t border-gold/30">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a rule…"
              className="flex-1 text-xs border border-gold/40 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={busy}
              className="text-xs px-3 py-2 rounded-lg bg-gold text-navy font-semibold disabled:opacity-40"
            >
              {busy ? "…" : "Send"}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-navy border-2 border-gold shadow-xl flex items-center justify-center text-gold hover:scale-105 transition-transform"
        title="Local Ollama agent"
      >
        <span className="text-2xl">🪔</span>
      </button>
    </div>
  );
}

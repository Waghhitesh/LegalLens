"use client";

import { useState, useRef, useEffect } from "react";
import { agentChat, agentAnalyzeImage } from "../lib/api";

export default function OllamaAgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! I'm your Legal Metrology compliance assistant. Ask me about the Packaged Commodities Rules 2011, inspection procedures, or upload a package image for quick analysis." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const scrollRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function send(e) {
    e?.preventDefault();
    if (!input.trim() && !imgFile) return;

    if (imgFile) {
      setMessages((m) => [...m, { role: "user", content: `[Image: ${imgFile.name}]` }]);
      setLoading(true);
      try {
        const result = await agentAnalyzeImage(imgFile);
        const reply =
          `**Package Analysis:**\n\n` +
          `✅ Present: ${(result.present || []).join(", ") || "None detected"}\n\n` +
          `❌ Missing: ${(result.missing || []).join(", ") || "All present"}\n\n` +
          `${result.raw_notes ? `📝 Notes: ${result.raw_notes}` : ""}`;
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      } catch {
        setMessages((m) => [...m, { role: "assistant", content: "⚠️ Could not analyze image. Make sure Ollama is running with `ollama serve` and the llava model is pulled." }]);
      }
      setImgFile(null);
      setLoading(false);
      return;
    }

    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const history = messages.filter(m => m.role !== "system").slice(-10);
      const data = await agentChat(userMsg, history);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Could not reach Ollama. Make sure `ollama serve` is running and the llava model is available." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-navy rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-white text-xl group"
        title="Compliance Assistant"
      >
        {open ? "✕" : "⚖"}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" style={{ height: "500px" }}>
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-500 rounded-lg flex items-center justify-center text-navy text-sm font-bold">⚖</div>
            <div>
              <p className="text-white text-sm font-semibold">Compliance Assistant</p>
              <p className="text-slate-400 text-[10px]">Powered by Local LLM (Ollama)</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-400 text-[10px]">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image preview */}
          {imgFile && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 flex items-center gap-2">
              <span className="text-sm">📷</span>
              <span className="text-xs text-blue-700 flex-1 truncate">{imgFile.name}</span>
              <button onClick={() => setImgFile(null)} className="text-blue-400 hover:text-blue-600 text-xs">✕</button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={send} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImgFile(e.target.files?.[0])}
              className="hidden"
            />
            <button type="button" onClick={() => imgRef.current?.click()}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Analyze package image">
              📷
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about compliance rules..."
              disabled={loading}
              className="flex-1 text-sm bg-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={loading || (!input.trim() && !imgFile)}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

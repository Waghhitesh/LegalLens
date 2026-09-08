"use client";

import { useState } from "react";

export default function ReadAloudButton({ text, label = "Read Aloud" }) {
  const [speaking, setSpeaking] = useState(false);

  function handleClick() {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  return (
    <button
      onClick={handleClick}
      className="font-ui text-xs px-4 py-2 rounded-lg border border-gold/40 text-ink/70 hover:bg-gold/10 transition-colors flex items-center gap-2"
    >
      {speaking ? "⏹ Stop" : label}
    </button>
  );
}

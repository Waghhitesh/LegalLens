"use client";
import { useState, useRef, useEffect } from 'react';

export default function OllamaAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'agent', content: "Namaste! I'm your Legal Metrology compliance assistant. Ask me about the Packaged Commodities Rules 2011, inspection procedures, or upload a package image for quick analysis." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'agent', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'agent', content: "Sorry, I'm having trouble connecting to the server. Please ensure Ollama is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#1557C0] rounded-full shadow-[0_8px_30px_rgb(21,87,192,0.4)] flex items-center justify-center text-white text-3xl hover:scale-105 transition-transform z-50 border-2 border-[#D9A928] group"
        title="Ask LegalLens AI"
      >
        <span className="group-hover:animate-bounce">🤖</span>
        <span className="absolute -top-2 -right-2 bg-[#F59E0B] text-[#10264A] text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.15)] flex flex-col overflow-hidden z-50 border border-[#D9E1EC]">
      
      {/* Header */}
      <div className="bg-[#10264A] p-4 flex justify-between items-center relative overflow-hidden">
        {/* Tricolour Accent */}
        <div className="absolute top-0 left-0 w-full h-1 flex">
           <div className="flex-1 bg-[#F59E0B]"></div>
           <div className="flex-1 bg-white"></div>
           <div className="flex-1 bg-[#16A34A]"></div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10 mt-1">
          <img src="/emblem.svg" alt="Emblem" className="w-8 h-10 object-contain drop-shadow-md"/>
          <div>
            <h3 className="font-black text-white text-[16px] leading-tight flex items-center gap-2">
               LegalLens AI
            </h3>
            <p className="text-[10px] text-[#D9E1EC] font-medium mt-0.5">AI Compliance Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 text-[10px] text-[#16A34A] font-bold">
             <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span> Online
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      {/* Subtle Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 pointer-events-none opacity-[0.03] z-0">
        <img src="/emblem.svg" alt="" className="w-full h-full object-contain filter sepia hue-rotate-15 saturate-200" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#F5F7FB] relative z-10 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {msg.role === 'agent' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1557C0] to-[#10264A] flex items-center justify-center text-[12px] flex-shrink-0 border border-white shadow-sm">
                🤖
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-[13px] leading-relaxed font-medium ${
              msg.role === 'user' 
                ? 'bg-[#1557C0] text-white rounded-br-sm' 
                : 'bg-white text-[#17233C] border border-[#D9E1EC] rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-[#10264A] flex items-center justify-center text-[12px] flex-shrink-0">🤖</div>
            <div className="bg-white border border-[#D9E1EC] rounded-2xl rounded-bl-sm p-4 flex gap-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-[#1557C0] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#1557C0] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1.5 h-1.5 bg-[#1557C0] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions (Before input) */}
      {messages.length === 1 && (
        <div className="px-5 py-3 bg-[#F5F7FB] relative z-10">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-3 flex items-center gap-2">
             <span className="text-[#1557C0]">⚡</span> Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-white hover:bg-blue-50 border border-[#D9E1EC] hover:border-[#1557C0] rounded-xl p-3 text-left transition-colors group">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[#1557C0] text-[14px]">📷</span>
                 <p className="font-bold text-[#10264A] text-[11px] group-hover:text-[#1557C0]">Scan Product</p>
               </div>
               <p className="text-[9px] text-[#64748B] font-medium leading-tight">Check compliance instantly</p>
            </button>
            <button className="bg-white hover:bg-green-50 border border-[#D9E1EC] hover:border-[#16A34A] rounded-xl p-3 text-left transition-colors group">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[#16A34A] text-[14px]">🖼️</span>
                 <p className="font-bold text-[#10264A] text-[11px] group-hover:text-[#16A34A]">Upload Image</p>
               </div>
               <p className="text-[9px] text-[#64748B] font-medium leading-tight">Get detailed analysis</p>
            </button>
            <button className="bg-white hover:bg-purple-50 border border-[#D9E1EC] hover:border-purple-500 rounded-xl p-3 text-left transition-colors group">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-purple-500 text-[14px]">📄</span>
                 <p className="font-bold text-[#10264A] text-[11px] group-hover:text-purple-600">Legal Rules</p>
               </div>
               <p className="text-[9px] text-[#64748B] font-medium leading-tight">Packaged Commodities 2011</p>
            </button>
            <button className="bg-white hover:bg-orange-50 border border-[#D9E1EC] hover:border-[#F59E0B] rounded-xl p-3 text-left transition-colors group">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[#F59E0B] text-[14px]">🛡️</span>
                 <p className="font-bold text-[#10264A] text-[11px] group-hover:text-[#F59E0B]">Guidelines</p>
               </div>
               <p className="text-[9px] text-[#64748B] font-medium leading-tight">Quick reference check</p>
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#D9E1EC] relative z-10">
        <div className="relative flex items-center">
          <button type="button" className="absolute left-3 text-[#64748B] hover:text-[#1557C0]">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about compliance rules..."
            className="w-full bg-[#F5F7FB] border border-[#D9E1EC] rounded-full pl-10 pr-12 py-3 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#1557C0] transition-shadow text-[#17233C] placeholder:text-[#64748B]"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 w-8 h-8 bg-[#1557C0] rounded-full flex items-center justify-center text-white hover:bg-[#10264A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 text-[8px] text-[#64748B] font-bold uppercase tracking-widest">
           <span>Legal Metrology</span><span className="w-1 h-1 rounded-full bg-[#D9E1EC]"></span>
           <span>Consumer Protection</span><span className="w-1 h-1 rounded-full bg-[#D9E1EC]"></span>
           <span>Digital India</span>
        </div>
      </form>
    </div>
  );
}

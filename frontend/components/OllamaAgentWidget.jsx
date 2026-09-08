"use client";
import { useState } from "react";

export default function OllamaAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-[68px] h-[68px] bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-[24px] shadow-[0_10px_25px_rgba(29,78,216,0.4)] flex items-center justify-center text-3xl hover:scale-105 transition-all z-50 border-4 border-white">
        🤖
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[440px] bg-[#f8fafc] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col z-50 overflow-hidden border border-slate-200 font-sans">
      
      {/* Header */}
      <div className="bg-[#0f172a] text-white p-6 pb-8 relative overflow-hidden rounded-t-[32px]">
        {/* Subtle radial gradient to simulate the lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-14 relative flex-shrink-0">
               <img src="/emblem.svg" alt="Emblem" className="absolute inset-0 w-full h-full object-contain brightness-0 invert opacity-90" onError={e=>e.target.style.display='none'}/>
            </div>
            <div>
              <h3 className="text-[22px] font-black tracking-tight leading-tight">LegalLens</h3>
              <p className="text-[13px] text-blue-200 font-bold mt-0.5">AI Compliance Assistant</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Powered by Local LLM (Ollama)</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 bg-white/10 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center gap-1.5 mt-2 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <span className="text-[10px] text-green-400 font-bold tracking-wide uppercase">Online</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-6 text-[10px] text-slate-400 italic font-semibold flex items-center gap-2 pb-2.5">
           <span>Safer Products</span>
           <span className="w-px h-2.5 bg-slate-600"></span>
           <span>Stronger India</span>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1 flex">
           <div className="w-1/3 bg-orange-500"></div>
           <div className="w-1/3 bg-white"></div>
           <div className="w-1/3 bg-green-500"></div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-[#f8fafc] p-6 overflow-y-auto relative" style={{maxHeight: '480px'}}>
         {/* Faint Ashoka Emblem Watermark */}
         <div className="absolute bottom-0 right-0 opacity-[0.04] pointer-events-none">
           <img src="/emblem.svg" alt="" className="w-48 h-64 object-contain translate-x-4 translate-y-8" onError={e=>e.target.style.display='none'}/>
         </div>

         <div className="flex gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl shadow-md border-[3px] border-white flex-shrink-0 relative">
               🤖
               <div className="absolute -bottom-1 -right-1 bg-white text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-slate-100 uppercase">AI</div>
            </div>
            
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-2 ml-1">
                  <span className="font-bold text-[15px] text-[#11213d]">LegalLens AI</span>
                  <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">Compliance Assistant</span>
               </div>
               
               <div className="bg-white border border-blue-100/50 rounded-2xl rounded-tl-sm p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] relative">
                  <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
                    Namaste! I'm your Legal Metrology compliance assistant. Ask me about the Packaged Commodities Rules 2011, inspection procedures, or upload a package image for quick analysis.
                  </p>
                  
                  <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
                     {[
                       { icon: "🔍", label: "Check Compliance" },
                       { icon: "📷", label: "Scan Product or Label" },
                       { icon: "🖼️", label: "Analyze Image" },
                       { icon: "📄", label: "Get Legal Guidance" }
                     ].map(action => (
                       <div key={action.label} className="flex flex-col items-center justify-start text-center cursor-pointer group">
                          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 text-lg group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm mb-2 group-hover:shadow-md group-hover:-translate-y-0.5">
                            {action.icon}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight group-hover:text-blue-700 font-bold px-1">{action.label}</p>
                       </div>
                     ))}
                  </div>
                  
                  {/* Handwriting text overlay */}
                  <div className="absolute -right-8 top-8 transform rotate-[-12deg] text-[#1d4ed8] text-[22px] font-black leading-tight opacity-90 drop-shadow-sm pointer-events-none" style={{fontFamily: "'Caveat', 'Playfair Display', cursive, serif"}}>
                    How can<br/>I help you<br/>today?
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-8 mb-3 flex items-center gap-2 px-2 relative z-10">
            <span className="text-blue-600 text-xl">⚡</span>
            <span className="font-black text-[#11213d] text-[15px]">Quick Actions</span>
         </div>

         <div className="grid grid-cols-2 gap-3 relative z-10">
            {[
              { title: "Scan Product / Label", desc: "Check compliance instantly", bg: "bg-blue-50/80 border-blue-100 text-blue-900", icon: "📷" },
              { title: "Upload Package Image", desc: "Get detailed analysis", bg: "bg-emerald-50/80 border-emerald-100 text-emerald-900", icon: "🖼️" },
              { title: "View Legal Rules", desc: "Packaged Commodities Rules 2011", bg: "bg-purple-50/80 border-purple-100 text-purple-900", icon: "📄" },
              { title: "Compliance Guidelines", desc: "Quick reference", bg: "bg-orange-50/80 border-orange-100 text-orange-900", icon: "🛡️" },
            ].map(item => (
              <button key={item.title} className={`p-3.5 rounded-2xl border flex items-center gap-3 text-left transition-all hover:shadow-md ${item.bg} hover:brightness-95 hover:-translate-y-0.5`}>
                 <div className="w-10 h-10 rounded-full bg-white/70 shadow-sm flex items-center justify-center flex-shrink-0 text-xl">{item.icon}</div>
                 <div className="flex-1">
                    <p className="text-[11px] font-black leading-tight mb-0.5">{item.title}</p>
                    <p className="text-[9px] opacity-75 font-semibold leading-snug">{item.desc}</p>
                 </div>
                 <span className="opacity-40 text-sm font-bold">→</span>
              </button>
            ))}
         </div>
      </div>

      {/* Footer Input */}
      <div className="p-5 bg-white border-t border-slate-200 pb-6 rounded-b-[32px] shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-20">
         <div className="flex items-center gap-3">
            <button className="w-11 h-11 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors text-xl">
              📎
            </button>
            <input type="text" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Ask about compliance rules..." 
              className="flex-1 border-2 border-slate-100 bg-slate-50 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
            <button className="w-11 h-11 rounded-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] flex items-center justify-center shadow-lg shadow-blue-500/40 transition-all active:scale-95 text-lg">
              ➤
            </button>
         </div>
         <div className="mt-5 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"></div>
            <span>Legal Metrology</span>
            <span className="w-px h-2.5 bg-slate-300"></span>
            <span>Consumer Protection</span>
            <span className="w-px h-2.5 bg-slate-300"></span>
            <span>Digital India</span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-orange-500 to-green-500 rounded-full"></div>
         </div>
      </div>

    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username || username);
      localStorage.setItem("full_name", data.full_name || "");
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#0f172a]">
      {/* Top Navbar */}
      <div className="absolute top-0 w-full flex justify-between items-center px-8 py-3 z-20 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/emblem.svg" alt="National Emblem" className="h-14 object-contain"/>
          <div>
            <h1 className="text-sm font-bold text-[#11213d] leading-tight">भारत सरकार<br/>Government of India</h1>
            <p className="text-[10px] text-slate-500">Ministry of Consumer Affairs, Food &amp; Public Distribution</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[#11213d] font-bold text-[11px] text-right">
            <span className="text-3xl text-orange-500">💡</span>
            <span>SMART INDIA<br/>HACKATHON<br/>2026</span>
          </div>
          <div className="flex items-center gap-2 pl-6 border-l border-slate-200">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-sm font-black italic shadow-md">i</div>
             <div>
               <p className="text-xs font-black text-blue-900 leading-tight">Digital India</p>
               <p className="text-[9px] text-blue-600 font-semibold italic">Power To Empower</p>
             </div>
          </div>
        </div>
      </div>

      {/* Left Side - Branding */}
      <div className="flex-1 relative overflow-hidden flex flex-col justify-center px-16 pt-24 pb-12 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <div className="absolute top-[76px] left-16 flex w-32 h-1 rounded-full overflow-hidden">
           <div className="flex-1 bg-orange-500"></div>
           <div className="flex-1 bg-white"></div>
           <div className="flex-1 bg-green-500"></div>
        </div>
        
        <div className="relative z-10 mt-4">
          <p className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-6">SMART INDIA HACKATHON 2026 - PS-034</p>
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center border-2 border-blue-400/50 shadow-xl shadow-blue-900/50 p-2">
              <img src="/emblem.svg" alt="Emblem" className="w-full h-full object-contain brightness-0 invert"/>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tight">Legal <span className="text-amber-400">Lens</span></h1>
          </div>
          
          <h2 className="text-[26px] font-bold text-white mb-6 leading-snug max-w-2xl">
            AI-Assisted Packaged <span className="font-black">Commodity Compliance System</span><br/>under Legal Metrology Rules, 2011
          </h2>
          
          <div className="space-y-3 mb-10">
            <p className="text-xl font-bold text-white tracking-wide">Scan. Verify. Comply.</p>
            <p className="text-sm text-blue-200 max-w-lg leading-relaxed font-medium">
              Empowering consumers and authorities with AI to check compliance of packaged commodities through product, image and label scanning.
            </p>
          </div>

          <div className="flex gap-4 mb-12">
            {[
              { icon: "/emblem.svg", title: "Scan Products", desc: "Barcode / QR / Image" },
              { icon: "/emblem.svg", title: "Check Labels", desc: "Net Quantity, MRP, etc." },
              { icon: "/emblem.svg", title: "Verify Compliance", desc: "As per Legal Metrology Rules, 2011" },
            ].map((card, i) => (
              <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md shadow-lg w-56 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <img src={card.icon} alt="" className="w-6 h-6 brightness-0 invert opacity-80"/>
                </div>
                <div className="text-white">
                  <p className="text-xs font-bold">{card.title}</p>
                  <p className="text-[9px] text-blue-200 mt-0.5">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-white/10 max-w-xl">
            <img src="/emblem.svg" alt="Govt" className="w-10 h-12 brightness-0 invert opacity-70"/>
            <div className="text-white">
              <p className="text-sm font-bold">Department of Consumer Affairs</p>
              <p className="text-xs text-blue-200">Government of India</p>
            </div>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[320px] pointer-events-none z-10 opacity-90">
            <div className="w-[240px] h-[420px] bg-slate-900 rounded-[36px] border-[6px] border-slate-700 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center mx-auto">
               <div className="absolute top-2 w-24 h-5 bg-slate-700 rounded-full"></div>
               <div className="w-[75%] h-[35%] bg-white rounded-xl flex flex-col items-center justify-center p-3 text-center">
                  <div className="text-5xl mb-2">📦</div>
                  <div className="w-full h-10 border border-slate-300 flex flex-col items-center justify-center bg-slate-50 rounded">
                     <div className="flex gap-0.5 text-slate-800">
                       {[...Array(20)].map((_, i) => <div key={i} className="w-[2px] bg-slate-800" style={{height: `${8 + Math.random() * 12}px`}}></div>)}
                     </div>
                     <div className="text-[7px] font-mono mt-0.5 text-slate-600">8 901234 567890</div>
                  </div>
               </div>
               <div className="mt-6 bg-green-500 text-white font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-green-500/50 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                  Compliant
               </div>
               <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/50 transform rotate-12 border-2 border-blue-300">
                  AI
               </div>
            </div>
        </div>

        {/* Watermark */}
        <div className="absolute right-0 bottom-0 w-[50%] h-[80%] opacity-[0.03] pointer-events-none flex items-end justify-end">
          <img src="/emblem.svg" alt="" className="w-full h-full object-contain"/>
        </div>
        
        {/* Bottom tricolor stripe */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 flex">
           <div className="flex-1 bg-orange-500"></div>
           <div className="flex-1 bg-white"></div>
           <div className="flex-1 bg-green-500"></div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-[480px] bg-[#f8fafc] flex flex-col items-center justify-center p-8 pt-24 relative z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.3)]">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-7 relative overflow-hidden">
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/emblem.svg" alt="Emblem" className="w-10 h-12"/>
            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-800 leading-tight">भारत सरकार<br/>Government of India</p>
              <p className="text-[7px] text-slate-500 mt-0.5">Ministry of Consumer Affairs, Food &amp; Public Distribution</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-[26px] font-black text-[#11213d]">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Access the compliance platform</p>
          </div>

          {/* Quick Demo Login - NO passwords shown */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Admin", username: "r.sharma", color: "bg-[#ef4444]", icon: "👤" },
                { label: "Gov. Official", username: "p.verma", color: "bg-[#2563eb]", icon: "🏛️" },
                { label: "Manufacturer", username: "manufacturer1", color: "bg-[#9333ea]", icon: "🏭" },
                { label: "Inspector", username: "demo_inspector", color: "bg-[#f59e0b]", icon: "🔍" }
              ].map(acc => (
                <button key={acc.username} type="button" onClick={() => { setUsername(acc.username); setPassword("password123"); }}
                  className={`${acc.color} text-white p-2.5 rounded-xl flex items-center gap-2.5 hover:brightness-110 transition-all shadow-md active:scale-95`}>
                  <span className="text-lg bg-white/20 w-7 h-7 rounded-lg flex items-center justify-center">{acc.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-[11px]">{acc.label}</p>
                    <p className="text-[8px] opacity-80">{acc.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] font-medium text-slate-400">or enter manually</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase">Username or Email</label>
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)} required placeholder="e.g. hitesh"
                className="w-full bg-[#f8fafc] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Enter your password"
                className="w-full bg-[#f8fafc] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            {error && <div className="text-red-600 text-[11px] font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">{error}</div>}
            
            <button type="submit" disabled={loading}
              className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-1">
              <span>🏛️</span> {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">New user? <Link href="/register" className="text-[#2563eb] font-bold hover:underline">Create account</Link></p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="w-full mt-auto flex items-center justify-center gap-4 text-[8px] font-semibold text-slate-400 pt-6 pb-3 uppercase tracking-wider">
           <span className="flex items-center gap-1"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Consumer Protection</span>
           <span className="flex items-center gap-1"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Fair Trade</span>
           <span className="flex items-center gap-1"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Transparent Markets</span>
        </div>
      </div>
    </div>
  );
}

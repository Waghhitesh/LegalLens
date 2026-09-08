"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_ACCOUNTS = [
  { label: "Admin", username: "r.sharma", password: "password123", color: "bg-red-500", icon: "👑" },
  { label: "Gov. Official", username: "p.verma", password: "password123", color: "bg-blue-600", icon: "🏛️" },
  { label: "Manufacturer", username: "manufacturer1", password: "password123", color: "bg-purple-600", icon: "🏭" },
  { label: "Inspector", username: "demo_inspector", password: "password123", color: "bg-amber-600", icon: "🔍" },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e?.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username || username);
      localStorage.setItem("full_name", data.full_name || username);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginLeft: 0 }} className="min-h-screen flex relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 50%, #1e3a8a 100%)", marginLeft: 0 }}>
      {/* Cloud shapes */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: "200px" }}>
        <svg viewBox="0 0 1440 200" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,160 C200,100 400,200 600,140 C800,80 1000,180 1200,120 C1320,80 1380,100 1440,90 L1440,200 L0,200 Z" fill="white" fillOpacity="0.15" />
          <path d="M0,180 C300,120 600,200 900,150 C1100,110 1300,170 1440,140 L1440,200 L0,200 Z" fill="white" fillOpacity="0.1" />
        </svg>
      </div>

      {/* Left hero section */}
      <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
        <div className="mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl mb-4">⚖️</div>
          <p className="text-white/70 text-sm font-medium tracking-widest uppercase mb-2">Smart India Hackathon 2026 · PS-034</p>
          <h1 className="text-6xl font-black text-white leading-tight">Legal<br/>Lens</h1>
          <p className="text-white/80 text-lg mt-3 max-w-md">AI-Assisted Packaged Commodity Compliance System under Legal Metrology Rules, 2011</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {["YOLOv8 Vision", "EasyOCR", "Local LLM (Ollama)", "Rule Engine"].map(tag => (
            <span key={tag} className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">{tag}</span>
          ))}
        </div>

        <p className="text-white/60 text-xs mt-8">📍 Ministry of Consumer Affairs · Government of India</p>
      </div>

      {/* Right login card */}
      <div className="w-[460px] flex items-center justify-center p-8 relative z-10">
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Access the compliance platform</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.username}
                  onClick={() => { setUsername(acc.username); setPassword(acc.password); }}
                  className={`${acc.color} text-white text-xs px-3 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity`}>
                  <span>{acc.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold">{acc.label}</p>
                    <p className="opacity-75 text-[10px]">{acc.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">or enter manually</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username or Email</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                required placeholder="username or email"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="password"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <span className="text-red-500 text-sm">⚠️</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In → "}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-5">
            New user? <a href="/register" className="text-blue-600 font-semibold hover:underline">Create account</a>
          </p>
          <p className="text-[10px] text-slate-300 text-center mt-3">All demo passwords: <span className="font-mono bg-slate-100 px-1 rounded">password123</span></p>
        </div>
      </div>
    </div>
  );
}

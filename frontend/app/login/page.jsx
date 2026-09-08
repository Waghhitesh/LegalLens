"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../lib/api";
import { setAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(username, password);
      setAuth(data.access_token, data.role, username);
      router.push("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  function enterDemo() {
    setAuth("demo_token", "ADMIN", "demo_inspector");
    router.push("/");
  }

  return (
    <div className="min-h-screen flex" style={{ marginLeft: '-16rem' }}>
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] leading-none">⚖</div>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex items-center justify-center text-navy text-3xl font-bold mx-auto mb-6 shadow-lg">⚖</div>
          <h1 className="text-white text-4xl font-display font-bold mb-3">LegalLens</h1>
          <p className="text-blue-300 text-sm uppercase tracking-[0.3em] mb-6">Compliance Inspection System</p>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Making packaged commodity inspections faster, transparent and evidence-driven.
          </p>
          <div className="mt-10 flex justify-center gap-6">
            <div className="text-center">
              <p className="text-gold text-2xl font-bold">128+</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider">Inspections</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-green-400 text-2xl font-bold">73%</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider">Compliance</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-blue-400 text-2xl font-bold">24/7</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider">Monitoring</p>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] mt-10">Smart India Hackathon 2026 · PS-034 · Ministry of Consumer Affairs</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center text-gold text-xl font-bold mx-auto mb-3">⚖</div>
            <h1 className="text-2xl font-bold text-navy">LegalLens</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-8">Sign in to the compliance inspection platform</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                className="input-field" placeholder="Enter your username" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field" placeholder="Enter your password" />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button onClick={enterDemo} className="btn-outline w-full flex items-center justify-center gap-2">
            <span>🎯</span> Enter Demo Mode
          </button>

          <p className="text-xs text-slate-400 mt-6 text-center">
            New here? <a href="/register" className="text-blue-600 font-semibold hover:underline">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

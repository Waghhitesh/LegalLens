"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "CITIZEN", label: "Citizen", icon: "👤" },
  { value: "SHOPKEEPER", label: "Shopkeeper", icon: "🏪" },
  { value: "COMPANY", label: "Manufacturer", icon: "🏭" },
  { value: "GOVERNMENT_OFFICIAL", label: "Gov. Official", icon: "🏛️" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [form, setForm] = useState({ username: "", password: "", otp_code: "", role: "CITIZEN", full_name: "", organisation: "", area_jurisdiction: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, purpose: "register" }),
      });
      const data = await res.json();
      if (data.dev_otp) { setDevOtp(data.dev_otp); setForm(f => ({...f, otp_code: data.dev_otp})); }
      setStep(2);
    } catch { setError("Could not send OTP"); } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp_target: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      router.push("/login");
    } catch (err) {
      // Fallback: try direct register
      try {
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/register-direct`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: form.username, password: form.password, role: form.role, full_name: form.full_name, organisation: form.organisation, email: target, area_jurisdiction: form.area_jurisdiction }),
        });
        const d2 = await res2.json();
        if (!res2.ok) throw new Error(d2.detail || "Registration failed");
        router.push("/login");
      } catch (err2) { setError(err2.message); }
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #10264A 50%, #1557C0 100%)" }}>
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.1] mix-blend-overlay">
        <img src="/parliament.png" alt="" className="w-[600px] h-auto object-contain" />
      </div>
      <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-80">
        <img src="/tricolour-wave.png" alt="" className="w-full h-auto object-cover" />
      </div>
      <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
        <div className="mb-6 flex flex-col items-start"><img src="/gov-india-logo.svg" alt="Government of India" className="h-16 object-contain filter brightness-0 invert opacity-90 mb-4"/></div>
        <h1 className="text-5xl font-black text-white leading-tight">Join<br/>LegalLens</h1>
        <p className="text-white/80 text-lg mt-3 max-w-md">Create your account to access the AI-powered compliance inspection platform</p>
      </div>
      <div className="w-[500px] flex items-center justify-center p-8 relative z-10">
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <div className="flex gap-2 mb-6">
            {[1,2].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${step >= s ? "bg-blue-600" : "bg-slate-200"}`}></div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">{step === 1 ? "Verify Contact" : "Complete Profile"}</h2>
          <p className="text-sm text-slate-500 mb-5">{step === 1 ? "We'll send a verification code" : "Fill your details below"}</p>

          {step === 1 && (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                <input type="email" required value={target} onChange={e => setTarget(e.target.value)} placeholder="you@example.com"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-200">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#D9A928] hover:bg-[#b0871e] text-[#10264A] font-bold rounded-xl disabled:opacity-60 transition-colors">
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <p className="text-xs text-center text-slate-400">Already have an account? <a href="/login" className="text-blue-600 font-semibold">Sign in</a></p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-3">
              {devOtp && <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">Dev OTP auto-filled: <b>{devOtp}</b></div>}
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Verification Code</label>
                <input type="text" required value={form.otp_code} onChange={e => setForm({...form, otp_code: e.target.value})} placeholder="6-digit code"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                  <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="username"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="password"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Your full name"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Area / Jurisdiction</label>
                <select value={form.area_jurisdiction} onChange={e => setForm({...form, area_jurisdiction: e.target.value})}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select area</option>
                  {["Maharashtra","Delhi NCR","Karnataka","Tamil Nadu","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Telangana","Kerala","Punjab","Haryana"].map(a => <option key={a} value={a}>{a}</option>)}
                </select></div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(r => (
                    <button key={r.value} type="button" onClick={() => setForm({...form, role: r.value})}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all ${form.role === r.value ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                      <span className="text-lg">{r.icon}</span>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{r.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-200">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#D9A928] hover:bg-[#b0871e] text-[#10264A] font-bold rounded-xl disabled:opacity-60 transition-colors">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

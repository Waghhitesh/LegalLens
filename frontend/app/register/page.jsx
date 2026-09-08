"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, registerUser } from "../../lib/api";

const ROLES = [
  { value: "CITIZEN", label: "Citizen", desc: "Report packaging violations" },
  { value: "SHOPKEEPER", label: "Shopkeeper", desc: "Verify your inventory compliance" },
  { value: "COMPANY", label: "Company / Manufacturer", desc: "Check your product labels" },
  { value: "GOVERNMENT_OFFICIAL", label: "Government Official", desc: "Full inspection access" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [form, setForm] = useState({ username: "", password: "", role: "CITIZEN", full_name: "", organisation: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await requestOtp(target, "register");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to send OTP. In dev mode, check backend console for the code.");
    } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await registerUser({ ...form, otp_target: target, otp_code: otpCode });
      router.push("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="page-enter" style={{ marginLeft: "-16rem" }}>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center text-gold text-xl font-bold mx-auto mb-3">⚖</div>
            <h1 className="text-2xl font-bold text-navy">Create Account</h1>
            <p className="text-sm text-slate-500 mt-1">Join the Legal Metrology compliance platform</p>
          </div>

          <div className="card p-8">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>1</div>
              <div className={`w-12 h-0.5 ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>2</div>
            </div>
            <p className="text-center text-xs text-slate-400 mb-6">{step === 1 ? "Verify your contact" : "Complete your profile"}</p>

            {step === 1 && (
              <form onSubmit={sendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email or Mobile</label>
                  <input type="text" required placeholder="you@example.com or +91..." value={target}
                    onChange={(e) => setTarget(e.target.value)} className="input-field" />
                  <p className="text-[10px] text-slate-400 mt-1">In dev mode, OTP prints to the backend console.</p>
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">OTP Code</label>
                  <input type="text" required placeholder="Enter 6-digit code" value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username</label>
                  <input type="text" required placeholder="Choose a username" value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                  <input type="password" required placeholder="Create a password" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                  <input type="text" placeholder="Your full name" value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => (
                      <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          form.role === r.value ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                        }`}>
                        <p className="text-xs font-semibold text-slate-700">{r.label}</p>
                        <p className="text-[10px] text-slate-400">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}

            <p className="text-xs text-slate-400 mt-6 text-center">
              Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Sign in →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, registerUser } from "../../lib/api";
import { setAuth } from "../../lib/auth";

const ROLES = [
  { value: "CITIZEN", label: "Citizen" },
  { value: "SHOPKEEPER", label: "Shopkeeper" },
  { value: "COMPANY", label: "Company" },
  { value: "GOVERNMENT_OFFICIAL", label: "Government Official" },
  { value: "ADMIN", label: "Admin" },
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
      setError(err?.response?.data?.detail || "Failed to send OTP. Check console for code in dev mode.");
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
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border-2 border-gold/40 rounded-2xl p-8">
        <h1 className="font-display text-3xl text-navy mb-1">Create Account</h1>
        <p className="text-xs text-ink/50 font-ui mb-6">Step {step} of 2 — {step === 1 ? "Verify contact" : "Complete profile"}</p>

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <input type="text" required placeholder="Email or Mobile number" value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            <p className="text-xs text-ink/40">In dev mode, OTP will be printed to the backend console.</p>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-navy text-white font-semibold py-3 rounded-xl disabled:opacity-50">
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" required placeholder="OTP Code" value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            <input type="text" required placeholder="Username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            <input type="password" required placeholder="Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            <input type="text" placeholder="Full Name (optional)" value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold bg-white">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-navy text-white font-semibold py-3 rounded-xl disabled:opacity-50">
              {loading ? "Registering…" : "Create Account"}
            </button>
          </form>
        )}

        <p className="text-xs text-ink/50 mt-4 text-center">
          Already have an account? <a href="/login" className="text-navy font-semibold hover:underline">Sign in →</a>
        </p>
      </div>
    </main>
  );
}

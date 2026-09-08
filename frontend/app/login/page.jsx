"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "../../lib/api";
import { setAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(username, password);
      setAuth(data.access_token, data.role, username);
      if (data.role === "ADMIN") router.push("/admin");
      else router.push("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white border-2 border-gold/40 rounded-2xl p-8">
        <h1 className="font-display text-3xl text-navy mb-1">Sign In</h1>
        <p className="text-sm text-ink/50 font-ui mb-6">Legal Metrology Compliance Inspector</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
          <input type="password" required placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gold/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-navy hover:bg-navy-light disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-ink/50 mt-4 text-center">
          New here? <a href="/register" className="text-navy font-semibold hover:underline">Create an account →</a>
        </p>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitUrlAudit, submitBulkUpload } from "../lib/api";

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { audit_id } = await submitUrlAudit(url);
      router.push(`/inspector/${audit_id}`);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to start audit. Check if the backend is running.");
      setSubmitting(false);
    }
  }

  async function handleBulkSubmit(e) {
    e.preventDefault();
    if (!bulkFiles.length) return;
    setBulkBusy(true);
    setBulkResult(null);
    try {
      const data = await submitBulkUpload(bulkFiles);
      setBulkResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Bulk scan failed.");
    } finally {
      setBulkBusy(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="mb-12">
        <p className="font-ui text-xs uppercase tracking-widest text-gold mb-2">SIH 2026 · PS-034 · Ministry of Consumer Affairs</p>
        <h1 className="font-display text-5xl text-navy mb-3 leading-tight">
          Legal Metrology<br />Compliance Auditor
        </h1>
        <p className="font-ui text-sm text-ink/60 max-w-xl">
          Instantly audit e-commerce product listings and physical package labels against the
          <strong className="text-navy"> Legal Metrology (Packaged Commodities) Rules, 2011</strong>.
          Detects Rule 6 missing declarations, Rule 7 font legibility violations, and overcharging.
        </p>
      </div>

      {/* URL Audit */}
      <section className="bg-white border-2 border-gold/40 rounded-2xl p-8 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-gold text-lg">🔗</div>
          <div>
            <h2 className="font-display text-2xl text-navy">Audit a Product URL</h2>
            <p className="text-xs text-ink/50 font-ui">Paste an Amazon, Flipkart, or any e-commerce URL</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.amazon.in/product..."
            className="flex-1 border-2 border-gold/30 rounded-xl px-4 py-3 text-sm bg-paper focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-navy hover:bg-navy-light disabled:opacity-50 text-white text-sm font-ui font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <><span className="animate-spin">⟳</span> Auditing…</>
            ) : "Run Audit →"}
          </button>
        </form>
        {error && <p className="text-sm text-red-600 mt-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      </section>

      {/* Bulk Upload */}
      <section className="bg-white border-2 border-gold/40 rounded-2xl p-8 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-maroon rounded-xl flex items-center justify-center text-white text-lg">📷</div>
          <div>
            <h2 className="font-display text-2xl text-navy">Bulk-Scan Package Photos</h2>
            <p className="text-xs text-ink/50 font-ui">Upload shelf/warehouse photos — each gets its own audit</p>
          </div>
        </div>
        <form onSubmit={handleBulkSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setBulkFiles(Array.from(e.target.files || []))}
            className="flex-1 text-sm font-ui file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-gold file:text-navy file:font-semibold cursor-pointer"
          />
          <button
            type="submit"
            disabled={bulkBusy || !bulkFiles.length}
            className="bg-maroon hover:bg-maroon-dark disabled:opacity-50 text-white text-sm font-ui font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {bulkBusy ? "Scanning…" : `Scan ${bulkFiles.length || ""} image${bulkFiles.length === 1 ? "" : "s"}`}
          </button>
        </form>
        {bulkResult && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-navy mb-2">{bulkResult.count} audit(s) started:</p>
            <ul className="space-y-1">
              {bulkResult.accepted.map((a) => (
                <li key={a.audit_id} className="flex items-center gap-2 text-xs font-ui">
                  <span className={`w-2 h-2 rounded-full ${a.status === 'PASS' ? 'bg-green-500' : a.status === 'FAIL' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                  <span className="text-ink/60 flex-1 truncate">{a.filename}</span>
                  <a href={`/inspector/${a.audit_id}`} className="text-navy font-semibold hover:underline">View audit →</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Quick Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/dashboard" className="bg-white border border-gold/30 rounded-xl p-5 hover:border-gold transition-colors group">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-display text-lg text-navy group-hover:text-gold transition-colors">Dashboard</h3>
          <p className="text-xs text-ink/50 font-ui mt-1">View compliance trends and statistics</p>
        </a>
        <a href="/law" className="bg-white border border-gold/30 rounded-xl p-5 hover:border-gold transition-colors group">
          <div className="text-2xl mb-2">⚖️</div>
          <h3 className="font-display text-lg text-navy group-hover:text-gold transition-colors">The Law</h3>
          <p className="text-xs text-ink/50 font-ui mt-1">Legal Metrology Act 2009 reference</p>
        </a>
        <a href="/register" className="bg-white border border-gold/30 rounded-xl p-5 hover:border-gold transition-colors group">
          <div className="text-2xl mb-2">👤</div>
          <h3 className="font-display text-lg text-navy group-hover:text-gold transition-colors">Register</h3>
          <p className="text-xs text-ink/50 font-ui mt-1">Create your compliance officer account</p>
        </a>
      </div>
    </main>
  );
}

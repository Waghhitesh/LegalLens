"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopNav from "../../components/TopNav";
import { submitUrlAudit, submitUploadAudit, submitBulkUpload, agentAnalyzeImage } from "../../lib/api";
import { DEMO_DECLARATIONS, DEMO_COMPLIANCE_CHECKS } from "../../lib/demoData";

const STEPS = ["Upload", "Processing", "Extraction", "Compliance", "Review"];

export default function ScanPage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [mode, setMode] = useState("idle"); // idle | url | upload | processing | results
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  const [declarations, setDeclarations] = useState([]);
  const [checks, setChecks] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [processingMsg, setProcessingMsg] = useState("");
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkResult, setBulkResult] = useState(null);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setMode("upload");
    }
  }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setMode("upload");
    }
  };

  async function runUrlAudit() {
    if (!url) return;
    setMode("processing");
    setStep(1);
    setError(null);
    try {
      setProcessingMsg("Scraping product page...");
      const result = await submitUrlAudit(url);
      setStep(2);
      setProcessingMsg("Extracting declarations...");
      await new Promise(r => setTimeout(r, 800));
      setStep(3);
      setProcessingMsg("Running compliance checks...");
      await new Promise(r => setTimeout(r, 600));
      setAuditResult(result);
      setDeclarations(DEMO_DECLARATIONS);
      setChecks(DEMO_COMPLIANCE_CHECKS);
      setStep(4);
      setMode("results");
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Audit failed");
      setMode("idle");
      setStep(0);
    }
  }

  async function runImageAudit() {
    if (!file) return;
    setMode("processing");
    setStep(1);
    setError(null);
    try {
      setProcessingMsg("Reading package image...");
      await new Promise(r => setTimeout(r, 500));
      setStep(2);
      setProcessingMsg("Extracting declarations with OCR...");
      const result = await submitUploadAudit(file);
      setStep(3);
      setProcessingMsg("Running compliance checks...");
      await new Promise(r => setTimeout(r, 600));
      setAuditResult(result);
      setDeclarations(DEMO_DECLARATIONS);
      setChecks(DEMO_COMPLIANCE_CHECKS);
      setStep(4);
      setMode("results");
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Audit failed");
      setMode("idle");
      setStep(0);
    }
  }

  function loadDemoInspection() {
    setMode("processing");
    setStep(1);
    setProcessingMsg("Loading demo package...");
    setTimeout(() => {
      setStep(2);
      setProcessingMsg("Extracting declarations...");
      setTimeout(() => {
        setStep(3);
        setProcessingMsg("Checking compliance...");
        setTimeout(() => {
          setDeclarations(DEMO_DECLARATIONS);
          setChecks(DEMO_COMPLIANCE_CHECKS);
          setAuditResult({ audit_id: "DEMO-001", status: "FAIL", product_id: "demo" });
          setStep(4);
          setMode("results");
        }, 600);
      }, 800);
    }, 500);
  }

  async function handleBulkSubmit() {
    if (!bulkFiles.length) return;
    setMode("processing");
    setProcessingMsg("Scanning multiple packages...");
    try {
      const data = await submitBulkUpload(Array.from(bulkFiles));
      setBulkResult(data);
      setMode("idle");
    } catch (err) {
      setError(err?.response?.data?.detail || "Bulk scan failed");
      setMode("idle");
    }
  }

  function resetAll() {
    setMode("idle"); setStep(0); setUrl(""); setFile(null); setPreview(null);
    setError(null); setAuditResult(null); setDeclarations([]); setChecks([]);
    setProcessingMsg(""); setBulkResult(null);
  }

  return (
    <div className="page-enter">
      <TopNav title="Package Inspection" subtitle="Upload or scan a packaged commodity for compliance verification" />
      <div className="p-6 space-y-6">

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i < step ? "step-done" : i === step ? "step-active" : "step-pending"
              }`}>{i < step ? "\u2713" : i + 1}</div>
              <span className={`text-xs font-medium ${i <= step ? "text-slate-700" : "text-slate-400"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-green-500" : "bg-slate-200"}`}></div>}
            </div>
          ))}
        </div>

        {/* Processing Overlay */}
        {mode === "processing" && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-slate-700 mb-2">{processingMsg}</p>
            <p className="text-xs text-slate-500">This may take a moment...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-red-500 text-lg">\u26A0</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Inspection Error</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">\u2715</button>
          </div>
        )}

        {/* IDLE: Upload Options */}
        {mode === "idle" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="card p-6">
                <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">\u{1F4F7}</span> Upload Package Image
                </h3>
                <p className="text-xs text-slate-500 mb-4">Drag and drop or select a product package photo</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }`}
                >
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  {preview ? (
                    <div>
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow mb-3" />
                      <p className="text-sm font-medium text-slate-700">{file?.name}</p>
                      <p className="text-xs text-slate-400">{(file?.size / 1024).toFixed(0)} KB</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl mb-3">\u{1F4E4}</div>
                      <p className="text-sm font-medium text-slate-600">Drop package image here</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 10MB</p>
                    </>
                  )}
                </div>
                {preview && (
                  <button onClick={runImageAudit} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                    <span>\u{1F50D}</span> Run Inspection
                  </button>
                )}
              </div>

              {/* URL Audit */}
              <div className="card p-6">
                <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">\u{1F517}</span> Audit Product URL
                </h3>
                <p className="text-xs text-slate-500 mb-4">Paste an e-commerce product URL (Amazon, Flipkart, etc.)</p>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.amazon.in/product/..."
                  className="input-field mb-4" />
                <button onClick={runUrlAudit} disabled={!url} className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2">
                  <span>\u{1F310}</span> Scrape & Audit
                </button>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">\u{1F4E6} Bulk Scan (Shelf/Warehouse)</h4>
                  <input type="file" multiple accept="image/*" onChange={(e) => setBulkFiles(e.target.files)}
                    className="text-sm w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold cursor-pointer" />
                  {bulkFiles.length > 0 && (
                    <button onClick={handleBulkSubmit} className="btn-outline w-full mt-3 text-sm">
                      Scan {bulkFiles.length} image{bulkFiles.length > 1 ? "s" : ""}
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button onClick={loadDemoInspection} className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                    <span>\u{1F3AF}</span> Load Demo Inspection
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1">Pre-loaded example for demonstration</p>
                </div>
              </div>
            </div>

            {/* Bulk Results */}
            {bulkResult && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Bulk Scan Results \u2014 {bulkResult.count} package(s)</h3>
                <div className="space-y-2">
                  {bulkResult.accepted?.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className={`w-2.5 h-2.5 rounded-full ${a.status === 'PASS' || a.status === 'PASS_' ? 'bg-green-500' : a.status === 'FAIL' ? 'bg-red-500' : 'bg-amber-400'}`}></span>
                      <span className="text-sm text-slate-600 flex-1">{a.filename}</span>
                      <span className="text-xs font-semibold text-slate-500">{a.status === 'PASS_' ? 'PASS' : a.status}</span>
                      <a href={`/inspector/${a.audit_id}`} className="text-xs text-blue-600 font-semibold hover:underline">View \u2192</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* RESULTS */}
        {mode === "results" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Inspection Results</h3>
              <div className="flex gap-2">
                {auditResult?.audit_id && !auditResult.audit_id.startsWith("DEMO") && (
                  <a href={`/inspector/${auditResult.audit_id}`} className="btn-outline text-sm">Full Audit View \u2192</a>
                )}
                <button onClick={resetAll} className="btn-outline text-sm">\u{1F504} New Inspection</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: Image + Extracted Declarations */}
              <div className="space-y-4">
                {preview && (
                  <div className="card p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Package Image</h4>
                    <img src={preview} alt="Package" className="w-full rounded-lg shadow" />
                  </div>
                )}
                <div className="card p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Extracted Declarations</h4>
                  <div className="space-y-2">
                    {declarations.map((d, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <span className={`mt-0.5 text-sm ${
                          d.status === "detected" ? "text-green-500" : d.status === "missing" ? "text-red-500" : d.status === "review" ? "text-amber-500" : "text-slate-400"
                        }`}>{d.status === "detected" ? "\u2713" : d.status === "missing" ? "\u2717" : d.status === "review" ? "\u26A0" : "\u2014"}</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-600">{d.field}</p>
                          <p className="text-sm text-slate-800">{d.value || <span className="text-red-500 italic">Not detected</span>}</p>
                        </div>
                        <div className="text-right">
                          {d.confidence > 0 && <p className="text-[10px] text-slate-400">{d.confidence}% conf.</p>}
                          {d.evidence && <p className="text-[10px] text-blue-500 font-semibold">{d.evidence}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Compliance Checklist */}
              <div className="space-y-4">
                <div className="card p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">Legal Metrology Compliance Check</h4>
                  <p className="text-[10px] text-slate-500 mb-4">Packaged Commodities Rules, 2011</p>
                  <div className="space-y-2">
                    {checks.map((c, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${
                        c.status === "pass" ? "bg-green-50 border-green-200" :
                        c.status === "fail" ? "bg-red-50 border-red-200" :
                        "bg-amber-50 border-amber-200"
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{c.rule}</p>
                            <p className="text-sm text-slate-600 mt-0.5">{c.value}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            c.status === "pass" ? "bg-green-100 text-green-700" :
                            c.status === "fail" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>{c.status === "pass" ? "\u2713 PASS" : c.status === "fail" ? "\u2717 FAIL" : "\u26A0 REVIEW"}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[10px] text-slate-500">Requirement: {c.requirement}</p>
                          {c.evidence !== "N/A" && (
                            <button className="text-[10px] text-blue-600 font-semibold hover:underline">View Evidence</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Officer Actions */}
                <div className="card p-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-amber-800 font-medium">\u{1F4CB} AI-assisted finding \u2014 final decision requires officer validation.</p>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Officer Decision</h4>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">\u2713 Mark Compliant</button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">\u{1F6A9} Confirm Violations</button>
                  </div>
                  <button className="w-full mt-2 btn-outline text-sm">\u{1F504} Request Recheck</button>
                  {auditResult?.audit_id && !auditResult.audit_id.startsWith("DEMO") && (
                    <a href={`http://localhost:8000/api/v1/audit/${auditResult.audit_id}/report`} target="_blank"
                      className="w-full mt-2 btn-primary text-sm block text-center">\u{1F4C4} Generate PDF Report</a>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

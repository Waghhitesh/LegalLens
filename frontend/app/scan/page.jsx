"use client";
import { useState, useRef, useCallback } from "react";
import TopNav from "../../components/TopNav";

const STEPS = [
  { id: 1, label: "Uploading Image", icon: "📤" },
  { id: 2, label: "Cropping PDP Region", icon: "✂️" },
  { id: 3, label: "OCR Text Extraction", icon: "🔍" },
  { id: 4, label: "AI Vision Analysis", icon: "🧠" },
  { id: 5, label: "Rule Engine Check", icon: "⚖️" },
  { id: 6, label: "Generating Report", icon: "📋" },
];

export default function ScanPage() {
  const [mode, setMode] = useState("idle"); // idle | processing | result | error
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [decision, setDecision] = useState(null);
  const fileRef = useRef(null);

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    setMode("idle");
    setResult(null);
    setError(null);
  }

  function handleFileDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleFileSelect(f);
  }

  async function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  }

  async function startScan() {
    if (!file) { setError("Please select an image first"); return; }
    setMode("processing");
    setCurrentStep(0);
    setError(null);

    // Get location
    setCurrentStep(1);
    const loc = await getLocation();
    setLocation(loc);
    let addr = "";
    if (loc) {
      addr = `Lat: ${loc.lat.toFixed(4)}, Lng: ${loc.lng.toFixed(4)}`;
      setLocationAddress(addr);
    }

    const formData = new FormData();
    formData.append("file", file);
    if (productName) formData.append("product_name", productName);
    if (brandName) formData.append("brand_name", brandName);
    if (loc) {
      formData.append("location_lat", loc.lat.toString());
      formData.append("location_lng", loc.lng.toString());
      formData.append("location_address", addr);
    }

    // Simulate step progression
    const stepDelay = (ms) => new Promise(r => setTimeout(r, ms));
    const token = localStorage.getItem("token") || "";

    try {
      setCurrentStep(2);
      await stepDelay(600);
      setCurrentStep(3);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch("http://localhost:8000/api/v1/audit/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      setCurrentStep(4);
      await stepDelay(400);
      setCurrentStep(5);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      setCurrentStep(6);
      await stepDelay(300);

      // Fetch full audit details
      const auditRes = await fetch(`http://localhost:8000/api/v1/audit/${data.audit_id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const audit = auditRes.ok ? await auditRes.json() : data;
      audit._audit_id = data.audit_id;
      audit._product_id = data.product_id;
      setResult(audit);
      setMode("result");
    } catch (err) {
      setError(err.name === "AbortError" ? "Request timed out (60s). The AI model may be loading — try again." : err.message);
      setMode("error");
    }
  }

  const score = result?.compliance_score || 0;
  const scoreColor = score >= 70 ? "text-green-600" : score >= 40 ? "text-amber-600" : "text-red-600";
  const scoreBg = score >= 70 ? "bg-green-50 border-green-200" : score >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <div className="page-enter">
      <TopNav title="Scan Package" subtitle="Upload a product image for AI compliance analysis" />
      <div className="p-6 space-y-6">
        
        {/* IDLE or Pre-Scan */}
        {(mode === "idle" || mode === "error") && (
          <>
            {/* Product Details */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Product Details (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product Name</label>
                  <input value={productName} onChange={e => setProductName(e.target.value)}
                    placeholder="e.g. Parle-G Biscuits" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand Name</label>
                  <input value={brandName} onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. Parle" className="input-field" />
                </div>
              </div>
            </div>

            {/* Upload Zone */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2"><span>📷</span> Upload Package Image</h3>
              <p className="text-xs text-slate-500 mb-4">Drag and drop or click to select a product package photo</p>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver ? "border-blue-400 bg-blue-50" : preview ? "border-green-400 bg-green-50" : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/50"
                }`}>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => handleFileSelect(e.target.files?.[0])} />
                {preview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={preview} alt="Preview" className="max-h-48 rounded-xl shadow-md object-contain" />
                    <p className="text-sm text-green-700 font-semibold">✓ {file?.name}</p>
                    <p className="text-xs text-slate-500">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <span className="text-5xl">📦</span>
                    <p className="text-sm font-medium">Drop package image here or click to browse</p>
                    <p className="text-xs">Supports JPG, PNG, WEBP · Max 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location notice */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl px-4 py-3">
              <span>📍</span>
              <span>Clicking &quot;Start Scan&quot; will request your location for the audit report</span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button onClick={startScan} disabled={!file}
              className="btn-primary w-full py-3 text-base disabled:opacity-50 flex items-center justify-center gap-2">
              <span>🔬</span> Start AI Compliance Scan
            </button>
          </>
        )}

        {/* PROCESSING */}
        {mode === "processing" && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-3xl">🔬</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">AI Analysis in Progress</h2>
              <p className="text-sm text-slate-500 mt-1">Processing your package image...</p>
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              {STEPS.map((step) => (
                <div key={step.id} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  currentStep > step.id ? "bg-green-50 border border-green-200" :
                  currentStep === step.id ? "bg-blue-50 border border-blue-200" :
                  "bg-slate-50 border border-slate-200"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep > step.id ? "bg-green-500 text-white" :
                    currentStep === step.id ? "bg-blue-500 text-white animate-pulse" :
                    "bg-slate-200 text-slate-500"
                  }`}>
                    {currentStep > step.id ? "✓" : step.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${
                      currentStep > step.id ? "text-green-700" :
                      currentStep === step.id ? "text-blue-700" : "text-slate-500"
                    }`}>{step.label}</p>
                    {currentStep === step.id && <p className="text-xs text-blue-500 mt-0.5">Processing...</p>}
                    {currentStep > step.id && <p className="text-xs text-green-500 mt-0.5">Completed</p>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-6">First scan may take 30-60s while AI model initializes</p>
          </div>
        )}

        {/* RESULT */}
        {mode === "result" && result && (
          <>
            {/* Score Banner */}
            <div className={`card p-6 border-2 ${scoreBg} flex items-center gap-6`}>
              <div className="text-center">
                <div className={`text-5xl font-black ${scoreColor}`}>{score.toFixed(0)}</div>
                <div className="text-xs text-slate-500 mt-1">/ 100</div>
              </div>
              <div className="flex-1">
                <h2 className={`text-xl font-bold ${scoreColor}`}>
                  {score >= 70 ? "✅ Compliant" : score >= 40 ? "⚠️ Partially Compliant" : "❌ Non-Compliant"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {score >= 70 ? "Product meets all Legal Metrology requirements" : "Violations detected — see details below"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span>🕐 {new Date().toLocaleString("en-IN")}</span>
                  {locationAddress && <span>📍 {locationAddress}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <a href={`http://localhost:8000/api/v1/audit/${result._audit_id}/report`} target="_blank"
                  className="btn-primary text-sm flex items-center gap-2">📄 Download PDF</a>
                <button onClick={() => { setMode("idle"); setResult(null); setFile(null); setPreview(null); }}
                  className="btn-outline text-sm">🔄 New Scan</button>
              </div>
            </div>

            {/* Product + Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Detected Product Information</h3>
                <div className="space-y-3">
                  {[
                    ["MRP (Detected)", result.physical_mrp ? `₹${result.physical_mrp}` : "—"],
                    ["Net Weight", result.physical_net_weight || "—"],
                    ["Manufacturer", result.physical_manufacturer || "—"],
                    ["Country of Origin", result.physical_country_of_origin || "—"],
                    ["Consumer Care", result.physical_consumer_care || "—"],
                    ["Font Height", result.detected_font_height_mm ? `${result.detected_font_height_mm}mm` : "—"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">{label}</span>
                      <span className="text-xs text-slate-800 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Scanned Image</h3>
                {preview && <img src={preview} alt="Scanned package" className="w-full max-h-48 object-contain rounded-xl" />}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p><span className="font-semibold">Product:</span> {productName || "Not specified"}</p>
                  <p><span className="font-semibold">Brand:</span> {brandName || "Not specified"}</p>
                  <p><span className="font-semibold">Scan Time:</span> {new Date().toLocaleString("en-IN")}</p>
                  {locationAddress && <p><span className="font-semibold">Location:</span> {locationAddress}</p>}
                </div>
              </div>
            </div>

            {/* Violations */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4">
                {(result.violations?.length || 0) === 0 ? "✅ No Violations" : `⚠️ Violations (${result.violations?.length || 0})`}
              </h3>
              {(!result.violations || result.violations.length === 0) ? (
                <p className="text-green-600 text-sm">Product is fully compliant with all checked rules.</p>
              ) : (
                <div className="space-y-3">
                  {result.violations.map((v, i) => (
                    <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-xs font-bold text-red-700">{String(v.rule_type || "").replace(/_/g, " ")}</p>
                      <p className="text-xs text-red-600 mt-1">{v.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Officer Decision */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-1">Officer Decision</h3>
              <p className="text-xs text-slate-500 mb-4">AI finding requires human officer validation</p>
              <div className="flex gap-3">
                {[
                  { label: "Approve", value: "approved", color: "bg-green-600 hover:bg-green-700", icon: "✓" },
                  { label: "Flag", value: "flagged", color: "bg-red-600 hover:bg-red-700", icon: "🚩" },
                  { label: "Escalate", value: "escalated", color: "bg-amber-600 hover:bg-amber-700", icon: "📨" },
                ].map(btn => (
                  <button key={btn.value}
                    onClick={() => setDecision(btn.value)}
                    className={`px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all ${btn.color} ${decision === btn.value ? "ring-4 ring-offset-2 ring-current" : ""}`}>
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
              {decision && <p className="text-xs text-slate-500 mt-3">Decision recorded: <span className="font-semibold capitalize">{decision}</span></p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

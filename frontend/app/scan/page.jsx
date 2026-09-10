"use client";
import { useState, useRef } from "react";

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
  const [scanType, setScanType] = useState("image"); // image | url | bulk | barcode
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [productUrl, setProductUrl] = useState("");
  const [barcode, setBarcode] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  
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
  const bulkFileRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  function handleFileSelect(selectedFiles) {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
    const urls = newFiles.map(f => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
    setMode("idle");
    setResult(null);
    setError(null);
  }

  function handleFileDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }
  
  function handleBulkFileDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setBulkFile(e.dataTransfer.files[0]);
    }
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
    if (scanType === "image" && files.length === 0) { setError("Please select an image first"); return; }
    if (scanType === "url" && !productUrl.trim()) { setError("Please enter a product URL"); return; }
    if (scanType === "barcode" && !barcode) { setError("Please upload a barcode image"); return; }
    if (scanType === "bulk" && !bulkFile) { setError("Please select a file for bulk upload"); return; }
    
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

    const token = localStorage.getItem("token") || "";
    const stepDelay = (ms) => new Promise(r => setTimeout(r, ms));

    try {
      setCurrentStep(2);
      await stepDelay(600);
      setCurrentStep(3);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      let res;

      if (scanType === "url") {
        const body = {
          url: productUrl.trim(),
          product_name: productName || undefined,
          brand_name: brandName || undefined,
        };
        if (loc) {
          body.location_lat = loc.lat;
          body.location_lng = loc.lng;
          body.location_address = addr;
        }
        res = await fetch(`${API_URL}/api/v1/audit/url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
      } else if (scanType === "barcode") {
        const formData = new FormData();
        formData.append("image", barcode);
        if (productName) formData.append("product_name", productName);
        if (brandName) formData.append("brand_name", brandName);
        if (loc) {
          formData.append("location_lat", loc.lat.toString());
          formData.append("location_lng", loc.lng.toString());
          formData.append("location_address", addr);
        }
        res = await fetch(`${API_URL}/api/v1/audit/barcode`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          signal: controller.signal,
        });
      } else if (scanType === "bulk") {
        const formData = new FormData();
        formData.append("file", bulkFile);
        res = await fetch(`${API_URL}/api/v1/audit/bulk-upload`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          signal: controller.signal,
        });
      } else {
        // Image-based scan
        const formData = new FormData();
        files.forEach(f => formData.append("images", f));
        if (productName) formData.append("product_name", productName);
        if (brandName) formData.append("brand_name", brandName);
        if (loc) {
          formData.append("location_lat", loc.lat.toString());
          formData.append("location_lng", loc.lng.toString());
          formData.append("location_address", addr);
        }

        res = await fetch(`${API_URL}/api/v1/audit/upload`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          signal: controller.signal,
        });
      }
      clearTimeout(timeout);

      setCurrentStep(4);
      await stepDelay(400);
      setCurrentStep(5);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Scan failed" }));
        throw new Error(err.detail || "Scan failed");
      }

      const data = await res.json();
      setCurrentStep(6);
      await stepDelay(300);

      if (scanType === "bulk") {
         setResult({ isBulk: true, message: data.message || "Bulk upload successful", data });
         setMode("result");
         return;
      }

      // Fetch full audit details
      const auditRes = await fetch(`${API_URL}/api/v1/audit/${data.audit_id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const audit = auditRes.ok ? await auditRes.json() : data;
      audit._audit_id = data.audit_id;
      audit._product_id = data.product_id;
      setResult(audit);
      setMode("result");
    } catch (err) {
      setError(err.name === "AbortError" ? "Request timed out (120s). The AI model may be loading — try again." : err.message);
      setMode("error");
    }
  }

  const score = result?.compliance_score || 0;
  const scoreColor = score >= 70 ? "text-[#16A34A]" : score >= 40 ? "text-[#F59E0B]" : "text-red-500";
  const scoreBg = score >= 70 ? "bg-green-50 border-[#16A34A]/20" : score >= 40 ? "bg-amber-50 border-[#F59E0B]/20" : "bg-red-50 border-red-200";

  return (
    <div className="w-full max-w-[900px] mx-auto space-y-6 relative">
      
      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-black text-[#10264A] tracking-tight">Scan Package</h1>
        <p className="text-[12px] text-[#64748B] font-medium">Upload product images, paste a link, use bulk upload, or scan a barcode for AI compliance analysis</p>
      </div>

      {/* IDLE or Pre-Scan */}
      {(mode === "idle" || mode === "error") && (
        <>
          {/* Scan Type Selector */}
          <div className="bg-white rounded-2xl border border-[#D9E1EC] p-1.5 flex gap-1.5 shadow-sm overflow-x-auto">
            <button onClick={() => setScanType("image")}
              className={`whitespace-nowrap px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${scanType === "image" ? "bg-[#1557C0] text-white shadow-md" : "text-[#64748B] hover:bg-[#F5F7FB]"}`}>
              <span className="text-[16px]">📷</span> Single Image
            </button>
            <button onClick={() => setScanType("url")}
              className={`whitespace-nowrap px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${scanType === "url" ? "bg-[#1557C0] text-white shadow-md" : "text-[#64748B] hover:bg-[#F5F7FB]"}`}>
              <span className="text-[16px]">🔗</span> Paste URL
            </button>
            <button onClick={() => setScanType("bulk")}
              className={`whitespace-nowrap px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${scanType === "bulk" ? "bg-[#1557C0] text-white shadow-md" : "text-[#64748B] hover:bg-[#F5F7FB]"}`}>
              <span className="text-[16px]">📦</span> Bulk Upload
            </button>
            <button onClick={() => setScanType("barcode")}
              className={`whitespace-nowrap px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${scanType === "barcode" ? "bg-[#1557C0] text-white shadow-md" : "text-[#64748B] hover:bg-[#F5F7FB]"}`}>
              <span className="text-[16px]">📊</span> Scan Barcode
            </button>
          </div>

          {/* Product Details (hidden for bulk) */}
          {scanType !== "bulk" && (
            <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#10264A] mb-4 flex items-center gap-2"><span>📦</span> Product Details (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#10264A] mb-1.5">Product Name</label>
                  <input value={productName} onChange={e => setProductName(e.target.value)}
                    placeholder="e.g. Parle-G Biscuits" className="w-full border border-[#D9E1EC] rounded-xl px-4 py-3 text-[13px] font-medium bg-[#F5F7FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1557C0] text-[#17233C]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#10264A] mb-1.5">Brand Name</label>
                  <input value={brandName} onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. Parle" className="w-full border border-[#D9E1EC] rounded-xl px-4 py-3 text-[13px] font-medium bg-[#F5F7FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1557C0] text-[#17233C]" />
                </div>
              </div>
            </div>
          )}

          {/* Scan Type Content */}
          {scanType === "image" && (
            <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#10264A] mb-1 flex items-center gap-2"><span>📷</span> Upload Package Images</h3>
              <p className="text-[11px] text-[#64748B] mb-4">You can upload multiple images (front, back, side).</p>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  dragOver ? "border-[#1557C0] bg-blue-50" : files.length > 0 ? "border-[#16A34A] bg-green-50" : "border-[#D9E1EC] hover:border-[#1557C0] hover:bg-blue-50/30"
                }`}>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => handleFileSelect(e.target.files)} />
                {files.length > 0 ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2 flex-wrap justify-center">
                      {previews.map((preview, i) => (
                        <img key={i} src={preview} alt="Preview" className="h-24 w-auto rounded-xl shadow-md object-contain" />
                      ))}
                    </div>
                    <p className="text-[13px] text-[#16A34A] font-bold">✓ {files.length} image(s) selected</p>
                    <p className="text-[10px] text-[#64748B]">Click to add more images</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#64748B]">
                    <span className="text-6xl">📦</span>
                    <p className="text-[14px] font-bold text-[#10264A]">Drop package images here or click to browse</p>
                    <p className="text-[11px]">Supports JPG, PNG, WEBP · Max 10MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {scanType === "url" && (
            <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#10264A] mb-1 flex items-center gap-2"><span>🔗</span> Enter Product URL</h3>
              <p className="text-[11px] text-[#64748B] mb-4">Paste a product page link (e.g. Amazon, Flipkart)</p>
              <input value={productUrl} onChange={e => setProductUrl(e.target.value)}
                placeholder="https://www.amazon.in/dp/B00XXXX..."
                className="w-full border border-[#D9E1EC] rounded-xl px-4 py-4 text-[14px] font-medium bg-[#F5F7FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1557C0] text-[#17233C] placeholder:text-[#64748B]" />
            </div>
          )}

          {scanType === "barcode" && (
            <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#10264A] mb-1 flex items-center gap-2"><span>📊</span> Upload Barcode Image</h3>
              <p className="text-[11px] text-[#64748B] mb-4">Upload an image of the barcode to scan</p>
              <div
                onDragOver={e => { e.preventDefault(); }}
                onDrop={e => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setBarcode(e.dataTransfer.files[0]);
                }}
                onClick={() => document.getElementById('barcodeInput').click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  barcode ? "border-[#16A34A] bg-green-50" : "border-[#D9E1EC] hover:border-[#1557C0] hover:bg-blue-50/30"
                }`}>
                <input id="barcodeInput" type="file" className="hidden" accept="image/*"
                  onChange={e => { if (e.target.files && e.target.files.length > 0) setBarcode(e.target.files[0]); }} />
                {barcode ? (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[13px] text-[#16A34A] font-bold">✓ {barcode.name}</p>
                    <p className="text-[10px] text-[#64748B]">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#64748B]">
                    <span className="text-6xl">📊</span>
                    <p className="text-[14px] font-bold text-[#10264A]">Drop barcode image here or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {scanType === "bulk" && (
            <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-[#10264A] mb-1 flex items-center gap-2"><span>📦</span> Bulk Upload</h3>
              <p className="text-[11px] text-[#64748B] mb-4">Upload a CSV or ZIP file containing multiple product details</p>
              <div
                onDragOver={e => { e.preventDefault(); }}
                onDrop={handleBulkFileDrop}
                onClick={() => bulkFileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  bulkFile ? "border-[#16A34A] bg-green-50" : "border-[#D9E1EC] hover:border-[#1557C0] hover:bg-blue-50/30"
                }`}>
                <input ref={bulkFileRef} type="file" className="hidden"
                  onChange={e => { if (e.target.files && e.target.files.length > 0) setBulkFile(e.target.files[0]); }} />
                {bulkFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[13px] text-[#16A34A] font-bold">✓ {bulkFile.name}</p>
                    <p className="text-[10px] text-[#64748B]">Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#64748B]">
                    <span className="text-6xl">📁</span>
                    <p className="text-[14px] font-bold text-[#10264A]">Drop CSV/ZIP here or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location notice */}
          <div className="flex items-center gap-2 text-[11px] text-[#64748B] bg-[#F5F7FB] rounded-xl px-4 py-3 border border-[#D9E1EC]">
            <span>📍</span>
            <span>Clicking "Start Scan" will request your location for the audit report</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600 text-[13px] font-bold">{error}</p>
            </div>
          )}

          <button onClick={startScan} 
            className="w-full bg-[#1557C0] hover:bg-[#10264A] text-white font-bold rounded-xl py-4 text-[14px] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]">
            <span className="text-[18px]">🔬</span> Start {scanType === 'bulk' ? 'Bulk Upload' : 'AI Compliance Scan'}
          </button>
        </>
      )}

      {/* PROCESSING */}
      {mode === "processing" && (
        <div className="bg-white rounded-2xl border border-[#D9E1EC] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse border border-[#1557C0]/20">
              <span className="text-3xl">🔬</span>
            </div>
            <h2 className="text-[18px] font-black text-[#10264A]">Processing in Progress</h2>
            <p className="text-[12px] text-[#64748B] mt-1">Processing your request...</p>
          </div>
          <div className="space-y-3 max-w-md mx-auto">
            {STEPS.map((step) => (
              <div key={step.id} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                currentStep > step.id ? "bg-green-50 border border-[#16A34A]/20" :
                currentStep === step.id ? "bg-blue-50 border border-[#1557C0]/20" :
                "bg-[#F5F7FB] border border-[#D9E1EC]"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep > step.id ? "bg-[#16A34A] text-white" :
                  currentStep === step.id ? "bg-[#1557C0] text-white animate-pulse" :
                  "bg-[#D9E1EC] text-[#64748B]"
                }`}>
                  {currentStep > step.id ? "✓" : step.icon}
                </div>
                <div>
                  <p className={`text-[13px] font-bold ${
                    currentStep > step.id ? "text-[#16A34A]" :
                    currentStep === step.id ? "text-[#1557C0]" : "text-[#64748B]"
                  }`}>{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {mode === "result" && result && (
        <>
          {result.isBulk ? (
            <div className="bg-white rounded-2xl p-6 border-2 border-green-200 bg-green-50 flex flex-col gap-6 shadow-sm text-center">
              <h2 className="text-xl font-black text-[#16A34A]">✅ {result.message}</h2>
              <button onClick={() => { setMode("idle"); setResult(null); setBulkFile(null); }}
                  className="bg-[#F5F7FB] hover:bg-[#D9E1EC] text-[#10264A] font-bold rounded-xl px-5 py-2.5 text-[12px] border border-[#D9E1EC] transition-all max-w-xs mx-auto">🔄 New Scan</button>
            </div>
          ) : (
            <>
              {/* Score Banner */}
              <div className={`bg-white rounded-2xl p-6 border-2 ${scoreBg} flex items-center gap-6 shadow-sm`}>
                <div className="text-center">
                  <div className={`text-5xl font-black ${scoreColor}`}>{score.toFixed(0)}</div>
                  <div className="text-[10px] text-[#64748B] mt-1 font-bold">/ 100</div>
                </div>
                <div className="flex-1">
                  <h2 className={`text-xl font-black ${scoreColor}`}>
                    {score >= 70 ? "✅ Compliant" : score >= 40 ? "⚠️ Partially Compliant" : "❌ Non-Compliant"}
                  </h2>
                  <p className="text-[12px] text-[#64748B] mt-1 font-medium">
                    {score >= 70 ? "Product meets all Legal Metrology requirements" : "Violations detected — see details below"}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-[#64748B] font-bold">
                    <span>🕐 {new Date().toLocaleString("en-IN")}</span>
                    {locationAddress && <span>📍 {locationAddress}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={`${API_URL}/api/v1/audit/${result._audit_id}/report`} target="_blank"
                    className="bg-[#1557C0] hover:bg-[#10264A] text-white font-bold rounded-xl px-5 py-2.5 text-[12px] flex items-center gap-2 shadow-md transition-all">📄 Download PDF</a>
                  <button onClick={() => { setMode("idle"); setResult(null); setFiles([]); setPreviews([]); setProductUrl(""); setBarcode(""); }}
                    className="bg-[#F5F7FB] hover:bg-[#D9E1EC] text-[#10264A] font-bold rounded-xl px-5 py-2.5 text-[12px] border border-[#D9E1EC] transition-all">🔄 New Scan</button>
                </div>
              </div>

              {/* Product + Image */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
                  <h3 className="text-[13px] font-bold text-[#10264A] mb-4">Detected Product Information</h3>
                  <div className="space-y-3">
                    {[
                      ["MRP (Detected)", result.physical_mrp ? ("Rs." + result.physical_mrp) : "—"],
                      ["Net Weight", result.physical_net_weight || "—"],
                      ["Manufacturer", result.physical_manufacturer || "—"],
                      ["Country of Origin", result.physical_country_of_origin || "—"],
                      ["Consumer Care", result.physical_consumer_care || "—"],
                      ["Font Height", result.detected_font_height_mm ? (result.detected_font_height_mm + "mm") : "—"],
                    ].map(([label, val]) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-[#D9E1EC]">
                        <span className="text-[11px] font-bold text-[#64748B]">{label}</span>
                        <span className="text-[11px] text-[#10264A] font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
                  <h3 className="text-[13px] font-bold text-[#10264A] mb-4">Scanned Images</h3>
                  {previews.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {previews.map((preview, i) => (
                        <img key={i} src={preview} alt="Scanned package" className="h-24 w-auto object-contain rounded-xl" />
                      ))}
                    </div>
                  )}
                  <div className="mt-3 space-y-1 text-[11px] text-[#64748B]">
                    <p><span className="font-bold text-[#10264A]">Product:</span> {productName || "Not specified"}</p>
                    <p><span className="font-bold text-[#10264A]">Brand:</span> {brandName || "Not specified"}</p>
                    <p><span className="font-bold text-[#10264A]">Scan Time:</span> {new Date().toLocaleString("en-IN")}</p>
                    {locationAddress && <p><span className="font-bold text-[#10264A]">Location:</span> {locationAddress}</p>}
                  </div>
                </div>
              </div>

              {/* Violations */}
              <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
                <h3 className="text-[13px] font-bold text-[#10264A] mb-4">
                  {(result.violations?.length || 0) === 0 ? "No Violations" : ("Violations (" + (result.violations?.length || 0) + ")")}
                </h3>
                {(!result.violations || result.violations.length === 0) ? (
                  <p className="text-[#16A34A] text-[13px] font-bold">Product is fully compliant with all checked rules.</p>
                ) : (
                  <div className="space-y-3">
                    {result.violations.map((v, i) => (
                      <div key={i} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-[11px] font-black text-red-700">{String(v.rule_type || "").replace(/_/g, " ")}</p>
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{v.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Officer Decision */}
              <div className="bg-white rounded-2xl border border-[#D9E1EC] p-6 shadow-sm">
                <h3 className="text-[13px] font-bold text-[#10264A] mb-1">Officer Decision</h3>
                <p className="text-[11px] text-[#64748B] mb-4 font-medium">AI finding requires human officer validation</p>
                <div className="flex gap-3">
                  {[
                    { label: "Approve", value: "approved", color: "bg-[#16A34A] hover:bg-green-700", icon: "✓" },
                    { label: "Flag", value: "flagged", color: "bg-red-600 hover:bg-red-700", icon: "🚩" },
                    { label: "Escalate", value: "escalated", color: "bg-[#F59E0B] hover:bg-amber-600", icon: "📨" },
                  ].map(btn => (
                    <button key={btn.value}
                      onClick={() => setDecision(btn.value)}
                      className={"px-5 py-2.5 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm " + btn.color + " " + (decision === btn.value ? "ring-4 ring-offset-2 ring-current" : "")}>
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
                {decision && <p className="text-[11px] text-[#64748B] mt-3 font-bold">Decision recorded: <span className="capitalize text-[#10264A]">{decision}</span></p>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

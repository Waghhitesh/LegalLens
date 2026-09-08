"use client";

import { useEffect, useState } from "react";
import WebDataPanel from "../../../components/WebDataPanel";
import ImageCanvasOverlay from "../../../components/ImageCanvasOverlay";
import ComplianceCard from "../../../components/ComplianceCard";
import ReadAloudButton from "../../../components/ReadAloudButton";
import { getAudit, downloadLegalNoticeUrl, resolveMediaUrl } from "../../../lib/api";

const FIELD_TO_PHYSICAL = {
  scraped_mrp: "physical_mrp",
  scraped_net_weight: "physical_net_weight",
  scraped_manufacturer: "physical_manufacturer",
  scraped_country_of_origin: "physical_country_of_origin",
  scraped_consumer_care: "physical_consumer_care",
};

export default function InspectorPage({ params }) {
  const { id: auditId } = params;
  const [audit, setAudit] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeout;
    async function poll() {
      try {
        const data = await getAudit(auditId);
        setAudit(data);
        if (data.status === "PENDING" || data.status === "PROCESSING") {
          timeout = setTimeout(poll, 2500);
        }
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || "Failed to load audit");
      }
    }
    poll();
    return () => clearTimeout(timeout);
  }, [auditId]);

  if (error) return <div className="p-8 text-red-600 bg-red-50 m-8 rounded-xl">{error}</div>;
  if (!audit) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">⚖️</div>
        <p className="text-sm text-ink/50 font-ui">Loading audit…</p>
      </div>
    </div>
  );

  const isProcessing = ["PENDING", "PROCESSING"].includes(audit.status);
  const isPass = audit.status === "PASS" || audit.status === "PASS_";
  const score = audit.compliance_score || 0;

  const reportSpeech = `Compliance report for audit ${audit.id}. Score: ${Math.round(score)} out of 100. ${
    !audit.violations?.length
      ? "No violations detected. Product is compliant."
      : `${audit.violations.length} violation${audit.violations.length > 1 ? "s" : ""} detected: ` +
        audit.violations.map((v) => v.description).join(". ")
  }`;

  const mismatches = {};
  Object.entries(FIELD_TO_PHYSICAL).forEach(([wk, pk]) => {
    const wv = audit.product?.[wk];
    const pv = audit[pk];
    if (wv && pv && String(wv) !== String(pv)) mismatches[wk] = true;
  });

  // Build image URL: prefer the path from product, fallback to uploads/{audit_id}
  const imageUrl = audit.product?.package_image_path
    ? resolveMediaUrl(
        audit.product.package_image_path.startsWith("http")
          ? audit.product.package_image_path
          : "/uploads/" + audit.product.package_image_path.split(/[\/\\]/).pop()
      )
    : null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <p className="font-ui text-xs uppercase tracking-widest text-gold mb-1">Audit Result</p>
        <h1 className="font-display text-4xl text-navy">Single SKU &amp; Package Inspector</h1>
        <p className="font-ui text-xs text-ink/50 mt-1">Audit ID: <span className="font-mono">{audit.id}</span></p>
        {isProcessing && (
          <div className="mt-3 flex items-center gap-2 text-amber-600 text-sm">
            <span className="animate-spin">⟳</span>
            Pipeline running — scraping, cropping, and extracting label data…
          </div>
        )}
        {!isProcessing && (
          <span className={`inline-flex items-center gap-1 mt-3 text-xs font-semibold px-3 py-1.5 rounded-full ${
            isPass ? "bg-green-100 text-green-700" : audit.status === "ERROR" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
          }`}>
            {isPass ? "✓ Compliant" : audit.status === "ERROR" ? "✗ Error" : "⚠ Non-compliant"}
          </span>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WebDataPanel product={audit.product} mismatches={mismatches} />
        <ImageCanvasOverlay imageUrl={imageUrl} violations={audit.violations || []} />
      </div>

      <ComplianceCard
        auditId={audit.id}
        score={score}
        status={audit.status}
        violations={audit.violations || []}
        onDownloadNotice={() => window.open(downloadLegalNoticeUrl(audit.id), "_blank")}
      />

      {!isProcessing && (
        <div className="mt-4">
          <ReadAloudButton text={reportSpeech} label="🔊 Listen to this report" />
        </div>
      )}
    </main>
  );
}

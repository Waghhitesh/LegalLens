"use client";

const RULE_LABELS = {
  RULE_6_MANDATORY_DECLARATION: "Rule 6 — Mandatory Declaration",
  RULE_7_FONT_LEGIBILITY: "Rule 7 — Font Legibility",
  OVERCHARGING: "Cross-Reconciliation — Overcharging",
};

function scoreColor(score) {
  if (score >= 85) return { ring: "stroke-compliance-pass", text: "text-compliance-pass", bg: "bg-green-50" };
  if (score >= 60) return { ring: "stroke-compliance-warn", text: "text-compliance-warn", bg: "bg-amber-50" };
  return { ring: "stroke-compliance-fail", text: "text-compliance-fail", bg: "bg-red-50" };
}

export default function ComplianceCard({ auditId, score = 0, status, violations = [], onDownloadNotice }) {
  const colors = scoreColor(score);
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-5">
          <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
            <circle cx="50" cy="50" r="42" strokeWidth="8" className="stroke-slate-100" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="42"
              strokeWidth="8"
              fill="none"
              className={colors.ring}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="55" textAnchor="middle" className={`text-xl font-bold fill-current ${colors.text}`}>
              {Math.round(score)}%
            </text>
          </svg>

          <div>
            <p className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
              {status || "PENDING"}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              {violations.length === 0
                ? "No violations detected."
                : `${violations.length} violation${violations.length > 1 ? "s" : ""} detected.`}
            </p>
          </div>
        </div>

        <button
          onClick={onDownloadNotice}
          disabled={!auditId}
          className="shrink-0 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Download Legal Notice
        </button>
      </div>

      {violations.length > 0 && (
        <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
          {violations.map((v) => (
            <li key={v.id} className="py-3 flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {RULE_LABELS[v.rule_type] || v.rule_type}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{v.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

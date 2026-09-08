// Legal Metrology Rule Engine — Packaged Commodities Rules 2011

export const RULE_CATEGORIES = [
  {
    id: "rule6",
    title: "Rule 6 — Mandatory Declarations",
    description: "Every package of commodity meant for sale shall bear the following declarations.",
    rules: [
      { id: "r6-1", field: "manufacturer", title: "Manufacturer / Packer Name & Address", severity: "high", required: true, validationType: "PRESENT" },
      { id: "r6-2", field: "generic_name", title: "Generic Name of Commodity", severity: "medium", required: true, validationType: "PRESENT" },
      { id: "r6-3", field: "net_quantity", title: "Net Quantity", severity: "high", required: true, validationType: "PRESENT" },
      { id: "r6-4", field: "mrp", title: "Maximum Retail Price (MRP)", severity: "critical", required: true, validationType: "PRESENT" },
      { id: "r6-5", field: "consumer_care", title: "Consumer Care Details", severity: "medium", required: true, validationType: "PRESENT" },
      { id: "r6-6", field: "country_of_origin", title: "Country of Origin", severity: "medium", required: "conditional", validationType: "CONDITIONAL", condition: "Imported goods only" },
      { id: "r6-7", field: "date_of_mfg", title: "Month & Year of Manufacture/Packing", severity: "high", required: true, validationType: "PRESENT" },
      { id: "r6-8", field: "best_before", title: "Best Before / Use By Date", severity: "high", required: "conditional", validationType: "CONDITIONAL", condition: "Perishable goods" },
      { id: "r6-9", field: "unit_sale_price", title: "Unit Sale Price", severity: "low", required: "conditional", validationType: "CONDITIONAL", condition: "Where applicable" },
    ]
  },
  {
    id: "rule7",
    title: "Rule 7 — Legibility & Font Size",
    description: "Declarations shall be legible and the minimum height of numerals and letters shall be as specified.",
    rules: [
      { id: "r7-1", field: "font_height", title: "Font Height — Small Pack (≤200g/ml)", severity: "high", requirement: "Min 1mm", validationType: "VALUE_CHECK" },
      { id: "r7-2", field: "font_height", title: "Font Height — Medium Pack (200g-1kg)", severity: "high", requirement: "Min 2mm", validationType: "VALUE_CHECK" },
      { id: "r7-3", field: "font_height", title: "Font Height — Large Pack (>1kg/l)", severity: "high", requirement: "Min 4mm", validationType: "VALUE_CHECK" },
    ]
  },
  {
    id: "sec39",
    title: "Section 39 — Overcharging",
    description: "No person shall sell any pre-packaged commodity at a price exceeding the MRP.",
    rules: [
      { id: "s39-1", field: "mrp_overcharge", title: "MRP Overcharging Check", severity: "critical", validationType: "VALUE_MATCH" },
    ]
  }
];

export const SEVERITY_CONFIG = {
  critical: { label: "Critical", color: "red", bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  high: { label: "High", color: "orange", bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  medium: { label: "Medium", color: "amber", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  low: { label: "Low", color: "blue", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
};

export function runComplianceCheck(extractedData, scrapedData) {
  const results = [];
  // Rule 6 checks
  const r6Fields = [
    ["manufacturer", "Manufacturer / Packer Name & Address"],
    ["net_quantity", "Net Quantity"],
    ["mrp", "Maximum Retail Price (MRP)"],
    ["consumer_care", "Consumer Care Details"],
    ["country_of_origin", "Country of Origin"],
  ];
  for (const [field, title] of r6Fields) {
    const val = extractedData[field];
    results.push({
      rule: title,
      value: val || "Not detected",
      requirement: "Required (Rule 6)",
      status: val ? "pass" : "fail",
      evidence: val ? "Detected" : "N/A",
    });
  }
  // Overcharging
  if (scrapedData?.mrp && extractedData?.mrp) {
    const webMrp = parseFloat(scrapedData.mrp);
    const labelMrp = parseFloat(extractedData.mrp);
    results.push({
      rule: "MRP Overcharging Check",
      value: `Web: ₹${webMrp} vs Label: ₹${labelMrp}`,
      requirement: "Web ≤ Label MRP",
      status: webMrp > labelMrp ? "fail" : "pass",
      evidence: "Price comparison",
    });
  }
  return results;
}

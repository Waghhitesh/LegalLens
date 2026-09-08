// Demo data for LegalLens — realistic Indian packaged commodity examples

export const DEMO_MANUFACTURERS = [
  { id: "m1", name: "Bharat Foods Pvt Ltd", address: "Plot 12, Industrial Area Phase-II, Chandigarh 160002", products: 8, compliant: 6, flagged: 2, rate: 75.0 },
  { id: "m2", name: "Desi Spices & Co", address: "Survey No. 45, MIDC Waluj, Aurangabad 431136", products: 5, compliant: 5, flagged: 0, rate: 100.0 },
  { id: "m3", name: "Swadeshi Home Care Ltd", address: "B-22 Sector 63, NOIDA, UP 201301", products: 6, compliant: 4, flagged: 2, rate: 66.7 },
  { id: "m4", name: "Golden Harvest Industries", address: "Shed 17, GIDC Ankleshwar, Gujarat 393002", products: 4, compliant: 3, flagged: 1, rate: 75.0 },
  { id: "m5", name: "Pure & Natural Foods", address: "Khasra No 122, Haridwar, Uttarakhand 249401", products: 3, compliant: 2, flagged: 1, rate: 66.7 },
];

export const DEMO_PRODUCTS = [
  { id: "p1", name: "Premium Wheat Biscuits", category: "Biscuits", manufacturer: "Bharat Foods Pvt Ltd", mrp: 45, netQty: "200g", inspections: 4, rate: 75, status: "review" },
  { id: "p2", name: "Turmeric Powder", category: "Spices", manufacturer: "Desi Spices & Co", mrp: 85, netQty: "100g", inspections: 3, rate: 100, status: "compliant" },
  { id: "p3", name: "Coconut Hair Oil", category: "Personal Care", manufacturer: "Swadeshi Home Care Ltd", mrp: 129, netQty: "200ml", inspections: 5, rate: 60, status: "flagged" },
  { id: "p4", name: "Refined Sunflower Oil", category: "Cooking Oil", manufacturer: "Golden Harvest Industries", mrp: 180, netQty: "1L", inspections: 3, rate: 100, status: "compliant" },
  { id: "p5", name: "Handwash Liquid", category: "Personal Care", manufacturer: "Swadeshi Home Care Ltd", mrp: 99, netQty: "250ml", inspections: 2, rate: 50, status: "flagged" },
  { id: "p6", name: "Masala Chips", category: "Snacks", manufacturer: "Bharat Foods Pvt Ltd", mrp: 20, netQty: "52g", inspections: 3, rate: 100, status: "compliant" },
  { id: "p7", name: "Detergent Powder", category: "Home Care", manufacturer: "Swadeshi Home Care Ltd", mrp: 215, netQty: "1kg", inspections: 4, rate: 75, status: "review" },
  { id: "p8", name: "Mango Juice", category: "Beverages", manufacturer: "Pure & Natural Foods", mrp: 30, netQty: "200ml", inspections: 2, rate: 50, status: "flagged" },
  { id: "p9", name: "Red Chilli Powder", category: "Spices", manufacturer: "Desi Spices & Co", mrp: 60, netQty: "100g", inspections: 2, rate: 100, status: "compliant" },
  { id: "p10", name: "Bathing Soap", category: "Personal Care", manufacturer: "Golden Harvest Industries", mrp: 42, netQty: "100g", inspections: 3, rate: 66.7, status: "review" },
];

export const DEMO_INSPECTIONS = [
  { id: "LL-INS-001", product: "Premium Wheat Biscuits", manufacturer: "Bharat Foods Pvt Ltd", date: "2026-09-08", inspector: "Insp. R. Sharma", status: "compliant", issues: 0, score: 100 },
  { id: "LL-INS-002", product: "Coconut Hair Oil", manufacturer: "Swadeshi Home Care Ltd", date: "2026-09-08", inspector: "Insp. R. Sharma", status: "flagged", issues: 3, score: 45 },
  { id: "LL-INS-003", product: "Turmeric Powder", manufacturer: "Desi Spices & Co", date: "2026-09-07", inspector: "Insp. P. Verma", status: "compliant", issues: 0, score: 100 },
  { id: "LL-INS-004", product: "Refined Sunflower Oil", manufacturer: "Golden Harvest Industries", date: "2026-09-07", inspector: "Insp. R. Sharma", status: "compliant", issues: 0, score: 100 },
  { id: "LL-INS-005", product: "Handwash Liquid", manufacturer: "Swadeshi Home Care Ltd", date: "2026-09-06", inspector: "Insp. A. Gupta", status: "flagged", issues: 2, score: 55 },
  { id: "LL-INS-006", product: "Masala Chips", manufacturer: "Bharat Foods Pvt Ltd", date: "2026-09-06", inspector: "Insp. P. Verma", status: "compliant", issues: 0, score: 100 },
  { id: "LL-INS-007", product: "Mango Juice", manufacturer: "Pure & Natural Foods", date: "2026-09-05", inspector: "Insp. R. Sharma", status: "review", issues: 1, score: 70 },
  { id: "LL-INS-008", product: "Premium Wheat Biscuits", manufacturer: "Bharat Foods Pvt Ltd", date: "2026-09-05", inspector: "Insp. A. Gupta", status: "flagged", issues: 2, score: 50 },
  { id: "LL-INS-009", product: "Detergent Powder", manufacturer: "Swadeshi Home Care Ltd", date: "2026-09-04", inspector: "Insp. P. Verma", status: "review", issues: 1, score: 80 },
  { id: "LL-INS-010", product: "Red Chilli Powder", manufacturer: "Desi Spices & Co", date: "2026-09-04", inspector: "Insp. R. Sharma", status: "compliant", issues: 0, score: 100 },
  { id: "LL-INS-011", product: "Bathing Soap", manufacturer: "Golden Harvest Industries", date: "2026-09-03", inspector: "Insp. A. Gupta", status: "review", issues: 1, score: 75 },
  { id: "LL-INS-012", product: "Coconut Hair Oil", manufacturer: "Swadeshi Home Care Ltd", date: "2026-09-03", inspector: "Insp. P. Verma", status: "flagged", issues: 3, score: 40 },
  { id: "LL-INS-013", product: "Mango Juice", manufacturer: "Pure & Natural Foods", date: "2026-09-02", inspector: "Insp. R. Sharma", status: "flagged", issues: 2, score: 55 },
  { id: "LL-INS-014", product: "Premium Wheat Biscuits", manufacturer: "Bharat Foods Pvt Ltd", date: "2026-09-02", inspector: "Insp. R. Sharma", status: "compliant", issues: 0, score: 100 },
  { id: "LL-INS-015", product: "Turmeric Powder", manufacturer: "Desi Spices & Co", date: "2026-09-01", inspector: "Insp. A. Gupta", status: "compliant", issues: 0, score: 100 },
];

export const DEMO_VIOLATIONS = [
  { id: "LL-V-001", product: "Coconut Hair Oil", manufacturer: "Swadeshi Home Care Ltd", violation: "MRP Declaration", date: "2026-09-08", confidence: 96, status: "open", severity: "high", description: "MRP not printed in prominent manner. Font height below minimum 1mm requirement." },
  { id: "LL-V-002", product: "Coconut Hair Oil", manufacturer: "Swadeshi Home Care Ltd", violation: "Consumer Care Details", date: "2026-09-08", confidence: 92, status: "open", severity: "medium", description: "Consumer care contact information missing from package label." },
  { id: "LL-V-003", product: "Coconut Hair Oil", manufacturer: "Swadeshi Home Care Ltd", violation: "Country of Origin", date: "2026-09-08", confidence: 88, status: "confirmed", severity: "medium", description: "Country of origin declaration not found on the package." },
  { id: "LL-V-004", product: "Handwash Liquid", manufacturer: "Swadeshi Home Care Ltd", violation: "Net Quantity", date: "2026-09-06", confidence: 94, status: "open", severity: "high", description: "Net quantity declared as '250 ml' but standard unit should be 'mL'. Non-standard abbreviation used." },
  { id: "LL-V-005", product: "Handwash Liquid", manufacturer: "Swadeshi Home Care Ltd", violation: "Manufacturer Address", date: "2026-09-06", confidence: 85, status: "resolved", severity: "medium", description: "Manufacturer address is incomplete. PIN code not mentioned." },
  { id: "LL-V-006", product: "Mango Juice", manufacturer: "Pure & Natural Foods", violation: "Date of Manufacture", date: "2026-09-05", confidence: 90, status: "review", severity: "high", description: "Date of manufacture not clearly printed. Partially illegible due to printing quality." },
  { id: "LL-V-007", product: "Premium Wheat Biscuits", manufacturer: "Bharat Foods Pvt Ltd", violation: "MRP Overcharging", date: "2026-09-05", confidence: 98, status: "confirmed", severity: "critical", description: "Online listed price (₹49) exceeds printed MRP (₹45). Overcharging violation." },
  { id: "LL-V-008", product: "Premium Wheat Biscuits", manufacturer: "Bharat Foods Pvt Ltd", violation: "Generic Name", date: "2026-09-05", confidence: 78, status: "resolved", severity: "low", description: "Generic name of commodity not declared prominently." },
  { id: "LL-V-009", product: "Detergent Powder", manufacturer: "Swadeshi Home Care Ltd", violation: "Consumer Care Details", date: "2026-09-04", confidence: 91, status: "open", severity: "medium", description: "Consumer care email/phone not printed on the package." },
  { id: "LL-V-010", product: "Bathing Soap", manufacturer: "Golden Harvest Industries", violation: "Net Quantity", date: "2026-09-03", confidence: 87, status: "review", severity: "medium", description: "Net quantity font height appears below the minimum requirement for the package size." },
  { id: "LL-V-011", product: "Coconut Hair Oil", manufacturer: "Swadeshi Home Care Ltd", violation: "Batch Number", date: "2026-09-03", confidence: 82, status: "open", severity: "low", description: "Batch/Lot number not clearly visible." },
  { id: "LL-V-012", product: "Mango Juice", manufacturer: "Pure & Natural Foods", violation: "MRP", date: "2026-09-02", confidence: 95, status: "confirmed", severity: "high", description: "MRP includes packing charge separately which should be inclusive." },
  { id: "LL-V-013", product: "Mango Juice", manufacturer: "Pure & Natural Foods", violation: "Best Before", date: "2026-09-02", confidence: 89, status: "review", severity: "medium", description: "Best before date format is non-standard. Should use month/year format." },
];

export const DEMO_DECLARATIONS = [
  { field: "Product Name", value: "Premium Wheat Biscuits", status: "detected", confidence: 98, evidence: "Region #01" },
  { field: "Manufacturer", value: "Bharat Foods Pvt Ltd", status: "detected", confidence: 95, evidence: "Region #02" },
  { field: "Address", value: "Plot 12, Industrial Area Phase-II, Chandigarh 160002", status: "detected", confidence: 88, evidence: "Region #03" },
  { field: "Generic Name", value: "Wheat Flour Biscuits", status: "review", confidence: 72, evidence: "Region #04" },
  { field: "Net Quantity", value: "200 g", status: "detected", confidence: 97, evidence: "Region #05" },
  { field: "MRP", value: "₹45.00 (inclusive of all taxes)", status: "detected", confidence: 96, evidence: "Region #06" },
  { field: "Batch / Lot Number", value: "BF/WB/2026/A147", status: "detected", confidence: 91, evidence: "Region #07" },
  { field: "Date of Manufacture", value: "AUG 2026", status: "detected", confidence: 93, evidence: "Region #08" },
  { field: "Best Before", value: "6 months from manufacture", status: "detected", confidence: 90, evidence: "Region #09" },
  { field: "Country of Origin", value: "India", status: "detected", confidence: 94, evidence: "Region #10" },
  { field: "Consumer Care", value: "1800-123-4567", status: "missing", confidence: 0, evidence: null },
  { field: "Unit Sale Price", value: null, status: "not_applicable", confidence: 0, evidence: null },
];

export const DEMO_COMPLIANCE_CHECKS = [
  { rule: "Manufacturer/Packer Details", value: "Bharat Foods Pvt Ltd, Plot 12...", requirement: "Required (Rule 6)", status: "pass", evidence: "Region #02, #03" },
  { rule: "Generic Name of Commodity", value: "Wheat Flour Biscuits", requirement: "Required (Rule 6)", status: "review", evidence: "Region #04" },
  { rule: "Net Quantity", value: "200 g", requirement: "Required (Rule 6)", status: "pass", evidence: "Region #05" },
  { rule: "MRP (Maximum Retail Price)", value: "₹45.00", requirement: "Required (Rule 6)", status: "pass", evidence: "Region #06" },
  { rule: "Consumer Care Details", value: "Not detected", requirement: "Required (Rule 6)", status: "fail", evidence: "N/A" },
  { rule: "Country of Origin", value: "India", requirement: "Required (Imported goods)", status: "pass", evidence: "Region #10" },
  { rule: "Date of Manufacture", value: "AUG 2026", requirement: "Required", status: "pass", evidence: "Region #08" },
  { rule: "Best Before / Use By", value: "6 months from mfg.", requirement: "Required", status: "pass", evidence: "Region #09" },
  { rule: "MRP Font Height (Rule 7)", value: "Estimated 1.8mm", requirement: "Min 1mm (<200g)", status: "pass", evidence: "Region #06" },
  { rule: "MRP Overcharging Check", value: "Web: ₹49 vs Label: ₹45", requirement: "Web ≤ Label MRP", status: "fail", evidence: "Region #06" },
];

// Stats for dashboard
export const DEMO_STATS = {
  totalScanned: 128,
  compliant: 94,
  flagged: 24,
  pendingReview: 10,
  complianceRate: 73.4,
  trendData: [
    { date: "Sep 03", inspections: 8, compliance: 75 },
    { date: "Sep 04", inspections: 12, compliance: 83 },
    { date: "Sep 05", inspections: 15, compliance: 67 },
    { date: "Sep 06", inspections: 18, compliance: 72 },
    { date: "Sep 07", inspections: 22, compliance: 77 },
    { date: "Sep 08", inspections: 28, compliance: 71 },
    { date: "Sep 09", inspections: 25, compliance: 76 },
  ],
  violationsByType: {
    "MRP": 18, "Net Quantity": 12, "Consumer Care": 9, "Manufacturer Details": 7,
    "Generic Name": 5, "Date Declaration": 4, "Country of Origin": 3,
  },
};

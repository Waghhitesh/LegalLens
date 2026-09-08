export default function LawPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <p className="font-ui text-xs uppercase tracking-widest text-gold mb-2">Reference</p>
      <h1 className="font-display text-4xl text-navy mb-2">The Legal Metrology Act, 2009</h1>
      <p className="font-ui text-sm text-ink/60 mb-8">Packaged Commodities Rules, 2011 — Key provisions enforced by this system</p>

      <div className="space-y-6">
        <RuleCard
          rule="Rule 6"
          title="Mandatory Declarations"
          badge="RULE_6"
          color="navy"
          points={[
            "MRP (Maximum Retail Price) inclusive of all taxes",
            "Net Quantity / Net Weight in standard units",
            "Name and complete address of Manufacturer or Packer",
            "Country of Origin (for imported goods)",
            "Consumer Care details (phone number or email)",
            "Month and Year of Manufacture or Packing",
          ]}
        />
        <RuleCard
          rule="Rule 7"
          title="Font Legibility Requirements"
          badge="RULE_7"
          color="gold"
          points={[
            "Net content ≤ 200g/ml: minimum font height 1mm",
            "Net content 200g/ml – 1kg/l: minimum font height 2mm",
            "Net content > 1kg/l: minimum font height 4mm",
            "MRP must be declared in a clearly legible manner",
            "Font must contrast sufficiently with the background",
          ]}
        />
        <RuleCard
          rule="Section 39"
          title="Legal Notice Powers"
          badge="OVERCHARGING"
          color="maroon"
          points={[
            "Director / Controller may issue a notice requiring correction",
            "Maximum Retail Price shown on web must not exceed label MRP",
            "Selling above MRP is a cognizable offence",
            "Penalty up to ₹1 lakh for first offence, ₹2 lakh for repeat",
          ]}
        />
      </div>

      <div className="mt-8 p-5 bg-gold/10 border border-gold/30 rounded-2xl">
        <p className="text-sm font-ui text-ink/70">
          <strong>Disclaimer:</strong> This system is a decision-support tool. All generated reports are drafts for internal review.
          Consult a qualified Legal Metrology officer before issuing statutory notices.
        </p>
      </div>
    </main>
  );
}

function RuleCard({ rule, title, badge, color, points }) {
  const colorMap = { navy: "bg-navy", gold: "bg-gold", maroon: "bg-maroon" };
  return (
    <div className="bg-white border border-gold/30 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <span className={`${colorMap[color]} text-white text-xs font-semibold font-ui px-3 py-1 rounded-full`}>{rule}</span>
        <h2 className="font-display text-2xl text-navy">{title}</h2>
      </div>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-ui text-ink/80">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full ${colorMap[color]} shrink-0`} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

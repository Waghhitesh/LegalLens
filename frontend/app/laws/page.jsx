"use client";
import { useState } from "react";

const RULES = [
  {
    rule: "Rule 4",
    title: "Provisions applicable to packages intended for retail sale",
    content: "No person shall manufacture, pack, sell, import, distribute, deliver, offer, expose or possess for sale any pre-packaged commodity unless such package is in such standard quantities or number and bears thereon such declarations and particulars in such manner as may be prescribed."
  },
  {
    rule: "Rule 5",
    title: "Specific commodities to be packed and sold in recommended standard packages",
    content: "The commodities specified in the Second Schedule shall be packed for sale, distribution or delivery in such standard quantities as are specified in that Schedule. Provided that if a commodity specified in the Second Schedule is packed in a size other than that prescribed in that Schedule, a declaration that 'Not a standard pack size under the Legal Metrology (Packaged Commodities) Rules, 2011' shall be made prominently on the label of such package."
  },
  {
    rule: "Rule 6",
    title: "Declarations to be made on every package",
    content: "Every package shall bear thereon or on label securely affixed thereto, a definite, plain and conspicuous declaration made in accordance with the provisions of this chapter as to—\n(a) the name and address of the manufacturer, or where the manufacturer is not the packer, the name and address of the manufacturer and packer;\n(b) the common or generic names of the commodity;\n(c) the net quantity, in terms of the standard unit of weight or measure;\n(d) the month and year in which the commodity is manufactured or pre-packed;\n(e) the retail sale price of the package (MRP)."
  },
  {
    rule: "Rule 7",
    title: "Principal display panel - its area, size and letter",
    content: "The principal display panel, in relation to a package, means the total surface area of the package where the information required under these rules are to be given. The area of the principal display panel shall not be less than—\n(a) in the case of a rectangular package, forty percent of the product of the height and width of that panel;\n(b) in the case of a cylindrical or nearly cylindrical, round or nearly round, oval or nearly oval package, forty percent of the product of the height and average circumference of such package."
  },
  {
    rule: "Rule 8",
    title: "Declaration where to appear",
    content: "Every declaration required to be made under these rules shall appear on the principal display panel. The area not including the top, bottom, flange at top and bottom of cans, and shoulders and neck of bottle and jars shall be determined for calculating the principal display panel."
  },
  {
    rule: "Rule 9",
    title: "Manner in which declaration shall be made",
    content: "Every declaration which is required to be made on a package under these rules shall be—\n(a) legible and prominent;\n(b) numerals of the retail sale price and net quantity declaration shall be printed, painted or inscribed on the package in a colour that contrasts conspicuously with the background of the label."
  }
];

export default function LawsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-enter">
      <div className="p-6 space-y-6">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-[#10264A] mb-2">📜 Legal Metrology (Packaged Commodities) Rules, 2011</h1>
          <p className="text-slate-500 mb-8">Key regulations governing pre-packaged commodities in India.</p>

          <div className="space-y-4">
            {RULES.map((rule, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`border rounded-xl transition-all duration-300 ${isOpen ? "border-blue-500 shadow-md bg-blue-50/10" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-md text-sm font-bold ${isOpen ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {rule.rule}
                      </span>
                      <h2 className={`font-semibold text-lg ${isOpen ? "text-blue-700" : "text-slate-800"}`}>
                        {rule.title}
                      </h2>
                    </div>
                    <span className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 pt-0 text-slate-600 whitespace-pre-line leading-relaxed">
                      <div className="h-px w-full bg-slate-100 mb-4"></div>
                      {rule.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * WebDataPanel — left-hand column of the Single SKU Inspector.
 * Displays the seller-declared data as scraped from the e-commerce listing,
 * with a highlight when a field mismatches the physical-package equivalent
 * (mismatch is computed by the parent and passed in via `mismatches`).
 */
export default function WebDataPanel({ product, mismatches = {} }) {
  const fields = [
    { key: "scraped_mrp", label: "MRP", prefix: "₹" },
    { key: "scraped_net_weight", label: "Net Weight" },
    { key: "scraped_manufacturer", label: "Manufacturer" },
    { key: "scraped_country_of_origin", label: "Country of Origin" },
    { key: "scraped_consumer_care", label: "Consumer Care" },
  ];

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
        Web Listing Data
      </h2>

      {product?.url && (
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer"
          className="block text-xs text-blue-600 hover:underline truncate mb-4"
        >
          {product.url}
        </a>
      )}

      <dl className="space-y-4">
        {fields.map(({ key, label, prefix }) => {
          const value = product?.[key];
          const isMismatch = Boolean(mismatches[key]);
          return (
            <div
              key={key}
              className={`flex items-start justify-between gap-3 pb-3 border-b border-slate-100 last:border-0 ${
                isMismatch ? "bg-red-50 -mx-2 px-2 rounded-md" : ""
              }`}
            >
              <dt className="text-xs font-medium text-slate-500 w-1/3 pt-0.5">{label}</dt>
              <dd className="text-sm text-slate-800 text-right flex-1">
                {value ? `${prefix || ""}${value}` : (
                  <span className="text-slate-400 italic">Not found</span>
                )}
                {isMismatch && (
                  <span className="block text-[11px] text-red-600 font-medium mt-0.5">
                    Mismatch vs. physical package
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

import React from "react";
import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "title-asc", label: "Alphabetically: A to Z" },
  { value: "title-desc", label: "Alphabetically: Z to A" },
];

/**
 * Normalizes any Shopify sort parameter alias to the component option value.
 */
function normalizeSortValue(val) {
  if (!val) return "featured";
  const lower = String(val).trim().toLowerCase();
  if (lower === "best_selling" || lower === "bestselling" || lower === "best-selling") {
    return "best-selling";
  }
  if (lower === "created" || lower === "created_at" || lower === "newest") {
    return "newest";
  }
  if (lower === "price" || lower === "price_asc" || lower === "price-low") {
    return "price-low";
  }
  if (lower === "price_desc" || lower === "price-high") {
    return "price-high";
  }
  if (lower === "title" || lower === "title_asc" || lower === "title-asc") {
    return "title-asc";
  }
  if (lower === "title_desc" || lower === "title-desc") {
    return "title-desc";
  }
  return "featured";
}

/**
 * Elegant sorting dropdown supporting all 7 Shopify Storefront API collection sort options.
 */
export default function SortDropdown({
  value = "featured",
  onChange,
  disabled = false,
  className = "",
}) {
  const selectedValue = normalizeSortValue(value);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
      <label
        htmlFor="collection-sort-dropdown"
        className="text-xs font-medium text-[#8A7B78] shrink-0"
      >
        Sort by:
      </label>
      <select
        id="collection-sort-dropdown"
        value={selectedValue}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        aria-label="Sort collection products"
        className="text-xs font-medium text-[#380C19] bg-white border border-[#EADBCE] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#7B1E3A] hover:border-[#C5A059] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

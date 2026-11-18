import React from "react";
import { SlidersHorizontal } from "lucide-react";

/**
 * Mobile/Tablet button to trigger the mobile filter drawer.
 */
export default function FilterButton({
  onClick,
  activeCount = 0,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#EADBCE] text-xs font-semibold text-[#380C19] hover:border-[#7B1E3A] hover:text-[#7B1E3A] transition-colors shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed lg:hidden ${className}`}
      aria-label={`Open filters${activeCount > 0 ? ` (${activeCount} active)` : ""}`}
    >
      <SlidersHorizontal className="h-3.5 w-3.5 text-[#7B1E3A]" />
      <span>Filters</span>
      {activeCount > 0 && (
        <span className="grid h-4.5 min-w-4.5 px-1 place-items-center rounded-full bg-[#7B1E3A] text-white text-[10px] font-bold">
          {activeCount}
        </span>
      )}
    </button>
  );
}

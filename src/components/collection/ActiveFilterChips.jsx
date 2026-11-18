import React from "react";
import { X, RotateCcw } from "lucide-react";

/**
 * Removable active filter chips displayed above the product grid.
 */
export default function ActiveFilterChips({
  chips = [],
  onClearAll,
  className = "",
}) {
  if (!chips || chips.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 mb-6 pt-1 pb-2 border-b border-[#EADBCE]/40 ${className}`}
      aria-label="Active filters"
    >
      <span className="text-xs font-semibold text-[#8A7B78] uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#7B1E3A] border border-[#EADBCE] shadow-2xs transition-all hover:border-[#7B1E3A]"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
            className="grid h-4 w-4 place-items-center rounded-full text-[#8A7B78] hover:bg-[#F4DCD6] hover:text-[#7B1E3A] transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 ml-1 text-xs font-medium text-[#7B1E3A] hover:text-[#63172E] hover:underline cursor-pointer transition-colors"
      >
        <RotateCcw className="h-3 w-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
}

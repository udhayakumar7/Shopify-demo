import React from "react";

/**
 * Variant-based Size Filter Component for Kurtis.
 * Supports multi-select, shows accurate counts, and clearly communicates variant availability.
 */
export default function SizeFilter({
  sizes = [],
  selectedSizes = [],
  onToggleSize,
  displayMode = "pills", // "pills" | "checkboxes"
  className = "",
}) {
  if (!sizes || sizes.length === 0) return null;

  if (displayMode === "checkboxes") {
    return (
      <div className={`space-y-2 ${className}`}>
        {sizes.map((s) => {
          const isSelected = selectedSizes.some(
            (sel) => sel.toUpperCase() === s.name.toUpperCase()
          );

          return (
            <label
              key={s.name}
              className={`flex items-center justify-between group cursor-pointer text-xs select-none py-1 px-1 rounded transition-colors ${
                !s.available ? "opacity-75" : ""
              }`}
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSize(s.name)}
                  className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                />
                <span
                  className={`transition-colors ${
                    isSelected
                      ? "font-semibold text-[#7B1E3A]"
                      : "text-[#380C19] group-hover:text-[#7B1E3A]"
                  }`}
                >
                  Size {s.name}
                </span>
                {!s.available && (
                  <span className="text-[10px] text-stone-400 italic">
                    (Sold out)
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#8A7B78]">({s.count})</span>
            </label>
          );
        })}
      </div>
    );
  }

  // Default: Fashion size pills with live counts and sold-out indicators
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const isSelected = selectedSizes.some(
            (sel) => sel.toUpperCase() === s.name.toUpperCase()
          );

          return (
            <button
              key={s.name}
              type="button"
              onClick={() => onToggleSize(s.name)}
              title={
                !s.available
                  ? `Size ${s.name} (Sold out)`
                  : `Size ${s.name} (${s.count} available)`
              }
              aria-pressed={isSelected}
              className={`relative min-w-10 h-10 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex flex-col items-center justify-center ${
                isSelected
                  ? "bg-[#7B1E3A] text-white border-2 border-[#7B1E3A] shadow-xs"
                  : s.available
                  ? "bg-white text-[#380C19] border border-[#EADBCE] hover:border-[#7B1E3A] hover:bg-[#FFF8F3]"
                  : "bg-stone-50 text-stone-400 border border-dashed border-stone-300"
              }`}
            >
              <span className="font-semibold text-[11px] leading-none">
                {s.name}
              </span>
              <span
                className={`text-[9px] mt-0.5 leading-none ${
                  isSelected
                    ? "text-[#F4DCD6]"
                    : s.available
                    ? "text-[#8A7B78]"
                    : "text-stone-400 line-through"
                }`}
              >
                {s.available ? `${s.count}` : "0"}
              </span>

              {/* Diagonal strike-through for sold out variants when unselected */}
              {!s.available && !isSelected && (
                <span className="absolute inset-x-1 top-1/2 -rotate-25 border-b border-stone-300 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {sizes.some((s) => !s.available) && (
        <p className="text-[10px] text-[#8A7B78] italic">
          * Sizes with strikethrough are currently sold out.
        </p>
      )}
    </div>
  );
}

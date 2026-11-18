import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Expandable luxury filter accordion section for Harini Sarees collection filters.
 */
export default function FilterAccordion({
  title,
  defaultOpen = true,
  activeCount = 0,
  children,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-[#EADBCE]/70 py-4 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059] rounded"
      >
        <span className="flex items-center gap-2">
          <span className="font-serif text-sm font-semibold tracking-wide text-[#380C19] group-hover:text-[#7B1E3A] transition-colors">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-[#7B1E3A] text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#8A7B78] transition-transform duration-200 group-hover:text-[#7B1E3A] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && <div className="mt-3.5 space-y-2">{children}</div>}
    </div>
  );
}

import React from "react";
import FilterAccordion from "./FilterAccordion";
import PriceRangeFilter from "./PriceRangeFilter";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

/**
 * Desktop Filter Sidebar for Saree Collection Pages.
 * Clean, compact, expandable accordion sections with live counts and multi-select.
 */
export default function SareeFilterSidebar({
  facets,
  activeFilters,
  activeFilterCount,
  onToggleFilter,
  onToggleBooleanFilter,
  onSetPriceRange,
  onClearPriceRange,
  onClearAll,
  className = "",
}) {
  const {
    priceRange,
    availability = [],
    fabric = [],
    color = [],
    sareeType = [],
    occasion = [],
    workType = [],
    pattern = [],
    newArrival,
    bestSeller,
  } = facets || {};

  return (
    <aside
      className={`w-64 xl:w-72 shrink-0 bg-white/70 backdrop-blur-xs rounded-xl border border-[#EADBCE]/70 p-5 self-start ${className}`}
      aria-label="Collection filters"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#7B1E3A]" />
          <h2 className="font-serif text-base font-semibold text-[#380C19]">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="grid h-5 min-w-5 px-1.5 place-items-center rounded-full bg-[#7B1E3A] text-white text-[11px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-medium text-[#7B1E3A] hover:text-[#63172E] hover:underline cursor-pointer transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1. Price Range Accordion */}
      {priceRange && (
        <FilterAccordion
          title="Price"
          defaultOpen={true}
          activeCount={
            activeFilters.priceMin !== null || activeFilters.priceMax !== null
              ? 1
              : 0
          }
        >
          <PriceRangeFilter
            min={priceRange.min}
            max={priceRange.max}
            currentMin={activeFilters.priceMin}
            currentMax={activeFilters.priceMax}
            onChange={onSetPriceRange}
            onClear={onClearPriceRange}
          />
        </FilterAccordion>
      )}

      {/* 2. Availability Accordion */}
      {availability.length > 0 && (
        <FilterAccordion
          title="Availability"
          defaultOpen={true}
          activeCount={activeFilters.availability.length}
        >
          <div className="space-y-2">
            {availability.map((opt) => {
              const isChecked = activeFilters.availability.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleFilter("availability", opt.value)}
                      className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        isChecked
                          ? "font-semibold text-[#7B1E3A]"
                          : "text-[#380C19] group-hover:text-[#7B1E3A]"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#8A7B78]">
                    ({opt.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>
      )}

      {/* 3. Fabric Accordion */}
      {fabric.length > 0 && (
        <FilterAccordion
          title="Fabric"
          defaultOpen={true}
          activeCount={activeFilters.fabric.length}
        >
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {fabric.map((opt) => {
              const isChecked = activeFilters.fabric.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleFilter("fabric", opt.value)}
                      className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        isChecked
                          ? "font-semibold text-[#7B1E3A]"
                          : "text-[#380C19] group-hover:text-[#7B1E3A]"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#8A7B78]">
                    ({opt.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>
      )}

      {/* 4. Color Accordion */}
      {color.length > 0 && (
        <FilterAccordion
          title="Color"
          defaultOpen={true}
          activeCount={activeFilters.color.length}
        >
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {color.map((opt) => {
              const isChecked = activeFilters.color.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleFilter("color", opt.value)}
                      className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        isChecked
                          ? "font-semibold text-[#7B1E3A]"
                          : "text-[#380C19] group-hover:text-[#7B1E3A]"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#8A7B78]">
                    ({opt.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>
      )}

      {/* 5. Saree Type Accordion */}
      {sareeType.length > 0 && (
        <FilterAccordion
          title="Saree Type"
          defaultOpen={true}
          activeCount={activeFilters.sareeType.length}
        >
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {sareeType.map((opt) => {
              const isChecked = activeFilters.sareeType.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleFilter("saree_type", opt.value)}
                      className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        isChecked
                          ? "font-semibold text-[#7B1E3A]"
                          : "text-[#380C19] group-hover:text-[#7B1E3A]"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#8A7B78]">
                    ({opt.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>
      )}

      {/* 6. Occasion Accordion */}
      {occasion.length > 0 && (
        <FilterAccordion
          title="Occasion"
          defaultOpen={false}
          activeCount={activeFilters.occasion.length}
        >
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {occasion.map((opt) => {
              const isChecked = activeFilters.occasion.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleFilter("occasion", opt.value)}
                      className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        isChecked
                          ? "font-semibold text-[#7B1E3A]"
                          : "text-[#380C19] group-hover:text-[#7B1E3A]"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#8A7B78]">
                    ({opt.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>
      )}

      {/* 7. Work Type Accordion */}
      {workType.length > 0 && (
        <FilterAccordion
          title="Work Type"
          defaultOpen={false}
          activeCount={activeFilters.workType.length}
        >
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {workType.map((opt) => {
              const isChecked = activeFilters.workType.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleFilter("work_type", opt.value)}
                      className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        isChecked
                          ? "font-semibold text-[#7B1E3A]"
                          : "text-[#380C19] group-hover:text-[#7B1E3A]"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#8A7B78]">
                    ({opt.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>
      )}

      {/* 8. Pattern Accordion */}
      {pattern.length > 0 && (
        <FilterAccordion
          title="Pattern"
          defaultOpen={false}
          activeCount={activeFilters.pattern.length}
        >
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {pattern.map((opt) => {
              const isChecked = activeFilters.pattern.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleFilter("pattern", opt.value)}
                      className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                    />
                    <span
                      className={`transition-colors ${
                        isChecked
                          ? "font-semibold text-[#7B1E3A]"
                          : "text-[#380C19] group-hover:text-[#7B1E3A]"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#8A7B78]">
                    ({opt.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>
      )}

      {/* 9 & 10. Highlights / Badges (New Arrival & Best Seller) */}
      {(newArrival?.count > 0 || bestSeller?.count > 0) && (
        <FilterAccordion
          title="Special Highlights"
          defaultOpen={true}
          activeCount={
            (activeFilters.newArrival ? 1 : 0) +
            (activeFilters.bestSeller ? 1 : 0)
          }
        >
          <div className="space-y-2">
            {newArrival?.count > 0 && (
              <label className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5">
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={activeFilters.newArrival}
                    onChange={() => onToggleBooleanFilter("new_arrival")}
                    className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                  />
                  <span
                    className={`transition-colors ${
                      activeFilters.newArrival
                        ? "font-semibold text-[#7B1E3A]"
                        : "text-[#380C19] group-hover:text-[#7B1E3A]"
                    }`}
                  >
                    New Arrivals
                  </span>
                </span>
                <span className="text-[11px] text-[#8A7B78]">
                  ({newArrival.count})
                </span>
              </label>
            )}

            {bestSeller?.count > 0 && (
              <label className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5">
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={activeFilters.bestSeller}
                    onChange={() => onToggleBooleanFilter("best_seller")}
                    className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A] focus:ring-[#7B1E3A] cursor-pointer"
                  />
                  <span
                    className={`transition-colors ${
                      activeFilters.bestSeller
                        ? "font-semibold text-[#7B1E3A]"
                        : "text-[#380C19] group-hover:text-[#7B1E3A]"
                    }`}
                  >
                    Best Sellers
                  </span>
                </span>
                <span className="text-[11px] text-[#8A7B78]">
                  ({bestSeller.count})
                </span>
              </label>
            )}
          </div>
        </FilterAccordion>
      )}
    </aside>
  );
}

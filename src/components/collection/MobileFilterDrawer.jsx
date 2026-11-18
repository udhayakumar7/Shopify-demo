import React, { useEffect } from "react";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import FilterAccordion from "./FilterAccordion";
import PriceRangeFilter from "./PriceRangeFilter";
import SizeFilter from "./SizeFilter";
import Button from "../common/Button";

/**
 * Mobile slide-out drawer for Saree and Kurti collection filters.
 */
export default function MobileFilterDrawer({
  isOpen,
  onClose,
  facets,
  activeFilters,
  activeFilterCount,
  filteredCount,
  isKurti = false,
  onToggleFilter,
  onToggleBooleanFilter,
  onSetPriceRange,
  onClearPriceRange,
  onClearAll,
}) {
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    size = [],
    priceRange,
    availability = [],
    fabric = [],
    color = [],
    sareeType = [],
    neckline = [],
    sleeveType = [],
    ageGroup = [],
    sizeType = [],
    targetGender = [],
    kurtiType = [],
    fitType = [],
    occasion = [],
    workType = [],
    pattern = [],
    newArrival,
    bestSeller,
  } = facets || {};

  const productTypeLabel = isKurti
    ? filteredCount === 1
      ? "Kurti"
      : "Kurtis"
    : filteredCount === 1
    ? "Saree"
    : "Sarees";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Filter ${isKurti ? "Kurtis" : "Sarees"}`}
      className="fixed inset-0 z-50 flex lg:hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-[#FFF8F3] shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EADBCE] bg-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#7B1E3A]" />
            <h2 className="font-serif text-lg font-semibold text-[#380C19]">
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="grid h-5 min-w-5 px-1.5 place-items-center rounded-full bg-[#7B1E3A] text-white text-[11px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-medium text-[#7B1E3A] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="grid h-8 w-8 place-items-center rounded-full text-[#380C19] hover:bg-[#F4DCD6] cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Sections */}
        <div className="flex-1 overflow-y-auto px-5 py-2 divide-y divide-[#EADBCE]/50">
          {/* 1. Price Range */}
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

          {/* 2. Availability */}
          {availability.length > 0 && (
            <FilterAccordion
              title="Availability"
              defaultOpen={true}
              activeCount={activeFilters.availability?.length || 0}
            >
              <div className="space-y-2.5">
                {availability.map((opt) => {
                  const isChecked = activeFilters.availability?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("availability", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 3. Size (Kurti Variant-Based) */}
          {size.length > 0 && (
            <FilterAccordion
              title="Size"
              defaultOpen={true}
              activeCount={activeFilters.size?.length || 0}
            >
              <SizeFilter
                sizes={size}
                selectedSizes={activeFilters.size || []}
                onToggleSize={(s) => onToggleFilter("size", s)}
              />
            </FilterAccordion>
          )}

          {/* 4. Fabric */}
          {fabric.length > 0 && (
            <FilterAccordion
              title="Fabric"
              defaultOpen={true}
              activeCount={activeFilters.fabric?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {fabric.map((opt) => {
                  const isChecked = activeFilters.fabric?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("fabric", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 5. Color */}
          {color.length > 0 && (
            <FilterAccordion
              title="Color"
              defaultOpen={true}
              activeCount={activeFilters.color?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {color.map((opt) => {
                  const isChecked = activeFilters.color?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("color", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 6. Saree Type (Sarees Only) */}
          {sareeType.length > 0 && (
            <FilterAccordion
              title="Saree Type"
              defaultOpen={true}
              activeCount={activeFilters.sareeType?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {sareeType.map((opt) => {
                  const isChecked = activeFilters.sareeType?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("saree_type", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 6.5. Neckline (Category Attribute) */}
          {neckline.length > 0 && (
            <FilterAccordion
              title="Neckline"
              defaultOpen={true}
              activeCount={activeFilters.neckline?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {neckline.map((opt) => {
                  const isChecked = activeFilters.neckline?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("neckline", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 7. Kurti Type (Kurtis Only) */}
          {kurtiType.length > 0 && (
            <FilterAccordion
              title="Kurti Type"
              defaultOpen={true}
              activeCount={activeFilters.kurtiType?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {kurtiType.map((opt) => {
                  const isChecked = activeFilters.kurtiType?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("kurti_type", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 8. Fit Type (Kurtis Only) */}
          {fitType.length > 0 && (
            <FilterAccordion
              title="Fit Type"
              defaultOpen={false}
              activeCount={activeFilters.fitType?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {fitType.map((opt) => {
                  const isChecked = activeFilters.fitType?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("fit_type", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 9. Sleeve Length / Type (Category Attribute) */}
          {sleeveType.length > 0 && (
            <FilterAccordion
              title="Sleeve Length"
              defaultOpen={false}
              activeCount={activeFilters.sleeveType?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {sleeveType.map((opt) => {
                  const isChecked = activeFilters.sleeveType?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            onToggleFilter("sleeve_length", opt.value)
                          }
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 9.1. Age Group (Category Attribute) */}
          {ageGroup.length > 0 && (
            <FilterAccordion
              title="Age Group"
              defaultOpen={false}
              activeCount={activeFilters.ageGroup?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {ageGroup.map((opt) => {
                  const isChecked = activeFilters.ageGroup?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("age_group", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 9.2. Size Type (Category Attribute) */}
          {sizeType.length > 0 && (
            <FilterAccordion
              title="Size Type"
              defaultOpen={false}
              activeCount={activeFilters.sizeType?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {sizeType.map((opt) => {
                  const isChecked = activeFilters.sizeType?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("size_type", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 9.3. Target Gender (Category Attribute) */}
          {targetGender.length > 0 && (
            <FilterAccordion
              title="Target Gender"
              defaultOpen={false}
              activeCount={activeFilters.targetGender?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {targetGender.map((opt) => {
                  const isChecked = activeFilters.targetGender?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            onToggleFilter("target_gender", opt.value)
                          }
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 10. Occasion */}
          {occasion.length > 0 && (
            <FilterAccordion
              title="Occasion"
              defaultOpen={false}
              activeCount={activeFilters.occasion?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {occasion.map((opt) => {
                  const isChecked = activeFilters.occasion?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("occasion", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 11. Work Type (Sarees Only) */}
          {workType.length > 0 && (
            <FilterAccordion
              title="Work Type"
              defaultOpen={false}
              activeCount={activeFilters.workType?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {workType.map((opt) => {
                  const isChecked = activeFilters.workType?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("work_type", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 12. Pattern */}
          {pattern.length > 0 && (
            <FilterAccordion
              title="Pattern"
              defaultOpen={false}
              activeCount={activeFilters.pattern?.length || 0}
            >
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {pattern.map((opt) => {
                  const isChecked = activeFilters.pattern?.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between group cursor-pointer text-xs py-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter("pattern", opt.value)}
                          className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                        />
                        <span
                          className={
                            isChecked
                              ? "font-semibold text-[#7B1E3A]"
                              : "text-[#380C19]"
                          }
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

          {/* 13. Special Highlights */}
          {(newArrival?.count > 0 || bestSeller?.count > 0) && (
            <FilterAccordion
              title="Special Highlights"
              defaultOpen={true}
              activeCount={
                (activeFilters.newArrival ? 1 : 0) +
                (activeFilters.bestSeller ? 1 : 0)
              }
            >
              <div className="space-y-2.5">
                {newArrival?.count > 0 && (
                  <label className="flex items-center justify-between group cursor-pointer text-xs py-1">
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={activeFilters.newArrival}
                        onChange={() => onToggleBooleanFilter("new_arrival")}
                        className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                      />
                      <span
                        className={
                          activeFilters.newArrival
                            ? "font-semibold text-[#7B1E3A]"
                            : "text-[#380C19]"
                        }
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
                  <label className="flex items-center justify-between group cursor-pointer text-xs py-1">
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={activeFilters.bestSeller}
                        onChange={() => onToggleBooleanFilter("best_seller")}
                        className="h-4 w-4 rounded border-[#EADBCE] text-[#7B1E3A] accent-[#7B1E3A]"
                      />
                      <span
                        className={
                          activeFilters.bestSeller
                            ? "font-semibold text-[#7B1E3A]"
                            : "text-[#380C19]"
                        }
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
        </div>

        {/* Sticky Drawer Footer */}
        <div className="border-t border-[#EADBCE] bg-white p-4 flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex-1 py-2.5 px-3 rounded-lg border border-[#EADBCE] text-xs font-semibold text-[#380C19] hover:bg-[#FFF8F3] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#7B1E3A]" />
              <span>Reset</span>
            </button>
          )}

          <Button
            variant="primary"
            onClick={onClose}
            className="flex-2 py-2.5 text-xs font-semibold"
          >
            Show {filteredCount} {productTypeLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

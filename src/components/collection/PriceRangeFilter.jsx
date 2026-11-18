import React, { useState } from "react";
import { formatPrice } from "../../utils/currency";

/**
 * Price Range Filter with dual number inputs, range slider, validation, and reset.
 */
export default function PriceRangeFilter({
  min = 0,
  max = 10000,
  currentMin,
  currentMax,
  onChange,
  onClear,
}) {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 10000;

  const [inputMin, setInputMin] = useState(
    currentMin !== null && currentMin !== undefined ? currentMin : safeMin
  );
  const [inputMax, setInputMax] = useState(
    currentMax !== null && currentMax !== undefined ? currentMax : safeMax
  );
  const [error, setError] = useState("");

  // Sync state during render when props change from external URL update or reset
  const [prevCurrentMin, setPrevCurrentMin] = useState(currentMin);
  const [prevCurrentMax, setPrevCurrentMax] = useState(currentMax);

  if (prevCurrentMin !== currentMin || prevCurrentMax !== currentMax) {
    setPrevCurrentMin(currentMin);
    setPrevCurrentMax(currentMax);
    setInputMin(
      currentMin !== null && currentMin !== undefined ? currentMin : safeMin
    );
    setInputMax(
      currentMax !== null && currentMax !== undefined ? currentMax : safeMax
    );
    setError("");
  }

  const isFiltered =
    (currentMin !== null && currentMin !== undefined && currentMin > safeMin) ||
    (currentMax !== null && currentMax !== undefined && currentMax < safeMax);

  const handleApply = (newMin, newMax) => {
    const parsedMin = Math.max(safeMin, Math.min(newMin, safeMax));
    const parsedMax = Math.max(safeMin, Math.min(newMax, safeMax));

    if (parsedMin > parsedMax) {
      setError("Min price cannot exceed Max price");
      return;
    }

    setError("");
    onChange(parsedMin, parsedMax);
  };

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setInputMax(val);
    handleApply(inputMin, val);
  };

  const handleMinBlur = () => {
    const val = Number(inputMin);
    if (isNaN(val)) {
      setInputMin(safeMin);
      return;
    }
    handleApply(val, inputMax);
  };

  const handleMaxBlur = () => {
    const val = Number(inputMax);
    if (isNaN(val)) {
      setInputMax(safeMax);
      return;
    }
    handleApply(inputMin, val);
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Price Summary & Clear */}
      <div className="flex items-center justify-between text-xs text-[#8A7B78]">
        <span>
          Range: {formatPrice(safeMin)} – {formatPrice(safeMax)}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-medium text-[#7B1E3A] hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Slider */}
      <div className="pt-2">
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step={50}
          value={Math.min(inputMax, safeMax)}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-[#EADBCE] rounded-lg appearance-none cursor-pointer accent-[#7B1E3A]"
          aria-label="Max Price Slider"
        />
      </div>

      {/* Inputs (Min & Max) */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1">
          <label className="block text-[10px] uppercase font-semibold text-[#8A7B78] mb-1">
            Min (₹)
          </label>
          <input
            type="number"
            min={safeMin}
            max={safeMax}
            value={inputMin}
            onChange={(e) => {
              setInputMin(e.target.value);
              setError("");
            }}
            onBlur={handleMinBlur}
            onKeyDown={(e) => e.key === "Enter" && handleMinBlur()}
            className="w-full px-2.5 py-1.5 text-xs text-[#380C19] bg-white border border-[#EADBCE] rounded focus:outline-none focus:border-[#7B1E3A]"
          />
        </div>

        <span className="text-[#8A7B78] pt-4 text-xs font-serif">–</span>

        <div className="flex-1">
          <label className="block text-[10px] uppercase font-semibold text-[#8A7B78] mb-1">
            Max (₹)
          </label>
          <input
            type="number"
            min={safeMin}
            max={safeMax}
            value={inputMax}
            onChange={(e) => {
              setInputMax(e.target.value);
              setError("");
            }}
            onBlur={handleMaxBlur}
            onKeyDown={(e) => e.key === "Enter" && handleMaxBlur()}
            className="w-full px-2.5 py-1.5 text-xs text-[#380C19] bg-white border border-[#EADBCE] rounded focus:outline-none focus:border-[#7B1E3A]"
          />
        </div>
      </div>

      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
    </div>
  );
}

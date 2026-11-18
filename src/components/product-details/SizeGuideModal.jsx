import React, { useState, useEffect } from "react";
import { X, Ruler } from "lucide-react";

const SIZE_DATA = [
  { size: "XS", bustIn: "34", bustCm: "86", waistIn: "30", waistCm: "76", hipIn: "38", hipCm: "96", lengthIn: "44", lengthCm: "112" },
  { size: "S", bustIn: "36", bustCm: "91", waistIn: "32", waistCm: "81", hipIn: "40", hipCm: "101", lengthIn: "44", lengthCm: "112" },
  { size: "M", bustIn: "38", bustCm: "96", waistIn: "34", waistCm: "86", hipIn: "42", hipCm: "106", lengthIn: "45", lengthCm: "114" },
  { size: "L", bustIn: "40", bustCm: "101", waistIn: "36", waistCm: "91", hipIn: "44", hipCm: "112", lengthIn: "45", lengthCm: "114" },
  { size: "XL", bustIn: "42", bustCm: "107", waistIn: "38", waistCm: "96", hipIn: "46", hipCm: "117", lengthIn: "46", lengthCm: "117" },
  { size: "XXL", bustIn: "44", bustCm: "112", waistIn: "40", waistCm: "102", hipIn: "48", hipCm: "122", lengthIn: "46", lengthCm: "117" },
  { size: "3XL", bustIn: "46", bustCm: "117", waistIn: "42", waistCm: "107", hipIn: "50", hipCm: "127", lengthIn: "46", lengthCm: "117" },
];

export default function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState("in"); // "in" | "cm"

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full border border-[#EADBCE] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F4DCD6]/60 rounded-lg text-[#7B1E3A]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#380C19]">
                Kurti Size & Fit Guide
              </h3>
              <p className="text-xs text-[#8A7B78]">
                Standard garment measurements (relaxed Indian ethnic fit)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#8A7B78] hover:text-[#380C19] hover:bg-[#F4DCD6]/40 transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#380C19]">
            Garment Dimensions
          </span>
          <div className="inline-flex rounded-lg border border-[#EADBCE] bg-[#FFF8F3] p-1 text-xs">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                unit === "in"
                  ? "bg-[#7B1E3A] text-white shadow-xs"
                  : "text-[#8A7B78] hover:text-[#380C19]"
              }`}
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                unit === "cm"
                  ? "bg-[#7B1E3A] text-white shadow-xs"
                  : "text-[#8A7B78] hover:text-[#380C19]"
              }`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#EADBCE] rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FFF8F3] border-b border-[#EADBCE] text-[#380C19] font-serif">
              <tr>
                <th className="py-3 px-4 font-semibold">Standard Size</th>
                <th className="py-3 px-4 font-semibold">Bust ({unit})</th>
                <th className="py-3 px-4 font-semibold">Waist ({unit})</th>
                <th className="py-3 px-4 font-semibold">Hip ({unit})</th>
                <th className="py-3 px-4 font-semibold">Length ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBCE]/60 text-[#521225]">
              {SIZE_DATA.map((row) => (
                <tr key={row.size} className="hover:bg-[#FFF8F3]/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#7B1E3A]">{row.size}</td>
                  <td className="py-3 px-4">{unit === "in" ? row.bustIn : row.bustCm}</td>
                  <td className="py-3 px-4">{unit === "in" ? row.waistIn : row.waistCm}</td>
                  <td className="py-3 px-4">{unit === "in" ? row.hipIn : row.hipCm}</td>
                  <td className="py-3 px-4">{unit === "in" ? row.lengthIn : row.lengthCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Tips */}
        <div className="bg-[#FFF8F3] p-4 rounded-xl border border-[#EADBCE] space-y-2 text-xs text-[#8A7B78]">
          <h4 className="font-semibold text-[#380C19] uppercase tracking-wider text-[11px]">
            How to Measure for Kurtis
          </h4>
          <ul className="list-disc list-inside space-y-1 text-[#521225]">
            <li><strong>Bust:</strong> Measure around the fullest part of your chest with tape horizontal.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
            <li><strong>Hip:</strong> Measure around the fullest part of your hips (approx. 8 inches below waist).</li>
            <li><strong>Length:</strong> Measured from highest point of the shoulder down to the garment hem.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

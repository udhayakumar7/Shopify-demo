import React from "react";
import { getCategoryMetafieldLabels } from "../../hooks/useKurtiFilters.js";

/**
 * Product Specifications Renderer
 * Displays only non-empty, category-appropriate fields for Sarees and Kurtis.
 * Supports Shopify Standard Taxonomy Category Metafields and Custom Metafields.
 */
export default function ProductSpecifications({ product, isKurti = false }) {
  if (!product) return null;

  // Extract custom metafield helper
  const metafields = product.metafields || [];
  const getCustomMeta = (key) => {
    const item = metafields.find(
      (f) => f && (f.namespace === "custom" || !f.namespace) && f.key === key
    );
    return item?.value ? String(item.value).trim() : null;
  };

  // Shared attributes (Category attribute with fallback to custom metafield)
  const fabric =
    getCategoryMetafieldLabels(product, "fabric")[0] || getCustomMeta("fabric");
  const color =
    getCategoryMetafieldLabels(product, "color-pattern")[0] ||
    getCustomMeta("color");
  const workType = getCustomMeta("work_type");
  const pattern = getCustomMeta("pattern");
  const occasion = getCustomMeta("occasion");
  const careInstructions = getCustomMeta("care_instructions");

  // Kurti-specific category & custom attributes
  const neckline =
    getCategoryMetafieldLabels(product, "neckline")[0] ||
    getCustomMeta("neckline");
  const sleeveType =
    getCategoryMetafieldLabels(product, "sleeve-length-type")[0] ||
    getCustomMeta("sleeve_type") ||
    getCustomMeta("sleeve_length");
  const ageGroup =
    getCategoryMetafieldLabels(product, "age-group")[0] ||
    getCustomMeta("age_group");
  const sizeType =
    getCategoryMetafieldLabels(product, "size-type")[0] ||
    getCustomMeta("size_type");
  const targetGender =
    getCategoryMetafieldLabels(product, "target-gender")[0] ||
    getCustomMeta("target_gender");
  const kurtiType = getCustomMeta("kurti_type");
  const fitType = getCustomMeta("fit_type");
  const setType = getCustomMeta("set_type");

  // Saree-specific metafields
  const sareeType = getCustomMeta("saree_type");
  const sareeLength = getCustomMeta("saree_length");
  const blouseIncludedRaw = getCustomMeta("blouse_included");
  const blouseIncluded = blouseIncludedRaw
    ? blouseIncludedRaw.toLowerCase() === "true"
      ? "Yes (Running Blouse Piece Included)"
      : blouseIncludedRaw.toLowerCase() === "false"
      ? "No (Saree Only)"
      : blouseIncludedRaw
    : null;

  // Construct items list based strictly on category & existence of non-empty values
  const items = [];

  if (isKurti) {
    if (kurtiType) items.push({ label: "Kurti Type", value: kurtiType });
    if (neckline) items.push({ label: "Neckline", value: neckline });
    if (sleeveType) items.push({ label: "Sleeve Length", value: sleeveType });
    if (fitType) items.push({ label: "Fit Type", value: fitType });
    if (fabric) items.push({ label: "Fabric", value: fabric });
    if (color) items.push({ label: "Color", value: color });
    if (sizeType) items.push({ label: "Size Type", value: sizeType });
    if (ageGroup) items.push({ label: "Age Group", value: ageGroup });
    if (targetGender) items.push({ label: "Target Gender", value: targetGender });
    if (setType) items.push({ label: "Set Type", value: setType });
    if (workType) items.push({ label: "Work / Embellishment", value: workType });
    if (pattern) items.push({ label: "Pattern", value: pattern });
    if (occasion) items.push({ label: "Occasion", value: occasion });
    if (careInstructions) items.push({ label: "Care Instructions", value: careInstructions });
  } else {
    // Saree
    if (sareeType) items.push({ label: "Saree Type", value: sareeType });
    if (sareeLength) items.push({ label: "Saree Length", value: sareeLength });
    if (blouseIncluded) items.push({ label: "Blouse Piece", value: blouseIncluded });
    if (fabric) items.push({ label: "Fabric", value: fabric });
    if (color) items.push({ label: "Color", value: color });
    if (workType) items.push({ label: "Work Type", value: workType });
    if (pattern) items.push({ label: "Pattern", value: pattern });
    if (occasion) items.push({ label: "Occasion", value: occasion });
    if (careInstructions) items.push({ label: "Care Instructions", value: careInstructions });
  }

  if (items.length === 0) {
    return (
      <p className="text-xs text-[#8A7B78] italic py-2">
        Artisanal specifications available upon inquiry.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-3 bg-[#FFF8F3] rounded-lg border border-[#EADBCE]/80 flex flex-col justify-center"
        >
          <span className="text-[#8A7B78] block text-[10px] font-semibold uppercase tracking-wider mb-0.5">
            {item.label}
          </span>
          <span className="text-[#380C19] font-medium text-xs sm:text-sm">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

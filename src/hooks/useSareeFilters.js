import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Extract metafield value by key from a product node.
 */
export function getProductMetafield(product, key) {
  if (!product?.metafields) return null;
  const match = product.metafields.find(
    (m) => m && m.key === key && m.value !== undefined && m.value !== null
  );
  const val = match?.value ? String(match.value).trim() : null;
  return val || null;
}

/**
 * Extract labels from a Shopify category taxonomy metafield (namespace: "shopify").
 * Handles list.metaobject_reference (Metaobject nodes with label field),
 * scalar metaobject references, JSON arrays, and string values.
 *
 * @param {object} product
 * @param {string} key
 * @returns {string[]}
 */
export function getCategoryMetafieldLabels(product, key) {
  if (!product || !product.metafields) return [];
  const meta = product.metafields.find(
    (m) => m && m.namespace === "shopify" && m.key === key
  );
  if (!meta) return [];

  const labels = [];

  // 1. Metaobject references (Shopify Standard Taxonomy)
  if (meta.references?.nodes && Array.isArray(meta.references.nodes)) {
    meta.references.nodes.forEach((node) => {
      if (node && Array.isArray(node.fields)) {
        const labelField = node.fields.find((f) => f.key === "label");
        if (labelField?.value) {
          const trimmed = String(labelField.value).trim();
          if (trimmed && !labels.includes(trimmed)) {
            labels.push(trimmed);
          }
        }
      }
    });
    if (labels.length > 0) return labels;
  }

  // 2. Direct string / JSON value fallback
  if (meta.value) {
    try {
      const parsed = JSON.parse(meta.value);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (typeof item === "string" && !item.startsWith("gid://")) {
            const trimmed = item.trim();
            if (trimmed && !labels.includes(trimmed)) labels.push(trimmed);
          }
        });
        if (labels.length > 0) return labels;
      }
    } catch {
      // Not JSON
    }

    if (typeof meta.value === "string" && !meta.value.startsWith("gid://")) {
      const trimmed = meta.value.trim();
      if (trimmed) return [trimmed];
    }
  }

  return [];
}

/**
 * Extract Saree Fabric from product metafields, tags, or title.
 */
export function getProductFabric(product) {
  const catFabric = getCategoryMetafieldLabels(product, "fabric");
  if (catFabric.length > 0) return catFabric[0];

  const meta = getProductMetafield(product, "fabric");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagFabric = tags.find((t) => /^fabric:/i.test(t));
  if (tagFabric) return tagFabric.replace(/^fabric:/i, "").trim();

  const title = product?.title || "";
  const knownFabrics = [
    "Silk",
    "Cotton",
    "Banarasi",
    "Kanjivaram",
    "Georgette",
    "Organza",
    "Chiffon",
    "Tussar",
    "Linen",
    "Crepe",
    "Chanderi",
  ];
  for (const f of knownFabrics) {
    if (new RegExp(`\\b${f}\\b`, "i").test(title)) return f;
  }
  return null;
}

/**
 * Extract Saree Color from product metafields, variant options, tags, or title.
 */
export function getProductColor(product) {
  const catColor = getCategoryMetafieldLabels(product, "color-pattern");
  if (catColor.length > 0) return catColor[0];

  const meta = getProductMetafield(product, "color");
  if (meta) return meta;

  const colorOption = product?.options?.find((o) =>
    /^(color|colour)$/i.test(o.name)
  );
  if (colorOption?.values?.[0]) return colorOption.values[0];

  const tags = product?.tags || [];
  const tagColor = tags.find((t) => /^color:/i.test(t));
  if (tagColor) return tagColor.replace(/^color:/i, "").trim();

  const title = product?.title || "";
  const knownColors = [
    "Red",
    "Maroon",
    "Pink",
    "Blue",
    "Green",
    "Yellow",
    "Gold",
    "Black",
    "White",
    "Orange",
    "Purple",
    "Beige",
    "Peach",
    "Magenta",
    "Teal",
  ];
  for (const c of knownColors) {
    if (new RegExp(`\\b${c}\\b`, "i").test(title)) return c;
  }
  return null;
}

/**
 * Extract Saree Type (Kanjivaram, Banarasi, Soft Silk, Traditional Silk, Cotton Saree, Designer Saree, etc.)
 */
export function getProductSareeType(product) {
  const meta = getProductMetafield(product, "saree_type");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagType = tags.find((t) => /^(saree_type|type):/i.test(t));
  if (tagType) return tagType.replace(/^(saree_type|type):/i, "").trim();

  const title = product?.title || "";
  const knownTypes = [
    "Traditional Silk",
    "Kanjivaram",
    "Banarasi",
    "Soft Silk",
    "Cotton Saree",
    "Designer Saree",
    "Paithani",
    "Chanderi",
    "Patola",
  ];
  for (const t of knownTypes) {
    if (new RegExp(`\\b${t}\\b`, "i").test(title)) return t;
  }
  return null;
}

/**
 * Extract Occasion (Wedding, Festive, Party Wear, Traditional, Casual)
 */
export function getProductOccasion(product) {
  const meta = getProductMetafield(product, "occasion");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagOccasion = tags.find((t) => /^occasion:/i.test(t));
  if (tagOccasion) return tagOccasion.replace(/^occasion:/i, "").trim();

  const title = product?.title || "";
  const knownOccasions = [
    "Wedding",
    "Festive",
    "Party Wear",
    "Traditional",
    "Casual",
    "Bridal",
  ];
  for (const o of knownOccasions) {
    if (new RegExp(`\\b${o}\\b`, "i").test(title)) return o;
  }
  return null;
}

/**
 * Match occasion filters flexibly (e.g. "Wedding Wear" matches "Wedding" or "Wedding Wear").
 */
export function matchesOccasion(selected, productOccasion) {
  if (!selected || !productOccasion) return false;
  const s = String(selected).trim().toLowerCase();
  const p = String(productOccasion).trim().toLowerCase();
  if (s === p) return true;
  const sBase = s.replace(/\s+wear$/i, "");
  const pBase = p.replace(/\s+wear$/i, "");
  return sBase === pBase;
}

/**
 * Extract Work Type (Zari Work, Embroidery, Printed, Plain, Woven)
 */
export function getProductWorkType(product) {
  const meta = getProductMetafield(product, "work_type");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagWork = tags.find((t) => /^work_type:/i.test(t));
  if (tagWork) return tagWork.replace(/^work_type:/i, "").trim();

  const title = product?.title || "";
  const knownWork = [
    "Zari Work",
    "Embroidery",
    "Printed",
    "Plain",
    "Woven",
    "Handloom",
    "Mirror Work",
    "Brocade",
  ];
  for (const w of knownWork) {
    if (new RegExp(`\\b${w}\\b`, "i").test(title)) return w;
  }
  return null;
}

/**
 * Extract Pattern (Floral, Traditional, Striped, Plain, Printed, Geometric)
 */
export function getProductPattern(product) {
  const meta = getProductMetafield(product, "pattern");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagPattern = tags.find((t) => /^pattern:/i.test(t));
  if (tagPattern) return tagPattern.replace(/^pattern:/i, "").trim();

  const title = product?.title || "";
  const knownPatterns = [
    "Floral",
    "Traditional",
    "Striped",
    "Plain",
    "Printed",
    "Geometric",
    "Paisley",
    "Checkered",
  ];
  for (const p of knownPatterns) {
    if (new RegExp(`\\b${p}\\b`, "i").test(title)) return p;
  }
  return null;
}

/**
 * Check if product is New Arrival.
 */
export function isNewArrivalProduct(product) {
  if (!product) return false;
  const tags = product.tags || [];
  const metafields = product.metafields || [];

  return (
    tags.some((t) => /new[-_ ]?arrival|^new$/i.test(t)) ||
    metafields.some(
      (m) =>
        (m?.key === "new_arrival" || m?.key === "is_new_arrival") &&
        String(m?.value).toLowerCase() === "true"
    ) ||
    metafields.some((m) => m?.key === "badge" && /new/i.test(m?.value || ""))
  );
}

/**
 * Check if product is Best Seller.
 */
export function isBestSellerProduct(product) {
  if (!product) return false;
  const tags = product.tags || [];
  const metafields = product.metafields || [];

  return (
    tags.some((t) => /best[-_ ]?seller|^bestseller$/i.test(t)) ||
    metafields.some(
      (m) =>
        (m?.key === "best_seller" || m?.key === "is_best_seller") &&
        String(m?.value).toLowerCase() === "true"
    ) ||
    metafields.some((m) => m?.key === "badge" && /best/i.test(m?.value || ""))
  );
}

/**
 * Custom Hook for Saree collection faceted filtering, count calculation,
 * and seamless URL query parameter synchronization.
 */
export function useSareeFilters(products = []) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Parse active filters directly from URL search params
  const activeFilters = useMemo(() => {
    const parseList = (param) => {
      const val = searchParams.get(param);
      if (!val) return [];
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const priceMinRaw = searchParams.get("filter.price_min");
    const priceMaxRaw = searchParams.get("filter.price_max");
    const priceMin =
      priceMinRaw !== null && !isNaN(Number(priceMinRaw))
        ? Number(priceMinRaw)
        : null;
    const priceMax =
      priceMaxRaw !== null && !isNaN(Number(priceMaxRaw))
        ? Number(priceMaxRaw)
        : null;

    return {
      fabric: parseList("filter.fabric"),
      color: parseList("filter.color"),
      sareeType: parseList("filter.saree_type"),
      occasion: parseList("filter.occasion"),
      workType: parseList("filter.work_type"),
      pattern: parseList("filter.pattern"),
      availability: parseList("filter.availability"), // 'in_stock' | 'out_of_stock'
      priceMin,
      priceMax,
      newArrival: searchParams.get("filter.new_arrival") === "true",
      bestSeller: searchParams.get("filter.best_seller") === "true",
    };
  }, [searchParams]);

  // 2. Discover Min/Max prices across current collection products
  const collectionPriceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 10000 };
    let min = Infinity;
    let max = -Infinity;

    products.forEach((p) => {
      const amt = Number(p.priceRange?.minVariantPrice?.amount || 0);
      if (amt < min) min = amt;
      if (amt > max) max = amt;
    });

    return {
      min: min === Infinity ? 0 : Math.floor(min),
      max: max === -Infinity ? 10000 : Math.ceil(max),
    };
  }, [products]);

  // 3. Build Available Facet Options and Accurate Matching Counts
  // Only show options actually present in the current collection!
  const availableFacets = useMemo(() => {
    const fabricMap = new Map();
    const colorMap = new Map();
    const sareeTypeMap = new Map();
    const occasionMap = new Map();
    const workTypeMap = new Map();
    const patternMap = new Map();
    let inStockCount = 0;
    let outOfStockCount = 0;
    let newArrivalCount = 0;
    let bestSellerCount = 0;

    products.forEach((p) => {
      const isAvailable = Boolean(p.availableForSale);
      if (isAvailable) inStockCount += 1;
      else outOfStockCount += 1;

      if (isNewArrivalProduct(p)) newArrivalCount += 1;
      if (isBestSellerProduct(p)) bestSellerCount += 1;

      const f = getProductFabric(p);
      if (f) fabricMap.set(f, (fabricMap.get(f) || 0) + 1);

      const c = getProductColor(p);
      if (c) colorMap.set(c, (colorMap.get(c) || 0) + 1);

      const st = getProductSareeType(p);
      if (st) sareeTypeMap.set(st, (sareeTypeMap.get(st) || 0) + 1);

      const o = getProductOccasion(p);
      if (o) occasionMap.set(o, (occasionMap.get(o) || 0) + 1);

      const wt = getProductWorkType(p);
      if (wt) workTypeMap.set(wt, (workTypeMap.get(wt) || 0) + 1);

      const pat = getProductPattern(p);
      if (pat) patternMap.set(pat, (patternMap.get(pat) || 0) + 1);
    });

    const toSortedList = (map) =>
      Array.from(map.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    return {
      priceRange: {
        min: collectionPriceBounds.min,
        max: collectionPriceBounds.max,
        currentMin: activeFilters.priceMin ?? collectionPriceBounds.min,
        currentMax: activeFilters.priceMax ?? collectionPriceBounds.max,
      },
      availability: [
        { value: "in_stock", label: "In Stock", count: inStockCount },
        { value: "out_of_stock", label: "Out of Stock", count: outOfStockCount },
      ].filter((item) => item.count > 0 || activeFilters.availability.includes(item.value)),
      fabric: toSortedList(fabricMap),
      color: toSortedList(colorMap),
      sareeType: toSortedList(sareeTypeMap),
      occasion: toSortedList(occasionMap),
      workType: toSortedList(workTypeMap),
      pattern: toSortedList(patternMap),
      newArrival: { count: newArrivalCount, active: activeFilters.newArrival },
      bestSeller: { count: bestSellerCount, active: activeFilters.bestSeller },
    };
  }, [products, collectionPriceBounds, activeFilters]);

  // 4. Compute Filtered Products
  // Applies OR within same group, AND across groups
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Price Filter
      const price = Number(p.priceRange?.minVariantPrice?.amount || 0);
      if (activeFilters.priceMin !== null && price < activeFilters.priceMin) {
        return false;
      }
      if (activeFilters.priceMax !== null && price > activeFilters.priceMax) {
        return false;
      }

      // Availability Filter
      if (activeFilters.availability.length > 0) {
        const isAvailable = Boolean(p.availableForSale);
        const matchesStock =
          (activeFilters.availability.includes("in_stock") && isAvailable) ||
          (activeFilters.availability.includes("out_of_stock") && !isAvailable);
        if (!matchesStock) return false;
      }

      // Fabric Filter
      if (activeFilters.fabric.length > 0) {
        const fabric = getProductFabric(p);
        if (
          !fabric ||
          !activeFilters.fabric.some(
            (f) => f.toLowerCase() === fabric.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // Color Filter
      if (activeFilters.color.length > 0) {
        const color = getProductColor(p);
        if (
          !color ||
          !activeFilters.color.some(
            (c) => c.toLowerCase() === color.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // Saree Type Filter
      if (activeFilters.sareeType.length > 0) {
        const type = getProductSareeType(p);
        if (
          !type ||
          !activeFilters.sareeType.some(
            (t) => t.toLowerCase() === type.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // Occasion Filter
      if (activeFilters.occasion.length > 0) {
        const occ = getProductOccasion(p);
        if (
          !occ ||
          !activeFilters.occasion.some(
            (o) => matchesOccasion(o, occ)
          )
        ) {
          return false;
        }
      }

      // Work Type Filter
      if (activeFilters.workType.length > 0) {
        const work = getProductWorkType(p);
        if (
          !work ||
          !activeFilters.workType.some(
            (w) => w.toLowerCase() === work.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // Pattern Filter
      if (activeFilters.pattern.length > 0) {
        const pat = getProductPattern(p);
        if (
          !pat ||
          !activeFilters.pattern.some(
            (pt) => pt.toLowerCase() === pat.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // New Arrival Filter
      if (activeFilters.newArrival && !isNewArrivalProduct(p)) {
        return false;
      }

      // Best Seller Filter
      if (activeFilters.bestSeller && !isBestSellerProduct(p)) {
        return false;
      }

      return true;
    });
  }, [products, activeFilters]);

  // 5. URL Mutator Helper
  const updateUrlParams = useCallback(
    (mutator) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutator(next);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // 6. Filter Actions
  const toggleFilter = useCallback(
    (group, value) => {
      updateUrlParams((params) => {
        const paramKey = `filter.${group}`;
        const currentVals = (params.get(paramKey) || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const exists = currentVals.includes(value);
        let updated;
        if (exists) {
          updated = currentVals.filter((v) => v !== value);
        } else {
          updated = [...currentVals, value];
        }

        if (updated.length > 0) {
          params.set(paramKey, updated.join(","));
        } else {
          params.delete(paramKey);
        }
      });
    },
    [updateUrlParams]
  );

  const toggleBooleanFilter = useCallback(
    (paramName) => {
      updateUrlParams((params) => {
        const paramKey = `filter.${paramName}`;
        if (params.get(paramKey) === "true") {
          params.delete(paramKey);
        } else {
          params.set(paramKey, "true");
        }
      });
    },
    [updateUrlParams]
  );

  const setPriceRange = useCallback(
    (min, max) => {
      updateUrlParams((params) => {
        if (min !== null && min !== undefined && !isNaN(min)) {
          params.set("filter.price_min", String(min));
        } else {
          params.delete("filter.price_min");
        }

        if (max !== null && max !== undefined && !isNaN(max)) {
          params.set("filter.price_max", String(max));
        } else {
          params.delete("filter.price_max");
        }
      });
    },
    [updateUrlParams]
  );

  const clearPriceRange = useCallback(() => {
    updateUrlParams((params) => {
      params.delete("filter.price_min");
      params.delete("filter.price_max");
    });
  }, [updateUrlParams]);

  const removeFilter = useCallback(
    (group, value) => {
      if (group === "price") {
        clearPriceRange();
        return;
      }
      if (group === "new_arrival" || group === "best_seller") {
        updateUrlParams((params) => {
          params.delete(`filter.${group}`);
        });
        return;
      }
      toggleFilter(group, value);
    },
    [clearPriceRange, toggleFilter, updateUrlParams]
  );

  const clearAllFilters = useCallback(() => {
    updateUrlParams((params) => {
      const keysToDelete = [];
      for (const [key] of params.entries()) {
        if (key.startsWith("filter.")) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach((k) => params.delete(k));
    });
  }, [updateUrlParams]);

  // 7. Active Chips Generator
  const activeChips = useMemo(() => {
    const chips = [];

    // Price chip
    if (activeFilters.priceMin !== null || activeFilters.priceMax !== null) {
      const minText =
        activeFilters.priceMin !== null
          ? `₹${activeFilters.priceMin.toLocaleString("en-IN")}`
          : `₹${collectionPriceBounds.min.toLocaleString("en-IN")}`;
      const maxText =
        activeFilters.priceMax !== null
          ? `₹${activeFilters.priceMax.toLocaleString("en-IN")}`
          : `₹${collectionPriceBounds.max.toLocaleString("en-IN")}`;

      chips.push({
        id: "chip-price",
        group: "price",
        label: `Price: ${minText}–${maxText}`,
        onRemove: () => clearPriceRange(),
      });
    }

    // Availability chips
    activeFilters.availability.forEach((val) => {
      chips.push({
        id: `chip-avail-${val}`,
        group: "availability",
        value: val,
        label: val === "in_stock" ? "In Stock" : "Out of Stock",
        onRemove: () => removeFilter("availability", val),
      });
    });

    // Multi-select text groups
    const multiGroups = [
      { key: "fabric", label: "Fabric", valKey: "fabric" },
      { key: "color", label: "Color", valKey: "color" },
      { key: "saree_type", label: "Type", valKey: "sareeType" },
      { key: "occasion", label: "Occasion", valKey: "occasion" },
      { key: "work_type", label: "Work", valKey: "workType" },
      { key: "pattern", label: "Pattern", valKey: "pattern" },
    ];

    multiGroups.forEach(({ key, valKey }) => {
      activeFilters[valKey].forEach((val) => {
        chips.push({
          id: `chip-${key}-${val}`,
          group: key,
          value: val,
          label: val,
          onRemove: () => removeFilter(key, val),
        });
      });
    });

    // Boolean badges
    if (activeFilters.newArrival) {
      chips.push({
        id: "chip-new-arrival",
        group: "new_arrival",
        label: "New Arrival",
        onRemove: () => removeFilter("new_arrival"),
      });
    }

    if (activeFilters.bestSeller) {
      chips.push({
        id: "chip-best-seller",
        group: "best_seller",
        label: "Best Seller",
        onRemove: () => removeFilter("best_seller"),
      });
    }

    return chips;
  }, [
    activeFilters,
    collectionPriceBounds,
    clearPriceRange,
    removeFilter,
  ]);

  const activeFilterCount = activeChips.length;

  return {
    filteredProducts,
    availableFacets,
    activeFilters,
    activeChips,
    activeFilterCount,
    toggleFilter,
    toggleBooleanFilter,
    setPriceRange,
    clearPriceRange,
    removeFilter,
    clearAllFilters,
  };
}

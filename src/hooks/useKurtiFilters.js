import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProductMetafield,
  getCategoryMetafieldLabels,
  isNewArrivalProduct,
  isBestSellerProduct,
  matchesOccasion,
} from "./useSareeFilters.js";

export { getCategoryMetafieldLabels };

/**
 * Standard fashion size sort order.
 * Preserves exact labels: XS, S, M, L, XL, 2XL, 3XL, 4XL, XXL, XXXL.
 */
export const SIZE_ORDER = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "XXL",
  "XXXL",
  "5XL",
];

/**
 * Extract size options and variants from both:
 * 1. Shopify product variants (variantOption with name "Size")
 * 2. Shopify category size attribute (shopify.size taxonomy metafield)
 *
 * Avoids duplicate size entries and strictly preserves exact labels:
 * S, M, L, XL, 2XL, 3XL, 4XL (no renaming to XXL / XXXL).
 *
 * @param {object} product
 * @returns {Array<{ name: string, available: boolean, variantId: string|null, isVariantOption: boolean }>}
 */
export function extractKurtiSizes(product) {
  if (!product) return [];

  const sizes = [];
  const variants = product.variants?.nodes || [];
  const sizeOption = product.options?.find((o) => /size/i.test(o.name));

  // 1. Extract from variant selectedOptions where name is Size
  variants.forEach((v) => {
    const opt = v.selectedOptions?.find((so) => /size/i.test(so.name));
    if (opt && opt.value) {
      const val = opt.value.trim();
      const existing = sizes.find(
        (s) => s.name.toUpperCase() === val.toUpperCase()
      );
      if (!existing) {
        sizes.push({
          name: val,
          available: Boolean(v.availableForSale),
          variantId: v.id,
          isVariantOption: true,
        });
      } else if (v.availableForSale) {
        existing.available = true;
      }
    } else if (v.title && v.title !== "Default Title") {
      // Handle variant title that specifies a size (e.g. "M" or "S / Blue")
      const titleParts = v.title.split("/").map((p) => p.trim());
      for (const part of titleParts) {
        const upper = part.toUpperCase();
        if (SIZE_ORDER.includes(upper)) {
          const existing = sizes.find((s) => s.name.toUpperCase() === upper);
          if (!existing) {
            sizes.push({
              name: upper,
              available: Boolean(v.availableForSale),
              variantId: v.id,
              isVariantOption: true,
            });
          } else if (v.availableForSale) {
            existing.available = true;
          }
        }
      }
    }
  });

  // 2. If options define sizes but variants didn't have selectedOptions
  if (sizes.length === 0 && sizeOption?.values) {
    sizeOption.values.forEach((val) => {
      const trimmed = val.trim();
      sizes.push({
        name: trimmed,
        available: Boolean(product.availableForSale),
        variantId: null,
        isVariantOption: true,
      });
    });
  }

  // 3. Extract from Category Size attribute (shopify.size metaobject references)
  // Preserves exact Shopify taxonomy labels: S, M, L, XL, 2XL, 3XL, 4XL
  const categorySizes = getCategoryMetafieldLabels(product, "size");
  categorySizes.forEach((catSize) => {
    const existing = sizes.find(
      (s) => s.name.toUpperCase() === catSize.toUpperCase()
    );
    if (!existing) {
      sizes.push({
        name: catSize,
        available: Boolean(product.availableForSale),
        variantId: product.variants?.nodes?.[0]?.id || null,
        isVariantOption: false,
      });
    }
  });

  // 4. Fallback: check tags for sizes
  if (sizes.length === 0) {
    const tags = product.tags || [];
    tags.forEach((t) => {
      const clean = t.replace(/^size:/i, "").trim();
      const upper = clean.toUpperCase();
      if (SIZE_ORDER.includes(upper)) {
        if (!sizes.some((s) => s.name.toUpperCase() === upper)) {
          sizes.push({
            name: clean,
            available: Boolean(product.availableForSale),
            variantId: null,
            isVariantOption: false,
          });
        }
      }
    });
  }

  return sizes;
}

/**
 * Extract Kurti Fabric (Cotton, Rayon, Silk, Georgette, Linen, etc.)
 * Checks category taxonomy attribute (shopify.fabric) first, then custom.fabric, tags, title.
 */
export function getKurtiFabric(product) {
  // 1. Shopify Category Metafield (shopify.fabric)
  const catFabrics = getCategoryMetafieldLabels(product, "fabric");
  if (catFabrics.length > 0) return catFabrics[0];

  // 2. Custom Metafield
  const meta = getProductMetafield(product, "fabric");
  if (meta) return meta;

  // 3. Product Tag
  const tags = product?.tags || [];
  const tagFabric = tags.find((t) => /^fabric:/i.test(t));
  if (tagFabric) return tagFabric.replace(/^fabric:/i, "").trim();

  // 4. Product Title Regex
  const title = product?.title || "";
  const knownFabrics = [
    "Cotton",
    "Rayon",
    "Silk",
    "Georgette",
    "Linen",
    "Chanderi",
    "Mulmul",
    "Modal",
    "Crepe",
  ];
  for (const f of knownFabrics) {
    if (new RegExp(`\\b${f}\\b`, "i").test(title)) return f;
  }
  return null;
}

/**
 * Extract Kurti Color from category attribute (shopify.color-pattern),
 * custom metafield, variant option, tags, or title.
 */
export function getKurtiColor(product) {
  // 1. Shopify Category Metafield (shopify.color-pattern)
  const catColors = getCategoryMetafieldLabels(product, "color-pattern");
  if (catColors.length > 0) return catColors[0];

  // 2. Custom Metafield
  const meta = getProductMetafield(product, "color");
  if (meta) return meta;

  // 3. Variant Color Option
  const colorOption = product?.options?.find((o) =>
    /^(color|colour)$/i.test(o.name)
  );
  if (colorOption?.values?.[0]) return colorOption.values[0];

  // 4. Product Tag
  const tags = product?.tags || [];
  const tagColor = tags.find((t) => /^color:/i.test(t));
  if (tagColor) return tagColor.replace(/^color:/i, "").trim();

  // 5. Product Title Regex
  const title = product?.title || "";
  const knownColors = [
    "Blue",
    "Black",
    "White",
    "Pink",
    "Green",
    "Maroon",
    "Yellow",
    "Red",
    "Navy",
    "Purple",
    "Peach",
    "Orange",
    "Beige",
    "Indigo",
  ];
  for (const c of knownColors) {
    if (new RegExp(`\\b${c}\\b`, "i").test(title)) return c;
  }
  return null;
}

/**
 * Extract Kurti Neckline (V-neck, Round Neck, Boat Neck, Mandarin, Collar, etc.)
 * Checks category taxonomy attribute (shopify.neckline) first.
 */
export function getKurtiNeckline(product) {
  // 1. Shopify Category Metafield (shopify.neckline)
  const catNecklines = getCategoryMetafieldLabels(product, "neckline");
  if (catNecklines.length > 0) return catNecklines[0];

  // 2. Custom Metafield
  const meta = getProductMetafield(product, "neckline");
  if (meta) return meta;

  // 3. Product Tag
  const tags = product?.tags || [];
  const tagNeck = tags.find((t) => /^neck(line)?:/i.test(t));
  if (tagNeck) return tagNeck.replace(/^neck(line)?:/i, "").trim();

  // 4. Title keywords
  const title = product?.title || "";
  const knownNecklines = [
    "V-neck",
    "Round Neck",
    "Mandarin Collar",
    "Collar Neck",
    "Boat Neck",
    "Keyhole",
    "Square Neck",
    "Sweetheart",
    "U-Neck",
  ];
  for (const n of knownNecklines) {
    if (new RegExp(`\\b${n.replace("-", "[- ]")}\\b`, "i").test(title)) return n;
  }
  return null;
}

/**
 * Extract Kurti Sleeve Type (3/4, Sleeveless, Half Sleeve, Full Sleeve, etc.)
 * Checks category taxonomy attribute (shopify.sleeve-length-type) first.
 */
export function getKurtiSleeveType(product) {
  // 1. Shopify Category Metafield (shopify.sleeve-length-type)
  const catSleeves = getCategoryMetafieldLabels(product, "sleeve-length-type");
  if (catSleeves.length > 0) return catSleeves[0];

  // 2. Custom Metafield
  const meta =
    getProductMetafield(product, "sleeve_type") ||
    getProductMetafield(product, "sleeve_length");
  if (meta) return meta;

  // 3. Product Tag
  const tags = product?.tags || [];
  const tagSleeve = tags.find((t) => /^sleeve(_type|_length)?:/i.test(t));
  if (tagSleeve) return tagSleeve.replace(/^sleeve(_type|_length)?:/i, "").trim();

  // 4. Title keywords
  const title = product?.title || "";
  const knownSleeves = [
    "3/4",
    "3/4 Sleeve",
    "Sleeveless",
    "Half Sleeve",
    "Full Sleeve",
    "Roll-Up Sleeve",
    "Short Sleeve",
  ];
  for (const slv of knownSleeves) {
    if (new RegExp(`\\b${slv}\\b`, "i").test(title)) return slv;
  }
  return null;
}

/**
 * Extract Kurti Age Group (Adult, Teen, etc.)
 */
export function getKurtiAgeGroup(product) {
  const catAge = getCategoryMetafieldLabels(product, "age-group");
  if (catAge.length > 0) return catAge[0];

  const meta = getProductMetafield(product, "age_group");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagAge = tags.find((t) => /^age(_group)?:/i.test(t));
  if (tagAge) return tagAge.replace(/^age(_group)?:/i, "").trim();

  return null;
}

/**
 * Extract Kurti Size Type (Regular, Petite, Plus, etc.)
 */
export function getKurtiSizeType(product) {
  const catSizeType = getCategoryMetafieldLabels(product, "size-type");
  if (catSizeType.length > 0) return catSizeType[0];

  const meta = getProductMetafield(product, "size_type");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagType = tags.find((t) => /^size_type:/i.test(t));
  if (tagType) return tagType.replace(/^size_type:/i, "").trim();

  return null;
}

/**
 * Extract Kurti Target Gender (Female, Unisex)
 */
export function getKurtiTargetGender(product) {
  const catGender = getCategoryMetafieldLabels(product, "target-gender");
  if (catGender.length > 0) return catGender[0];

  const meta =
    getProductMetafield(product, "target_gender") ||
    getProductMetafield(product, "gender");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagGender = tags.find((t) => /^(gender|target_gender):/i.test(t));
  if (tagGender) return tagGender.replace(/^(gender|target_gender):/i, "").trim();

  return null;
}

/**
 * Extract Kurti Type (Straight, Anarkali, A-Line, Flared, Short Kurti, etc.)
 */
export function getKurtiType(product) {
  const meta = getProductMetafield(product, "kurti_type");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagType = tags.find((t) => /^(kurti_type|type):/i.test(t));
  if (tagType) return tagType.replace(/^(kurti_type|type):/i, "").trim();

  const title = product?.title || "";
  const knownTypes = [
    "Straight",
    "Anarkali",
    "A-Line",
    "Flared",
    "Short Kurti",
    "Angrakha",
    "Kaftan",
  ];
  for (const t of knownTypes) {
    if (new RegExp(`\\b${t}\\b`, "i").test(title)) return t;
  }
  return null;
}

/**
 * Extract Fit Type (Regular Fit, Relaxed Fit, Slim Fit, etc.)
 */
export function getKurtiFitType(product) {
  const meta = getProductMetafield(product, "fit_type");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagFit = tags.find((t) => /^fit(_type)?:/i.test(t));
  if (tagFit) return tagFit.replace(/^fit(_type)?:/i, "").trim();

  const title = product?.title || "";
  const knownFits = [
    "Regular Fit",
    "Relaxed Fit",
    "Slim Fit",
    "Straight Fit",
    "Loose Fit",
  ];
  for (const fit of knownFits) {
    if (new RegExp(`\\b${fit}\\b`, "i").test(title)) return fit;
  }
  return null;
}

/**
 * Extract Kurti Occasion (Casual, Office Wear, Festive, Party Wear, Traditional)
 */
export function getKurtiOccasion(product) {
  const meta = getProductMetafield(product, "occasion");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagOccasion = tags.find((t) => /^occasion:/i.test(t));
  if (tagOccasion) return tagOccasion.replace(/^occasion:/i, "").trim();

  const title = product?.title || "";
  const knownOccasions = [
    "Casual",
    "Office Wear",
    "Festive",
    "Party Wear",
    "Traditional",
    "Daily Wear",
  ];
  for (const o of knownOccasions) {
    if (new RegExp(`\\b${o}\\b`, "i").test(title)) return o;
  }
  return null;
}

/**
 * Extract Kurti Pattern (Printed, Floral, Solid, Striped, Embroidered)
 */
export function getKurtiPattern(product) {
  const meta = getProductMetafield(product, "pattern");
  if (meta) return meta;

  const tags = product?.tags || [];
  const tagPattern = tags.find((t) => /^pattern:/i.test(t));
  if (tagPattern) return tagPattern.replace(/^pattern:/i, "").trim();

  const title = product?.title || "";
  const knownPatterns = [
    "Printed",
    "Floral",
    "Solid",
    "Striped",
    "Embroidered",
    "Geometric",
    "Bandhani",
    "Block Print",
  ];
  for (const p of knownPatterns) {
    if (new RegExp(`\\b${p}\\b`, "i").test(title)) return p;
  }
  return null;
}

/**
 * Build Storefront API ProductFilter array for native collection queries.
 * Supports taxonomyMetafield, variantOption, productMetafield, available, and price.
 */
export function buildKurtiStorefrontFilters(activeFilters = {}) {
  const filters = [];

  // Availability Filter
  if (activeFilters.availability?.length === 1) {
    if (activeFilters.availability.includes("in_stock")) {
      filters.push({ available: true });
    } else if (activeFilters.availability.includes("out_of_stock")) {
      filters.push({ available: false });
    }
  }

  // Price Filter
  if (activeFilters.priceMin !== null || activeFilters.priceMax !== null) {
    const priceFilter = {};
    if (activeFilters.priceMin !== null)
      priceFilter.min = Number(activeFilters.priceMin);
    if (activeFilters.priceMax !== null)
      priceFilter.max = Number(activeFilters.priceMax);
    filters.push({ price: priceFilter });
  }

  // Size Filter (Variant Option & Taxonomy Metafield)
  if (activeFilters.size?.length > 0) {
    activeFilters.size.forEach((sz) => {
      filters.push({ variantOption: { name: "Size", value: sz } });
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "size",
          value: sz,
        },
      });
    });
  }

  // Color Filter
  if (activeFilters.color?.length > 0) {
    activeFilters.color.forEach((col) => {
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "color-pattern",
          value: col,
        },
      });
    });
  }

  // Fabric Filter
  if (activeFilters.fabric?.length > 0) {
    activeFilters.fabric.forEach((fab) => {
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "fabric",
          value: fab,
        },
      });
    });
  }

  // Neckline Filter
  if (activeFilters.neckline?.length > 0) {
    activeFilters.neckline.forEach((nl) => {
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "neckline",
          value: nl,
        },
      });
    });
  }

  // Sleeve Length Type Filter
  if (activeFilters.sleeveType?.length > 0) {
    activeFilters.sleeveType.forEach((slv) => {
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "sleeve-length-type",
          value: slv,
        },
      });
    });
  }

  // Age Group Filter
  if (activeFilters.ageGroup?.length > 0) {
    activeFilters.ageGroup.forEach((ag) => {
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "age-group",
          value: ag,
        },
      });
    });
  }

  // Size Type Filter
  if (activeFilters.sizeType?.length > 0) {
    activeFilters.sizeType.forEach((st) => {
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "size-type",
          value: st,
        },
      });
    });
  }

  // Target Gender Filter
  if (activeFilters.targetGender?.length > 0) {
    activeFilters.targetGender.forEach((tg) => {
      filters.push({
        taxonomyMetafield: {
          namespace: "shopify",
          key: "target-gender",
          value: tg,
        },
      });
    });
  }

  // Custom Metafield Filters
  if (activeFilters.kurtiType?.length > 0) {
    activeFilters.kurtiType.forEach((kt) => {
      filters.push({
        productMetafield: {
          namespace: "custom",
          key: "kurti_type",
          value: kt,
        },
      });
    });
  }

  if (activeFilters.fitType?.length > 0) {
    activeFilters.fitType.forEach((ft) => {
      filters.push({
        productMetafield: {
          namespace: "custom",
          key: "fit_type",
          value: ft,
        },
      });
    });
  }

  if (activeFilters.occasion?.length > 0) {
    activeFilters.occasion.forEach((occ) => {
      filters.push({
        productMetafield: {
          namespace: "custom",
          key: "occasion",
          value: occ,
        },
      });
    });
  }

  if (activeFilters.pattern?.length > 0) {
    activeFilters.pattern.forEach((pat) => {
      filters.push({
        productMetafield: {
          namespace: "custom",
          key: "pattern",
          value: pat,
        },
      });
    });
  }

  return filters;
}

/**
 * Custom Hook for Kurti collection faceted filtering, category & variant size logic,
 * live counts, and URL query parameter synchronization.
 */
export function useKurtiFilters(products = []) {
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
      size: parseList("filter.size"),
      fabric: parseList("filter.fabric"),
      color: parseList("filter.color"),
      neckline: parseList("filter.neckline"),
      sleeveType:
        parseList("filter.sleeve_length").length > 0
          ? parseList("filter.sleeve_length")
          : parseList("filter.sleeve_type"),
      ageGroup: parseList("filter.age_group"),
      sizeType: parseList("filter.size_type"),
      targetGender: parseList("filter.target_gender"),
      kurtiType: parseList("filter.kurti_type"),
      fitType: parseList("filter.fit_type"),
      occasion: parseList("filter.occasion"),
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
  const availableFacets = useMemo(() => {
    const sizeMap = new Map(); // size -> { name, count, availableCount }
    const fabricMap = new Map();
    const colorMap = new Map();
    const necklineMap = new Map();
    const sleeveTypeMap = new Map();
    const ageGroupMap = new Map();
    const sizeTypeMap = new Map();
    const targetGenderMap = new Map();
    const kurtiTypeMap = new Map();
    const fitTypeMap = new Map();
    const occasionMap = new Map();
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

      // Variant & Category Sizes
      const productSizes = extractKurtiSizes(p);
      productSizes.forEach(({ name, available }) => {
        const key = name;
        const prev = sizeMap.get(key) || {
          name: key,
          count: 0,
          availableCount: 0,
        };
        prev.count += 1;
        if (available) prev.availableCount += 1;
        sizeMap.set(key, prev);
      });

      const f = getKurtiFabric(p);
      if (f) fabricMap.set(f, (fabricMap.get(f) || 0) + 1);

      const c = getKurtiColor(p);
      if (c) colorMap.set(c, (colorMap.get(c) || 0) + 1);

      const nl = getKurtiNeckline(p);
      if (nl) necklineMap.set(nl, (necklineMap.get(nl) || 0) + 1);

      const slv = getKurtiSleeveType(p);
      if (slv) sleeveTypeMap.set(slv, (sleeveTypeMap.get(slv) || 0) + 1);

      const ag = getKurtiAgeGroup(p);
      if (ag) ageGroupMap.set(ag, (ageGroupMap.get(ag) || 0) + 1);

      const st = getKurtiSizeType(p);
      if (st) sizeTypeMap.set(st, (sizeTypeMap.get(st) || 0) + 1);

      const tg = getKurtiTargetGender(p);
      if (tg) targetGenderMap.set(tg, (targetGenderMap.get(tg) || 0) + 1);

      const kt = getKurtiType(p);
      if (kt) kurtiTypeMap.set(kt, (kurtiTypeMap.get(kt) || 0) + 1);

      const ft = getKurtiFitType(p);
      if (ft) fitTypeMap.set(ft, (fitTypeMap.get(ft) || 0) + 1);

      const o = getKurtiOccasion(p);
      if (o) occasionMap.set(o, (occasionMap.get(o) || 0) + 1);

      const pat = getKurtiPattern(p);
      if (pat) patternMap.set(pat, (patternMap.get(pat) || 0) + 1);
    });

    const toSortedList = (map) =>
      Array.from(map.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    // Sort sizes in standard fashion order (XS -> S -> M -> L -> XL -> 2XL -> 3XL -> 4XL)
    const sortedSizes = Array.from(sizeMap.values())
      .map(({ name, count, availableCount }) => ({
        name,
        label: name,
        count,
        available: availableCount > 0,
      }))
      .sort((a, b) => {
        const indexA = SIZE_ORDER.indexOf(a.name.toUpperCase());
        const indexB = SIZE_ORDER.indexOf(b.name.toUpperCase());
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.name.localeCompare(b.name);
      });

    return {
      size: sortedSizes,
      priceRange: {
        min: collectionPriceBounds.min,
        max: collectionPriceBounds.max,
        currentMin: activeFilters.priceMin ?? collectionPriceBounds.min,
        currentMax: activeFilters.priceMax ?? collectionPriceBounds.max,
      },
      availability: [
        { value: "in_stock", label: "In Stock", count: inStockCount },
        { value: "out_of_stock", label: "Out of Stock", count: outOfStockCount },
      ].filter(
        (item) => item.count > 0 || activeFilters.availability.includes(item.value)
      ),
      fabric: toSortedList(fabricMap),
      color: toSortedList(colorMap),
      neckline: toSortedList(necklineMap),
      sleeveType: toSortedList(sleeveTypeMap),
      ageGroup: toSortedList(ageGroupMap),
      sizeType: toSortedList(sizeTypeMap),
      targetGender: toSortedList(targetGenderMap),
      kurtiType: toSortedList(kurtiTypeMap),
      fitType: toSortedList(fitTypeMap),
      occasion: toSortedList(occasionMap),
      pattern: toSortedList(patternMap),
      newArrival: { count: newArrivalCount, active: activeFilters.newArrival },
      bestSeller: { count: bestSellerCount, active: activeFilters.bestSeller },
    };
  }, [products, collectionPriceBounds, activeFilters]);

  // 4. Compute Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Price Filter
      const price = Number(p.priceRange?.minVariantPrice?.amount || 0);
      if (activeFilters.priceMin !== null && price < activeFilters.priceMin) {
        return false;
      }
      if (activeFilters.priceMax !== null && price > activeFilters.priceMax) {
        return false;
      }

      // 2. Availability Filter
      const isAvailable = Boolean(p.availableForSale);
      if (activeFilters.availability.length > 0) {
        const matchesStock =
          (activeFilters.availability.includes("in_stock") && isAvailable) ||
          (activeFilters.availability.includes("out_of_stock") && !isAvailable);
        if (!matchesStock) return false;
      }

      // 3. Size Filter (Variant-based + Category attribute)
      if (activeFilters.size.length > 0) {
        const productSizes = extractKurtiSizes(p);
        const matchingSizes = productSizes.filter((s) =>
          activeFilters.size.some(
            (sel) => sel.toUpperCase() === s.name.toUpperCase()
          )
        );

        if (matchingSizes.length === 0) {
          return false;
        }

        // Check variant-level availability when "in_stock" is selected
        if (activeFilters.availability.includes("in_stock")) {
          const hasAvailableSelected = matchingSizes.some((s) => s.available);
          if (!hasAvailableSelected) return false;
        }
      }

      // 4. Fabric Filter
      if (activeFilters.fabric.length > 0) {
        const fabric = getKurtiFabric(p);
        if (
          !fabric ||
          !activeFilters.fabric.some(
            (f) => f.toLowerCase() === fabric.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 5. Color Filter
      if (activeFilters.color.length > 0) {
        const color = getKurtiColor(p);
        if (
          !color ||
          !activeFilters.color.some(
            (c) => c.toLowerCase() === color.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 6. Neckline Filter
      if (activeFilters.neckline.length > 0) {
        const neckline = getKurtiNeckline(p);
        if (
          !neckline ||
          !activeFilters.neckline.some(
            (n) => n.toLowerCase() === neckline.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 7. Sleeve Length / Type Filter
      if (activeFilters.sleeveType.length > 0) {
        const sleeve = getKurtiSleeveType(p);
        if (
          !sleeve ||
          !activeFilters.sleeveType.some(
            (s) => s.toLowerCase() === sleeve.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 8. Age Group Filter
      if (activeFilters.ageGroup.length > 0) {
        const ageGroup = getKurtiAgeGroup(p);
        if (
          !ageGroup ||
          !activeFilters.ageGroup.some(
            (a) => a.toLowerCase() === ageGroup.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 9. Size Type Filter
      if (activeFilters.sizeType.length > 0) {
        const sizeType = getKurtiSizeType(p);
        if (
          !sizeType ||
          !activeFilters.sizeType.some(
            (st) => st.toLowerCase() === sizeType.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 10. Target Gender Filter
      if (activeFilters.targetGender.length > 0) {
        const gender = getKurtiTargetGender(p);
        if (
          !gender ||
          !activeFilters.targetGender.some(
            (g) => g.toLowerCase() === gender.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 11. Kurti Type Filter
      if (activeFilters.kurtiType.length > 0) {
        const type = getKurtiType(p);
        if (
          !type ||
          !activeFilters.kurtiType.some(
            (t) => t.toLowerCase() === type.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 12. Fit Type Filter
      if (activeFilters.fitType.length > 0) {
        const fit = getKurtiFitType(p);
        if (
          !fit ||
          !activeFilters.fitType.some(
            (ft) => ft.toLowerCase() === fit.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 13. Occasion Filter
      if (activeFilters.occasion.length > 0) {
        const occ = getKurtiOccasion(p);
        if (
          !occ ||
          !activeFilters.occasion.some(
            (o) => matchesOccasion(o, occ)
          )
        ) {
          return false;
        }
      }

      // 14. Pattern Filter
      if (activeFilters.pattern.length > 0) {
        const pat = getKurtiPattern(p);
        if (
          !pat ||
          !activeFilters.pattern.some(
            (pt) => pt.toLowerCase() === pat.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // 15. New Arrival Filter
      if (activeFilters.newArrival && !isNewArrivalProduct(p)) {
        return false;
      }

      // 16. Best Seller Filter
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
        // Normalize sleeve_type / sleeve_length key
        const paramKey =
          group === "sleeve_length" || group === "sleeveType"
            ? "filter.sleeve_length"
            : `filter.${group}`;

        const currentVals = (
          params.get(paramKey) ||
          (paramKey === "filter.sleeve_length"
            ? params.get("filter.sleeve_type") || ""
            : "")
        )
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const exists = currentVals.some(
          (v) => v.toUpperCase() === String(value).toUpperCase()
        );
        let updated;
        if (exists) {
          updated = currentVals.filter(
            (v) => v.toUpperCase() !== String(value).toUpperCase()
          );
        } else {
          updated = [...currentVals, value];
        }

        if (updated.length > 0) {
          params.set(paramKey, updated.join(","));
          if (paramKey === "filter.sleeve_length") {
            params.delete("filter.sleeve_type");
          }
        } else {
          params.delete(paramKey);
          if (paramKey === "filter.sleeve_length") {
            params.delete("filter.sleeve_type");
          }
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

    // Size chips
    activeFilters.size.forEach((val) => {
      chips.push({
        id: `chip-size-${val}`,
        group: "size",
        value: val,
        label: `Size: ${val}`,
        onRemove: () => removeFilter("size", val),
      });
    });

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

    // Multi-select facet groups
    const multiGroups = [
      { key: "fabric", label: "Fabric", valKey: "fabric" },
      { key: "color", label: "Color", valKey: "color" },
      { key: "neckline", label: "Neckline", valKey: "neckline" },
      { key: "sleeve_length", label: "Sleeve", valKey: "sleeveType" },
      { key: "age_group", label: "Age Group", valKey: "ageGroup" },
      { key: "size_type", label: "Size Type", valKey: "sizeType" },
      { key: "target_gender", label: "Gender", valKey: "targetGender" },
      { key: "kurti_type", label: "Kurti Type", valKey: "kurtiType" },
      { key: "fit_type", label: "Fit", valKey: "fitType" },
      { key: "occasion", label: "Occasion", valKey: "occasion" },
      { key: "pattern", label: "Pattern", valKey: "pattern" },
    ];

    multiGroups.forEach(({ key, label, valKey }) => {
      activeFilters[valKey].forEach((val) => {
        chips.push({
          id: `chip-${key}-${val}`,
          group: key,
          value: val,
          label: `${label}: ${val}`,
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
    buildStorefrontFilters: () => buildKurtiStorefrontFilters(activeFilters),
  };
}

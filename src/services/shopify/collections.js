/**
 * Shopify Collection Service Layer
 * Supports standard Shopify collections, handle aliases (e.g. cotton-sarees -> premium-saree),
 * virtual category hubs (e.g. sarees, kurtis, new-arrivals), Storefront API cursor pagination, and sorting.
 */
import { shopifyFetch } from "./client.js";
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  GET_PRODUCTS_QUERY,
} from "./queries.js";
import * as BannerConfig from "../../config/banners.js";

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80";

function getCollectionFallbackImage(handle) {
  const map = BannerConfig.COLLECTION_FALLBACK_IMAGES || {};
  return map[handle] || map.default || DEFAULT_FALLBACK;
}

// Map frontend URL handles to existing Shopify collection handles if named differently
const HANDLE_ALIASES = {
  "cotton-sarees": "premium-saree",
};

// Virtual category collections powered by product type query when no dedicated collection exists
const VIRTUAL_COLLECTIONS = {
  sarees: {
    title: "All Sarees",
    description:
      "Explore our complete range of handcrafted pure silk, cotton, banarasi, and designer sarees woven by master artisans.",
    query: "product_type:saree OR product_type:Saree",
  },
  kurtis: {
    title: "All Kurtis",
    description:
      "Explore our contemporary and artisanal cotton and designer kurtis, tailored for effortless daily luxury and festive elegance.",
    query: "product_type:Kurti OR product_type:kurti",
  },
  "new-arrivals": {
    title: "New Arrivals",
    description:
      "The latest handpicked additions to the Harini luxury collection, fresh from traditional Indian handlooms.",
    query: "",
    defaultSort: "CREATED_AT",
  },
};

/**
 * Fetch all store collections.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getCollections(limit = 20) {
  const data = await shopifyFetch(GET_COLLECTIONS_QUERY, { first: limit });
  const rawCollections = data?.collections?.nodes || [];

  return rawCollections.map((col) => ({
    ...col,
    image: col.image || {
      url: getCollectionFallbackImage(col.handle),
      altText: col.title,
    },
  }));
}

/**
 * Map user-friendly sort option to Shopify Storefront API sort keys.
 * Supports Collection products (ProductCollectionSortKeys) and root products (ProductSortKeys).
 *
 * Supported options:
 * 1. Featured (COLLECTION_DEFAULT)
 * 2. Best Selling (BEST_SELLING)
 * 3. Newest (CREATED / CREATED_AT, reverse: true)
 * 4. Price: Low to High (PRICE, reverse: false)
 * 5. Price: High to Low (PRICE, reverse: true)
 * 6. Alphabetically: A to Z (TITLE, reverse: false)
 * 7. Alphabetically: Z to A (TITLE, reverse: true)
 *
 * @param {string} sortBy
 * @param {boolean} isVirtual
 * @returns {{ sortKey: string|null, reverse: boolean }}
 */
export function mapSortParameters(sortBy = "featured", isVirtual = false) {
  const normalized = String(sortBy || "").trim().toLowerCase();

  switch (normalized) {
    case "price-low":
    case "price":
    case "price_asc":
      return { sortKey: "PRICE", reverse: false };

    case "price-high":
    case "price_desc":
      return { sortKey: "PRICE", reverse: true };

    case "best-selling":
    case "best_selling":
    case "bestselling":
      return { sortKey: "BEST_SELLING", reverse: false };

    case "newest":
    case "created":
    case "created_at":
      return {
        sortKey: isVirtual ? "CREATED_AT" : "CREATED",
        reverse: true,
      };

    case "title-asc":
    case "title":
    case "title_asc":
      return { sortKey: "TITLE", reverse: false };

    case "title-desc":
    case "title_desc":
      return { sortKey: "TITLE", reverse: true };

    case "featured":
    case "collection_default":
    case "manual":
    default:
      return {
        sortKey: isVirtual ? null : "COLLECTION_DEFAULT",
        reverse: false,
      };
  }
}

/**
 * Fetch a collection by handle with cursor-based pagination, Shopify API sorting, and native Storefront filters.
 * Seamlessly resolves aliases and virtual category hubs (e.g. /collections/sarees, /collections/kurtis).
 *
 * @param {string} handle
 * @param {object} options
 * @param {number} [options.first=24]
 * @param {string|null} [options.after=null]
 * @param {string} [options.sortBy="featured"]
 * @param {Array|null} [options.filters=null]
 * @returns {Promise<object|null>}
 */
export async function getCollectionByHandle(
  handle,
  { first = 24, after = null, sortBy = "featured", filters = null } = {}
) {
  if (!handle) throw new Error("Collection handle is required.");

  const normalizedHandle = String(handle).trim().toLowerCase();

  // 1. Handle Virtual Category Collections (sarees, kurtis, new-arrivals)
  if (VIRTUAL_COLLECTIONS[normalizedHandle]) {
    const virtualDef = VIRTUAL_COLLECTIONS[normalizedHandle];
    const { sortKey, reverse } = mapSortParameters(sortBy, true);

    const variables = {
      first,
      after: after || null,
      query: virtualDef.query || null,
      sortKey: sortKey || (virtualDef.defaultSort ? virtualDef.defaultSort : null),
      reverse: Boolean(reverse),
    };

    const data = await shopifyFetch(GET_PRODUCTS_QUERY, variables);
    const edges = data?.products?.edges || [];

    const products = edges.map((edge) => ({
      ...edge.node,
      cursor: edge.cursor,
    }));

    return {
      id: `virtual-${normalizedHandle}`,
      title: virtualDef.title,
      handle: normalizedHandle,
      description: virtualDef.description,
      image: {
        url: getCollectionFallbackImage(normalizedHandle),
        altText: virtualDef.title,
      },
      products,
      filters: [],
      pageInfo: data?.products?.pageInfo || {
        hasNextPage: false,
        endCursor: null,
      },
    };
  }

  // 2. Standard Shopify Collection with alias resolution
  const resolvedHandle = HANDLE_ALIASES[normalizedHandle] || normalizedHandle;
  const { sortKey, reverse } = mapSortParameters(sortBy, false);

  const variables = {
    handle: resolvedHandle,
    first,
    after: after || null,
    sortKey: sortKey || null,
    reverse: Boolean(reverse),
    filters: Array.isArray(filters) && filters.length > 0 ? filters : null,
  };

  const data = await shopifyFetch(GET_COLLECTION_PRODUCTS_QUERY, variables);
  let collection = data?.collection;

  // Fallback if alias was not found but original exists
  if (!collection && resolvedHandle !== normalizedHandle) {
    const fallbackData = await shopifyFetch(GET_COLLECTION_PRODUCTS_QUERY, {
      ...variables,
      handle: normalizedHandle,
    });
    collection = fallbackData?.collection;
  }

  if (!collection) return null;

  const products =
    collection.products?.edges?.map((edge) => ({
      ...edge.node,
      cursor: edge.cursor,
    })) || [];

  return {
    ...collection,
    handle: normalizedHandle, // Preserve clean URL handle
    image: collection.image || {
      url: getCollectionFallbackImage(normalizedHandle),
      altText: collection.title,
    },
    products,
    filters: collection.products?.filters || [],
    pageInfo: collection.products?.pageInfo || {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

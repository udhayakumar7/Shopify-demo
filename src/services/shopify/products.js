/**
 * Shopify Product Service Layer
 */
import { shopifyFetch } from "./client.js";
import { GET_PRODUCTS_QUERY, GET_PRODUCT_DETAILS_QUERY } from "./queries.js";
import { getCollectionByHandle } from "./collections.js";

/**
 * Fetch products with cursor-based pagination and filtering.
 * @param {object} options
 * @param {number} options.first
 * @param {string|null} options.after
 * @param {string} options.query
 * @param {string|null} options.sortKey
 * @param {boolean} options.reverse
 * @returns {Promise<{ products: Array, pageInfo: object }>}
 */
export async function getProducts({
  first = 20,
  after = null,
  query = "",
  sortKey = null,
  reverse = false,
} = {}) {
  const variables = {
    first,
    after,
    query: query || null,
    sortKey: sortKey || null,
    reverse: Boolean(reverse),
  };

  const data = await shopifyFetch(GET_PRODUCTS_QUERY, variables);

  return {
    products: data.products.edges.map((edge) => ({
      ...edge.node,
      cursor: edge.cursor,
    })),
    pageInfo: data.products.pageInfo,
  };
}

/**
 * Fetch detailed product information by handle including variants and metafields.
 * @param {string} handle
 * @returns {Promise<object|null>}
 */
export async function getProductByHandle(handle) {
  if (!handle) throw new Error("Product handle is required.");

  const data = await shopifyFetch(GET_PRODUCT_DETAILS_QUERY, { handle });
  return data?.product || null;
}

/**
 * Fetch featured products for the homepage.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts(limit = 8) {
  const { products } = await getProducts({ first: limit });
  return products;
}

/**
 * Fetch related products for a given product.
 * Tries collection-based recommendations first, falling back to same productType or general products.
 * Guarantees current product ID is excluded.
 *
 * @param {object} product
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getRelatedProducts(product, limit = 4) {
  if (!product?.id) return [];

  try {
    // 1. Try finding a relevant collection from product's collections (excluding 'frontpage')
    const primaryCollection = product.collections?.nodes?.find(
      (col) => col.handle && col.handle !== "frontpage"
    );

    if (primaryCollection?.handle) {
      const colData = await getCollectionByHandle(primaryCollection.handle, {
        first: limit + 4,
      });
      const candidates = (colData?.products || []).filter(
        (p) => p.id !== product.id
      );
      if (candidates.length > 0) {
        return candidates.slice(0, limit);
      }
    }

    // 2. Fallback: Query by productType
    const productType = product.productType?.trim();
    if (productType) {
      const { products } = await getProducts({
        first: limit + 4,
        query: `product_type:${productType}`,
      });
      const candidates = (products || []).filter((p) => p.id !== product.id);
      if (candidates.length > 0) {
        return candidates.slice(0, limit);
      }
    }

    // 3. Fallback: General products from catalog
    const { products } = await getProducts({ first: limit + 4 });
    return (products || [])
      .filter((p) => p.id !== product.id)
      .slice(0, limit);
  } catch (err) {
    console.warn("Failed to load related products:", err);
    return [];
  }
}


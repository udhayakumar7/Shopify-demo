/**
 * Shopify Product Service Layer
 */
import { shopifyFetch } from "./client";
import { GET_PRODUCTS_QUERY, GET_PRODUCT_DETAILS_QUERY } from "./queries";

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

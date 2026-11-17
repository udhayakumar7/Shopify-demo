/**
 * Shopify Search Service Layer
 */
import { shopifyFetch } from "./client";
import { SEARCH_PRODUCTS_QUERY } from "./queries";

/**
 * Search products with query keyword.
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function searchProducts(query, limit = 20) {
  const trimmed = query?.trim();
  if (!trimmed) return [];

  const data = await shopifyFetch(SEARCH_PRODUCTS_QUERY, {
    query: trimmed,
    first: limit,
  });

  return data?.search?.nodes || [];
}

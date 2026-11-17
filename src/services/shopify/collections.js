/**
 * Shopify Collection Service Layer
 */
import { shopifyFetch } from "./client";
import { GET_COLLECTIONS_QUERY, GET_COLLECTION_PRODUCTS_QUERY } from "./queries";
import * as BannerConfig from "../../config/banners";

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80";

function getCollectionFallbackImage(handle) {
  const map = BannerConfig.COLLECTION_FALLBACK_IMAGES || {};
  return map[handle] || map.default || DEFAULT_FALLBACK;
}

/**
 * Fetch all store collections.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getCollections(limit = 20) {
  const data = await shopifyFetch(GET_COLLECTIONS_QUERY, { first: limit });
  const rawCollections = data?.collections?.nodes || [];

  // Enhance with fallback image if Shopify image is null
  return rawCollections.map((col) => ({
    ...col,
    image: col.image || {
      url: getCollectionFallbackImage(col.handle),
      altText: col.title,
    },
  }));
}

/**
 * Fetch a single collection by handle along with its paginated products.
 * @param {string} handle
 * @param {object} options
 * @returns {Promise<object|null>}
 */
export async function getCollectionByHandle(
  handle,
  { first = 24, after = null, sortKey = null, reverse = false } = {}
) {
  if (!handle) throw new Error("Collection handle is required.");

  const data = await shopifyFetch(GET_COLLECTION_PRODUCTS_QUERY, {
    handle,
    first,
    after,
    sortKey: sortKey || null,
    reverse: Boolean(reverse),
  });

  const collection = data?.collection;
  if (!collection) return null;

  const products = collection.products?.edges?.map((edge) => ({
    ...edge.node,
    cursor: edge.cursor,
  })) || [];

  return {
    ...collection,
    image: collection.image || {
      url: getCollectionFallbackImage(collection.handle),
      altText: collection.title,
    },
    products,
    pageInfo: collection.products?.pageInfo || { hasNextPage: false, endCursor: null },
  };
}

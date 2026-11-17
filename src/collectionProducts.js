/**
 * Backwards compatibility re-export.
 * Central service is maintained in src/services/shopify/collections.js
 */
import { getCollectionByHandle } from "./services/shopify/collections";

export async function getCollectionProducts(handle) {
  const data = await getCollectionByHandle(handle);
  if (!data) return null;
  return {
    ...data,
    products: {
      nodes: data.products || [],
    },
  };
}

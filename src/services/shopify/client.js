
/**
 * Centralized Shopify Storefront API GraphQL Client
 */

const env =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : (typeof globalThis !== "undefined" ? globalThis.process?.env : null) || {};

const STORE_DOMAIN = env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = env.VITE_SHOPIFY_API_VERSION || "2026-10";

if (!STORE_DOMAIN || !STOREFRONT_TOKEN) {
  console.warn(
    "[Shopify Client] Missing Shopify environment variables. Please check your .env file."
  );
}

const SHOPIFY_URL = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

/**
 * Execute Shopify Storefront API GraphQL query or mutation.
 */
export async function shopifyFetch(query, variables = {}) {
  try {
    const response = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
      const errorMessage =
        result.errors?.map((err) => err.message).join(", ") ||
        `Shopify API request failed with HTTP ${response.status}`;

      console.error("[Shopify GraphQL Error]:", errorMessage);
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    console.error("[Shopify Network Error]:", error);
    throw error;
  }
}

/**
 * Get Shopify store domain.
 */
export function getShopDomain() {
  return STORE_DOMAIN;
}

/**
 * Fetch all collections for homepage categories.
 */
export async function getCollections(first = 20) {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { first });

  return data.collections.edges.map(({ node }) => node);
}

/**
 * Fetch a single collection using its handle.
 */
export async function getCollectionByHandle(handle) {
  const query = `
    query GetCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              description
              availableForSale
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { handle });

  return data.collection;
}

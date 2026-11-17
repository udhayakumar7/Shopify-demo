/**
 * Centralized Shopify Storefront API GraphQL Client
 */

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || "2026-10";

if (!STORE_DOMAIN || !STOREFRONT_TOKEN) {
  console.warn(
    "[Shopify Client] Missing Shopify environment variables. Please check your .env file."
  );
}

const SHOPIFY_URL = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

/**
 * Execute a GraphQL query or mutation against Shopify Storefront API.
 * @param {string} query
 * @param {object} variables
 * @returns {Promise<any>}
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
      console.error("[Shopify GraphQL Error]:", errorMessage, { query, variables });
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    console.error("[Shopify Network Error]:", error);
    throw error;
  }
}

export function getShopDomain() {
  return STORE_DOMAIN;
}

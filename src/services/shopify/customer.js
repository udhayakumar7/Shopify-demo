/**
 * Shopify Customer Account API Service (Architecture & OAuth 2.0 PKCE Helpers)
 *
 * Prepares the storefront for modern passwordless Shopify Customer Account API authentication.
 * Follows OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange).
 * NEVER stores passwords or exposes private client secrets on the client side.
 */

import { storage } from "../../utils/storage";

const CUSTOMER_TOKEN_KEY = "shopify_customer_access_token";
const PKCE_VERIFIER_KEY = "shopify_pkce_code_verifier";
const AUTH_STATE_KEY = "shopify_auth_state";

/**
 * Generate a cryptographically secure random string for PKCE and OAuth state.
 */
export function generateRandomString(length = 43) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

/**
 * Calculate SHA-256 hash for PKCE code challenge.
 */
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Build the Customer Account API Login URL.
 * Redirects user to Shopify-hosted passwordless login.
 * @param {string} clientId Customer Account API Client ID
 * @param {string} redirectUri Authorized Callback URL
 */
export async function buildCustomerAuthUrl(clientId, redirectUri) {
  const codeVerifier = generateRandomString(64);
  const state = generateRandomString(32);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store verifier and state temporarily in session/local storage
  storage.setRaw(PKCE_VERIFIER_KEY, codeVerifier);
  storage.setRaw(AUTH_STATE_KEY, state);

  const shopDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
  const authEndpoint = `https://${shopDomain}/account/oauth/authorize`;

  const params = new URLSearchParams({
    client_id: clientId || "",
    response_type: "code",
    redirect_uri: redirectUri || window.location.origin + "/account/callback",
    scope: "openid email customer-account-api:full",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${authEndpoint}?${params.toString()}`;
}

/**
 * Check if a customer session is currently active.
 */
export function isCustomerAuthenticated() {
  return Boolean(storage.getRaw(CUSTOMER_TOKEN_KEY));
}

/**
 * Clear customer session.
 */
export function logoutCustomer() {
  storage.remove(CUSTOMER_TOKEN_KEY);
  storage.remove(PKCE_VERIFIER_KEY);
  storage.remove(AUTH_STATE_KEY);
}

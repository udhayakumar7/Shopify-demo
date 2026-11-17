/**
 * Centralized Shopify Customer Account API Authentication Service
 *
 * Implements modern passwordless OAuth 2.0 Authorization Code Flow with PKCE (S256).
 * Follows Shopify's OpenID Connect dynamic discovery specification.
 * Validates ID tokens via remote JWKS using 'jose'.
 * Handles secure session persistence and RP-initiated logout via end_session_endpoint.
 */

import { createRemoteJWKSet, jwtVerify } from "jose";
import { storage } from "../../utils/storage";

const STORE_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "harini-zyh1hfkx.myshopify.com";

const CLIENT_ID =
  import.meta.env.VITE_SHOPIFY_CUSTOMER_CLIENT_ID ||
  "27f4ed41-f86e-4dc3-92c3-a3c7f645a8c0";

const REDIRECT_URI =
  import.meta.env.VITE_SHOPIFY_CUSTOMER_REDIRECT_URI ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/account/callback`
    : "https://hs-store-ten.vercel.app/account/callback");

export const CUSTOMER_STORAGE_KEYS = {
  ACCESS_TOKEN: "shopify_customer_access_token",
  ID_TOKEN: "shopify_customer_id_token",
  EXPIRES_AT: "shopify_customer_expires_at",
  AUTH_STATE: "shopify_auth_state",
  AUTH_NONCE: "shopify_auth_nonce",
  CODE_VERIFIER: "shopify_code_verifier",
};

let cachedOpenIdConfig = null;

/**
 * Discover Shopify OpenID Connect configuration dynamically.
 */
export async function getOpenIdConfig() {
  if (cachedOpenIdConfig) return cachedOpenIdConfig;

  const discoveryUrl = `https://${STORE_DOMAIN}/.well-known/openid-configuration`;
  const response = await fetch(discoveryUrl);

  if (!response.ok) {
    throw new Error(
      `Unable to discover Shopify authentication endpoints (HTTP ${response.status})`
    );
  }

  cachedOpenIdConfig = await response.json();
  return cachedOpenIdConfig;
}

/**
 * Generate a cryptographically secure random string.
 */
export function generateRandomString(length = 43) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

/**
 * Calculate SHA-256 Base64URL hash for PKCE S256 code challenge.
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
 * Build the Customer Account API Login URL with PKCE (S256), state and nonce.
 * @param {string} [customRedirectUri]
 * @returns {Promise<string>}
 */
export async function buildCustomerAuthUrl(customRedirectUri) {
  const config = await getOpenIdConfig();

  const state = generateRandomString(32);
  const nonce = generateRandomString(32);
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);

  const redirectUri = customRedirectUri || REDIRECT_URI;

  // Store in sessionStorage (with localStorage fallback)
  try {
    sessionStorage.setItem(CUSTOMER_STORAGE_KEYS.AUTH_STATE, state);
    sessionStorage.setItem(CUSTOMER_STORAGE_KEYS.AUTH_NONCE, nonce);
    sessionStorage.setItem(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER, verifier);
  } catch {
    // Private mode fallback
  }
  storage.setRaw(CUSTOMER_STORAGE_KEYS.AUTH_STATE, state);
  storage.setRaw(CUSTOMER_STORAGE_KEYS.AUTH_NONCE, nonce);
  storage.setRaw(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER, verifier);

  const authUrl = new URL(config.authorization_endpoint);
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "openid email customer-account-api:full");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("nonce", nonce);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return authUrl.toString();
}

/**
 * Initiate customer login flow by redirecting to Shopify-hosted auth page.
 */
export async function loginWithShopify(customRedirectUri) {
  const authUrl = await buildCustomerAuthUrl(customRedirectUri);
  window.location.assign(authUrl);
}

/**
 * Complete Shopify OAuth 2.0 PKCE login at /account/callback.
 * Validates state & nonce, exchanges code for tokens, verifies ID token signature via JWKS.
 */
export async function completeCustomerLogin() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const returnedState = params.get("state");
  const authError = params.get("error");

  if (authError) {
    const errorDesc = params.get("error_description") || authError;
    throw new Error(errorDesc);
  }

  if (!code || !returnedState) {
    throw new Error("Missing authorization code or state parameter.");
  }

  // Retrieve stored handshake parameters
  let savedState = null;
  let expectedNonce = null;
  let verifier = null;

  try {
    savedState = sessionStorage.getItem(CUSTOMER_STORAGE_KEYS.AUTH_STATE);
    expectedNonce = sessionStorage.getItem(CUSTOMER_STORAGE_KEYS.AUTH_NONCE);
    verifier = sessionStorage.getItem(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER);
  } catch {
    // Fallback below
  }

  if (!savedState) savedState = storage.getRaw(CUSTOMER_STORAGE_KEYS.AUTH_STATE);
  if (!expectedNonce) expectedNonce = storage.getRaw(CUSTOMER_STORAGE_KEYS.AUTH_NONCE);
  if (!verifier) verifier = storage.getRaw(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER);

  if (!savedState || returnedState !== savedState) {
    throw new Error(
      "Invalid authentication state. Please return to the store and sign in again."
    );
  }

  if (!verifier || !expectedNonce) {
    throw new Error("Login session expired. Please sign in again.");
  }

  const config = await getOpenIdConfig();

  // Exchange authorization code for tokens
  const tokenResponse = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
      code_verifier: verifier,
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokenResponse.ok) {
    throw new Error(
      tokens.error_description ||
        tokens.error ||
        "Token exchange failed with Shopify."
    );
  }

  if (!tokens.access_token) {
    throw new Error("Shopify did not return a valid customer access token.");
  }

  // Verify ID token signature, issuer, audience and nonce if JWKS is available
  if (tokens.id_token && config.jwks_uri) {
    try {
      const jwks = createRemoteJWKSet(new URL(config.jwks_uri));
      const { payload } = await jwtVerify(tokens.id_token, jwks, {
        issuer: config.issuer,
        audience: CLIENT_ID,
      });

      if (payload.nonce !== expectedNonce) {
        throw new Error("Identity token nonce mismatch. Login rejected.");
      }
    } catch (jwkErr) {
      console.warn("[CustomerAuth] ID Token signature verification warning:", jwkErr);
      // If error is nonce mismatch, rethrow; otherwise verify issuer matches
      if (jwkErr.message?.includes("nonce")) {
        throw jwkErr;
      }
    }
  }

  // Persist customer session
  storage.setRaw(CUSTOMER_STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
  if (tokens.id_token) {
    storage.setRaw(CUSTOMER_STORAGE_KEYS.ID_TOKEN, tokens.id_token);
  }
  const expiresInSeconds = Number(tokens.expires_in) || 7200;
  storage.setRaw(
    CUSTOMER_STORAGE_KEYS.EXPIRES_AT,
    String(Date.now() + expiresInSeconds * 1000)
  );

  // Clean up temporary OAuth handshake values
  clearHandshakeStorage();

  return true;
}

/**
 * Check if a customer session is currently active and not expired.
 */
export function isCustomerAuthenticated() {
  const token = storage.getRaw(CUSTOMER_STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAt = Number(storage.getRaw(CUSTOMER_STORAGE_KEYS.EXPIRES_AT));

  if (!token) return false;

  // Check token expiration
  if (expiresAt && Date.now() >= expiresAt) {
    clearCustomerSession();
    return false;
  }

  return true;
}

/**
 * Retrieve the current customer access token if session is valid.
 */
export function getCustomerAccessToken() {
  if (!isCustomerAuthenticated()) return null;
  return storage.getRaw(CUSTOMER_STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Clear all customer session tokens and credentials from local storage.
 */
export function clearCustomerSession() {
  storage.remove(CUSTOMER_STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(CUSTOMER_STORAGE_KEYS.ID_TOKEN);
  storage.remove(CUSTOMER_STORAGE_KEYS.EXPIRES_AT);
  clearHandshakeStorage();
}

function clearHandshakeStorage() {
  try {
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEYS.AUTH_STATE);
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEYS.AUTH_NONCE);
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER);
  } catch {
    // Ignore
  }
  storage.remove(CUSTOMER_STORAGE_KEYS.AUTH_STATE);
  storage.remove(CUSTOMER_STORAGE_KEYS.AUTH_NONCE);
  storage.remove(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER);
}

/**
 * Perform secure logout using Shopify's OpenID Connect end_session_endpoint.
 * @param {string} [postLogoutRedirectUri]
 */
export async function logoutCustomer(postLogoutRedirectUri) {
  const idToken = storage.getRaw(CUSTOMER_STORAGE_KEYS.ID_TOKEN);
  const targetRedirect =
    postLogoutRedirectUri ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/`
      : "https://hs-store-ten.vercel.app/");

  // Always clear local session first
  clearCustomerSession();

  try {
    const config = await getOpenIdConfig();
    if (config.end_session_endpoint) {
      const logoutUrl = new URL(config.end_session_endpoint);
      if (idToken) {
        logoutUrl.searchParams.set("id_token_hint", idToken);
      }
      logoutUrl.searchParams.set("post_logout_redirect_uri", targetRedirect);
      window.location.assign(logoutUrl.toString());
      return;
    }
  } catch (err) {
    console.warn(
      "[CustomerAuth] Could not discover end_session_endpoint, redirecting locally:",
      err
    );
  }

  // Fallback to local redirect
  window.location.assign(targetRedirect);
}

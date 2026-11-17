/**
 * Centralized Shopify Customer Account API Authentication Service
 *
 * Implements modern passwordless OAuth 2.0 Authorization Code Flow with PKCE (S256).
 * Follows Shopify's OpenID Connect dynamic discovery specification.
 * Validates ID tokens via remote JWKS using 'jose' (strict signature, issuer, audience, and nonce checks).
 * Supports silent session renewal using Shopify's documented 'prompt=none' flow.
 * Handles secure session persistence and RP-initiated logout via end_session_endpoint.
 */

import { createRemoteJWKSet, jwtVerify } from "jose";
import { storage } from "../../utils/storage";

const STORE_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "harini-zyh1hfkx.myshopify.com";

const CLIENT_ID =
  import.meta.env.VITE_SHOPIFY_CUSTOMER_CLIENT_ID ||
  "27f4ed41-f86e-4dc3-92c3-a3c7f645a8c0";

const DEFAULT_REDIRECT_URI =
  import.meta.env.VITE_SHOPIFY_CUSTOMER_REDIRECT_URI ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/account/callback`
    : "https://hs-store-ten.vercel.app/account/callback");

export const CUSTOMER_STORAGE_KEYS = {
  // Session tokens (persisted in localStorage across tabs)
  ACCESS_TOKEN: "shopify_customer_access_token",
  ID_TOKEN: "shopify_customer_id_token",
  EXPIRES_AT: "shopify_customer_expires_at",

  // Ephemeral OAuth handshake parameters (strictly sessionStorage)
  AUTH_STATE: "shopify_auth_state",
  AUTH_NONCE: "shopify_auth_nonce",
  CODE_VERIFIER: "shopify_code_verifier",
  REDIRECT_URI: "shopify_auth_redirect_uri",
};

let cachedOpenIdConfig = null;

// Track in-flight exchange to prevent duplicate code exchange in React Strict Mode / concurrent calls
let inFlightExchangePromise = null;
let lastExchangedCode = null;

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
 * Clean up ephemeral OAuth handshake state from sessionStorage.
 */
function clearHandshakeStorage() {
  try {
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEYS.AUTH_STATE);
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEYS.AUTH_NONCE);
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER);
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEYS.REDIRECT_URI);
  } catch {
    // Ignore restricted environment errors
  }
}

/**
 * Clear customer session credentials from local storage.
 */
export function clearCustomerSession() {
  storage.remove(CUSTOMER_STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(CUSTOMER_STORAGE_KEYS.ID_TOKEN);
  storage.remove(CUSTOMER_STORAGE_KEYS.EXPIRES_AT);
  clearHandshakeStorage();
  inFlightExchangePromise = null;
  lastExchangedCode = null;
}

/**
 * Build the Customer Account API Authorization URL with PKCE (S256), state, nonce,
 * and exact redirect URI tracking.
 * @param {string} [customRedirectUri]
 * @param {object} [options]
 * @param {boolean} [options.promptNone=false] Set to true for silent session renewal
 * @returns {Promise<string>}
 */
export async function buildCustomerAuthUrl(customRedirectUri, options = {}) {
  const config = await getOpenIdConfig();

  const state = generateRandomString(32);
  const nonce = generateRandomString(32);
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);

  const redirectUri = customRedirectUri || DEFAULT_REDIRECT_URI;

  // Store handshake state strictly in sessionStorage
  try {
    sessionStorage.setItem(CUSTOMER_STORAGE_KEYS.AUTH_STATE, state);
    sessionStorage.setItem(CUSTOMER_STORAGE_KEYS.AUTH_NONCE, nonce);
    sessionStorage.setItem(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER, verifier);
    sessionStorage.setItem(CUSTOMER_STORAGE_KEYS.REDIRECT_URI, redirectUri);
  } catch (storageErr) {
    console.error("[CustomerAuth] Failed to write handshake to sessionStorage:", storageErr);
    throw new Error("Unable to initialize secure session storage in your browser.", {
      cause: storageErr,
    });
  }

  const authUrl = new URL(config.authorization_endpoint);
  authUrl.searchParams.set("client_id", CLIENT_ID);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "openid email customer-account-api:full");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("nonce", nonce);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  // Documented silent renewal flow for public clients
  if (options.promptNone) {
    authUrl.searchParams.set("prompt", "none");
  }

  return authUrl.toString();
}

/**
 * Initiate customer login flow by redirecting to Shopify-hosted auth page.
 * @param {string} [customRedirectUri]
 */
export async function loginWithShopify(customRedirectUri) {
  const authUrl = await buildCustomerAuthUrl(customRedirectUri);
  window.location.assign(authUrl);
}

/**
 * Initiate silent session renewal using Shopify's documented 'prompt=none' flow.
 * Must be executed via top-level browser navigation because Shopify disallows iframes.
 * @param {string} [customRedirectUri]
 */
export async function renewCustomerSessionSilent(customRedirectUri) {
  const authUrl = await buildCustomerAuthUrl(customRedirectUri, { promptNone: true });
  window.location.assign(authUrl);
}

/**
 * Complete Shopify OAuth 2.0 PKCE login at /account/callback.
 *
 * Guarantees:
 * 1. Exact same redirect URI used during authorization and token exchange.
 * 2. Mandatory ID-token signature verification with remote JWKS.
 * 3. Never swallows signature, issuer, audience, or expiration errors.
 * 4. Validates the nonce against the generated nonce.
 * 5. Prevents duplicate code exchanges (React Strict Mode & concurrent executions).
 * 6. Handles 'login_required' error from silent prompt=none renewals.
 */
export async function completeCustomerLogin() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const returnedState = params.get("state");
  const authError = params.get("error");
  const errorDescription = params.get("error_description");

  // Handle OAuth error parameter
  if (authError) {
    clearHandshakeStorage();
    if (authError === "login_required" || authError === "interaction_required") {
      clearCustomerSession();
      const err = new Error("Customer session expired. Please sign in again.");
      err.code = "LOGIN_REQUIRED";
      throw err;
    }
    throw new Error(errorDescription || authError);
  }

  if (!code || !returnedState) {
    throw new Error("Missing authorization code or state parameter.");
  }

  // De-duplicate if this exact code was already exchanged successfully
  if (code === lastExchangedCode && isCustomerAuthenticated()) {
    return true;
  }

  // If an exchange for this code is already in flight, await the existing promise
  if (inFlightExchangePromise) {
    return await inFlightExchangePromise;
  }

  inFlightExchangePromise = (async () => {
    try {
      let savedState = null;
      let expectedNonce = null;
      let verifier = null;
      let savedRedirectUri = null;

      try {
        savedState = sessionStorage.getItem(CUSTOMER_STORAGE_KEYS.AUTH_STATE);
        expectedNonce = sessionStorage.getItem(CUSTOMER_STORAGE_KEYS.AUTH_NONCE);
        verifier = sessionStorage.getItem(CUSTOMER_STORAGE_KEYS.CODE_VERIFIER);
        savedRedirectUri = sessionStorage.getItem(CUSTOMER_STORAGE_KEYS.REDIRECT_URI);
      } catch {
        // Fallback
      }

      if (!savedState || returnedState !== savedState) {
        throw new Error(
          "Invalid authentication state. Possible CSRF attempt or expired login session."
        );
      }

      if (!verifier) {
        throw new Error("Missing PKCE code verifier. Login session may have expired.");
      }

      if (!expectedNonce) {
        throw new Error("Missing OpenID nonce. Login session may have expired.");
      }

      // Use the EXACT redirect URI used when building the authorization request
      const redirectUriToUse = savedRedirectUri || DEFAULT_REDIRECT_URI;

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
          redirect_uri: redirectUriToUse,
          code,
          code_verifier: verifier,
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(
          tokens.error_description ||
            tokens.error ||
            `Token exchange failed with HTTP ${tokenResponse.status}`
        );
      }

      if (!tokens.access_token) {
        throw new Error("Shopify did not return a valid customer access token.");
      }

      // Mandatory ID-token signature verification whenever an ID token is returned.
      // Strict verification: NEVER swallow signature, issuer, audience, or expiration errors.
      if (tokens.id_token) {
        if (!config.jwks_uri) {
          throw new Error("Missing jwks_uri in Shopify OpenID configuration.");
        }

        const jwks = createRemoteJWKSet(new URL(config.jwks_uri));

        // Rejects login on ANY signature, issuer, audience, or expiration failure
        const { payload } = await jwtVerify(tokens.id_token, jwks, {
          issuer: config.issuer,
          audience: CLIENT_ID,
        });

        // Mandatory nonce verification
        if (payload.nonce !== expectedNonce) {
          throw new Error("Identity token nonce mismatch. Login rejected.");
        }
      }

      // Persist session tokens in localStorage
      storage.setRaw(CUSTOMER_STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
      if (tokens.id_token) {
        storage.setRaw(CUSTOMER_STORAGE_KEYS.ID_TOKEN, tokens.id_token);
      }
      const expiresInSeconds = Number(tokens.expires_in) || 7200;
      storage.setRaw(
        CUSTOMER_STORAGE_KEYS.EXPIRES_AT,
        String(Date.now() + expiresInSeconds * 1000)
      );

      lastExchangedCode = code;

      // Clean up ephemeral handshake data
      clearHandshakeStorage();

      return true;
    } finally {
      inFlightExchangePromise = null;
    }
  })();

  return await inFlightExchangePromise;
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
 * Retrieve the current ID token for RP-initiated logout.
 */
export function getCustomerIdToken() {
  return storage.getRaw(CUSTOMER_STORAGE_KEYS.ID_TOKEN);
}

/**
 * Perform secure logout using Shopify's OpenID Connect end_session_endpoint.
 * @param {string} [postLogoutRedirectUri]
 */
export async function logoutCustomer(postLogoutRedirectUri) {
  const idToken = getCustomerIdToken();
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

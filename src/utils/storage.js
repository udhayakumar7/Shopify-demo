/**
 * Safe local storage utility that handles JSON serialization and error handling.
 */

export const storage = {
  get(key, defaultValue = null) {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`[storage] Error reading key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[storage] Error setting key "${key}":`, e);
    }
  },

  remove(key) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] Error removing key "${key}":`, e);
    }
  },

  // Raw string methods for keys like shopify_cart_id that don't need JSON wrapping
  getRaw(key, defaultValue = "") {
    if (typeof window === "undefined") return defaultValue;
    try {
      return window.localStorage.getItem(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setRaw(key, value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[storage] Error setting raw key "${key}":`, e);
    }
  },
};

/**
 * Safe local storage utility that handles JSON serialization,
 * private browsing mode QuotaExceededError, and memory fallback.
 */

const memoryStorage = new Map();

function getStorage() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const testKey = "__harini_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch {
      // Storage restricted (e.g. Incognito or disabled cookies)
      return null;
    }
  }
  return null;
}

export const storage = {
  get(key, defaultValue = null) {
    const s = getStorage();
    if (s) {
      try {
        const item = s.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn(`[storage] Error reading key "${key}":`, e);
        return defaultValue;
      }
    }
    // Fallback to memory
    if (memoryStorage.has(key)) {
      try {
        return JSON.parse(memoryStorage.get(key));
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  },

  set(key, value) {
    const s = getStorage();
    const serialized = JSON.stringify(value);
    if (s) {
      try {
        s.setItem(key, serialized);
        return;
      } catch (e) {
        console.warn(`[storage] Error setting key "${key}":`, e);
      }
    }
    memoryStorage.set(key, serialized);
  },

  remove(key) {
    const s = getStorage();
    if (s) {
      try {
        s.removeItem(key);
      } catch (e) {
        console.warn(`[storage] Error removing key "${key}":`, e);
      }
    }
    memoryStorage.delete(key);
  },

  // Raw string methods for keys like shopify_cart_id
  getRaw(key, defaultValue = "") {
    const s = getStorage();
    if (s) {
      try {
        return s.getItem(key) || defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return memoryStorage.has(key) ? memoryStorage.get(key) : defaultValue;
  },

  setRaw(key, value) {
    const s = getStorage();
    if (s) {
      try {
        s.setItem(key, value);
        return;
      } catch (e) {
        console.warn(`[storage] Error setting raw key "${key}":`, e);
      }
    }
    memoryStorage.set(key, value);
  },
};

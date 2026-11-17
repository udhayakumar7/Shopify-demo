/**
 * Shopify Cart Service Layer with expired cart recovery and error handling.
 */
import { shopifyFetch } from "./client";
import { GET_CART_QUERY } from "./queries";
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
  APPLY_DISCOUNT_MUTATION,
} from "./mutations";
import { storage } from "../../utils/storage";

const CART_ID_KEY = "shopify_cart_id";

function handleUserErrors(errors) {
  if (errors && errors.length > 0) {
    const message = errors.map((e) => e.message).join(", ");
    throw new Error(message);
  }
}

/**
 * Get active cart ID from storage.
 */
export function getStoredCartId() {
  return storage.getRaw(CART_ID_KEY, "");
}

/**
 * Persist cart ID.
 */
export function setStoredCartId(cartId) {
  if (cartId) {
    storage.setRaw(CART_ID_KEY, cartId);
  } else {
    storage.remove(CART_ID_KEY);
  }
}

/**
 * Create a new Shopify cart.
 * @param {Array} lines
 * @returns {Promise<object>}
 */
export async function createCart(lines = []) {
  const data = await shopifyFetch(CREATE_CART_MUTATION, {
    lines: lines.length > 0 ? lines : null,
  });

  const result = data?.cartCreate;
  handleUserErrors(result?.userErrors);

  if (!result?.cart) {
    throw new Error("Unable to create cart in Shopify.");
  }

  setStoredCartId(result.cart.id);
  return result.cart;
}

/**
 * Retrieve existing cart. Auto-cleans expired or deleted cart IDs.
 * @returns {Promise<object|null>}
 */
export async function getCart() {
  const cartId = getStoredCartId();
  if (!cartId) return null;

  try {
    const data = await shopifyFetch(GET_CART_QUERY, { cartId });
    if (!data?.cart) {
      // Cart expired or not found on Shopify; clear local reference
      setStoredCartId(null);
      return null;
    }
    return data.cart;
  } catch (error) {
    console.warn("[Cart] Failed to retrieve cart, clearing expired ID:", error.message);
    setStoredCartId(null);
    return null;
  }
}

/**
 * Add items to cart. Auto-creates cart if none exists or if existing cart has expired.
 * @param {string} variantId
 * @param {number} quantity
 * @returns {Promise<object>}
 */
export async function addToCart(variantId, quantity = 1) {
  let cartId = getStoredCartId();

  if (!cartId) {
    return createCart([{ merchandiseId: variantId, quantity }]);
  }

  try {
    const data = await shopifyFetch(ADD_TO_CART_MUTATION, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });

    const result = data?.cartLinesAdd;
    handleUserErrors(result?.userErrors);

    if (!result?.cart) {
      throw new Error("Unable to add item to cart.");
    }

    return result.cart;
  } catch (error) {
    // If cart ID expired or invalid, recreate and add
    if (
      error.message?.includes("Cart does not exist") ||
      error.message?.includes("not found")
    ) {
      console.warn("[Cart] Cart expired, recreating cart...");
      return createCart([{ merchandiseId: variantId, quantity }]);
    }
    throw error;
  }
}

/**
 * Update line item quantity.
 * @param {string} lineId
 * @param {number} quantity
 * @returns {Promise<object>}
 */
export async function updateCartLine(lineId, quantity) {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No active cart found.");

  if (quantity <= 0) {
    return removeCartLine(lineId);
  }

  const data = await shopifyFetch(UPDATE_CART_LINES_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const result = data?.cartLinesUpdate;
  handleUserErrors(result?.userErrors);

  return result.cart;
}

/**
 * Remove line item from cart.
 * @param {string} lineId
 * @returns {Promise<object>}
 */
export async function removeCartLine(lineId) {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No active cart found.");

  const data = await shopifyFetch(REMOVE_CART_LINES_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const result = data?.cartLinesRemove;
  handleUserErrors(result?.userErrors);

  return result.cart;
}

/**
 * Apply discount code to cart.
 * @param {string} discountCode
 * @returns {Promise<object>}
 */
export async function applyDiscountCode(discountCode) {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No active cart found.");

  const data = await shopifyFetch(APPLY_DISCOUNT_MUTATION, {
    cartId,
    discountCodes: [discountCode],
  });

  const result = data?.cartDiscountCodesUpdate;
  handleUserErrors(result?.userErrors);

  return result.cart;
}

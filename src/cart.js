/**
 * Backwards compatibility re-export.
 * Central service is maintained in src/services/shopify/cart.js
 */
export {
  createCart,
  addToCart,
  getCart,
  updateCartLine,
  removeCartLine,
  applyDiscountCode,
  getStoredCartId,
  setStoredCartId,
} from "./services/shopify/cart";

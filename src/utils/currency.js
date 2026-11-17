/**
 * Currency and price formatting utilities.
 */

/**
 * Format a numeric amount to INR currency display (e.g. ₹4,999 or ₹4,999.00)
 * @param {number|string} amount
 * @param {string} currencyCode
 * @param {boolean} showDecimals
 * @returns {string}
 */
export function formatPrice(amount, currencyCode = "INR", showDecimals = false) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return "—";
  }

  const num = Number(amount);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: showDecimals ? 2 : 0,
      minimumFractionDigits: showDecimals ? 2 : 0,
    }).format(num);
  } catch {
    const symbol = currencyCode === "INR" ? "₹" : `${currencyCode} `;
    return `${symbol}${num.toLocaleString("en-IN")}`;
  }
}

/**
 * Calculate percentage discount between compareAtPrice and current price
 * @param {number|string} originalPrice
 * @param {number|string} discountedPrice
 * @returns {number|null}
 */
export function calculateDiscount(originalPrice, discountedPrice) {
  const orig = Number(originalPrice);
  const disc = Number(discountedPrice);

  if (!orig || !disc || orig <= disc) return null;

  return Math.round(((orig - disc) / orig) * 100);
}

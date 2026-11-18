/**
 * Navigation configuration for Harini Sarees Header, Dropdowns, Mobile Menu, and Footer.
 */

// Shopify's default "Home page" collection should not appear in the shop dropdowns
export const isHomepageCollection = (col) =>
  col.handle === "frontpage" ||
  /^home\s*-?\s*page$/i.test((col.title || "").trim());

/**
 * Categorize Saree collections reliably using Shopify Product Type, title, and handle.
 */
export function isSareeCollection(col) {
  if (!col || isHomepageCollection(col)) return false;

  // Check product types if products are loaded
  const hasSareeProduct = col.products?.nodes?.some((p) =>
    /saree/i.test(p.productType || "")
  );
  if (hasSareeProduct) return true;

  // Check title and handle
  const title = (col.title || "").toLowerCase();
  const handle = (col.handle || "").toLowerCase();
  return title.includes("saree") || handle.includes("saree");
}

/**
 * Categorize Kurti collections reliably using Shopify Product Type, title, and handle.
 */
export function isKurtiCollection(col) {
  if (!col || isHomepageCollection(col)) return false;

  // Check product types if products are loaded
  const hasKurtiProduct = col.products?.nodes?.some((p) =>
    /kurti/i.test(p.productType || "")
  );
  if (hasKurtiProduct) return true;

  // Check title and handle
  const title = (col.title || "").toLowerCase();
  const handle = (col.handle || "").toLowerCase();
  return title.includes("kurti") || handle.includes("kurti");
}

export const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Sarees", key: "sarees", hasDropdown: true },
  { name: "Kurtis", key: "kurtis", hasDropdown: true },
  { name: "New Arrivals", path: "/collections/sarees" },
  { name: "Best Sellers", path: "/collections/silk-sarees" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const MAIN_NAV = NAV_ITEMS;

export const FOOTER_LINKS = {
  shop: [
    { name: "Silk Sarees", path: "/collections/silk-sarees" },
    { name: "Cotton Sarees", path: "/collections/premium-saree" },
    { name: "Banarasi Sarees", path: "/collections/banarasi-sarees" },
    { name: "Designer Sarees", path: "/collections/designer-sarees" },
    { name: "Cotton Kurtis", path: "/collections/cotton-kurtis" },
    { name: "Designer Kurtis", path: "/collections/designer-kurtis" },
  ],
  customerCare: [
    { name: "My Account & Orders", path: "/account" },
    { name: "Track Your Order", path: "/account" },
    { name: "Shipping & Delivery Policy", path: "/policies/shipping" },
    { name: "Returns & Refund Policy", path: "/policies/refund" },
    { name: "Frequently Asked Questions", path: "/faq" },
    { name: "My Wishlist", path: "/wishlist" },
  ],
  about: [
    { name: "Our Story & Heritage", path: "/about" },
    { name: "Contact Customer Concierge", path: "/contact" },
    { name: "Privacy Policy", path: "/policies/privacy" },
    { name: "Terms of Service", path: "/policies/terms" },
    { name: "Refund & Exchange Policy", path: "/policies/refund" },
  ],
};

/**
 * Navigation links for Header, Mobile Menu, and Footer.
 */

export const MAIN_NAV = [
  { name: "Home", path: "/" },
  // { name: "All Sarees", path: "/products" },
  {
    name: "Shop by Category",
    isDropdown: true,
    path: "/products",
    featuredCategories: [
      { name: "Silk Sarees", handle: "silk-sarees" },
      { name: "All Collections", handle: "frontpage" },
    ],
  },
  { name: "Best Sellers", path: "/collections/silk-sarees" },
  { name: "Our Heritage", path: "/#heritage" },
];

export const FOOTER_LINKS = {
  shop: [
    { name: "All Sarees", path: "/products" },
    { name: "Silk Sarees", path: "/collections/silk-sarees" },
    { name: "Wedding Collection", path: "/products" },
    { name: "Festive Weaves", path: "/products" },
    { name: "New Arrivals", path: "/products" },
  ],
  customerCare: [
    { name: "Track Your Order", path: "/account" },
    { name: "Shipping & Delivery", path: "/#shipping" },
    { name: "Returns & Exchanges", path: "/#returns" },
    { name: "Saree Care Guide", path: "/#care" },
    { name: "FAQ", path: "/#faq" },
  ],
  about: [
    { name: "Our Story & Weavers", path: "/#heritage" },
    { name: "Silk Mark Certification", path: "/#certification" },
    { name: "Artisanal Craftsmanship", path: "/#craftsmanship" },
    { name: "Terms & Conditions", path: "/#terms" },
    { name: "Privacy Policy", path: "/#privacy" },
  ],
};

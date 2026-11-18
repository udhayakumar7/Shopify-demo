export const HERO_BANNERS = [
  {
    id: "hero-1",
    badge: "THE HERITAGE EDIT",
    title: "For Moments That Become Memories.",
    subtitle:
      "Timeless silk. Exquisite craftsmanship. An heirloom to treasure.",
    ctaText: "Explore the Collection",
    ctaLink: "/collections/silk-sarees",
    secondaryCtaText: "Discover All Sarees",
    secondaryCtaLink: "/products",
    desktopImage:
      "https://www.silkromance.com/cdn/shop/files/SR_Hero_Oct26_1_Desktop.webp?v=1791319263&width=1800",
    mobileImage:
      "https://www.silkromance.com/cdn/shop/files/SR_Hero_Oct26_1_Mobile.webp?v=1791319263&width=800",
    alt: "Luxury handcrafted silk saree with intricate gold zari",
  },
  {
    id: "hero-2",
    badge: "THE BRIDAL EDIT",
    title: "For Moments That Become Memories.",
    subtitle:
      "Celebrate forever in the beauty of handcrafted silk.",
    ctaText: "Explore Bridal Sarees",
    ctaLink: "/products",
    secondaryCtaText: "Our Collections",
    secondaryCtaLink: "/#heritage",
    desktopImage:
      "https://www.silkromance.com/cdn/shop/files/SR_Hero_Oct26_4_Desktop.webp?v=1791319263&width=1800",
    mobileImage:
      "https://www.silkromance.com/cdn/shop/files/SR_Hero_Oct26_4_Mobile.webp?v=1791319263&width=800",
    alt: "Elegant bridal silk saree with traditional gold detailing",
  },
];

export const PROMOTIONAL_BANNERS = {
  bridalEdit: {
    tag: "Heirloom Edition",
    title: "The Royal Bridal Sanctuary",
    description:
      "Celebrate sacred vows in pure mulberry silk enriched with authentic silver and gold dipped zari threads. Each piece is authenticated with the Silk Mark of India.",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    alt: "Intricate red and gold zari silk saree fabric closeup",
    ctaText: "Discover Bridal Weaves",
    ctaLink: "/collections/silk-sarees",
  },
  festiveDiscount: {
    tag: "Festive Splendour",
    title: "Complimentary Fall, Pico & Blouse Tassels",
    description:
      "Enjoy custom artisan finishing on every drape, delivered securely to your doorstep in luxury keepsake packaging.",
    ctaText: "Shop the Collection",
    ctaLink: "/products",
  },
};

/**
 * Fallback images for collections when Shopify returns image: null
 */
export const COLLECTION_FALLBACK_IMAGES = {
  "silk-sarees":
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  "cotton-sarees":
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
  "premium-saree":
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
  "banarasi-sarees":
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
  "designer-sarees":
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  sarees:
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  kurtis:
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
  "cotton-kurtis":
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
  "designer-kurtis":
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  "new-arrivals":
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  frontpage:
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
};

/**
 * Fallback image for products when image is missing or fails to load
 */
export const PRODUCT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80";

/**
 * Curated Instagram lookbook images
 */
export const INSTAGRAM_GALLERY = [
  {
    id: "insta-1",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    caption:
      "The majestic Royal Blue Kanjivaram in morning sunlight ✨ #HariniSarees",
    link: "https://instagram.com",
  },
  {
    id: "insta-2",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    caption: "Bridal glow with handcrafted gold zari pallu #PureSilkMark",
    link: "https://instagram.com",
  },
  {
    id: "insta-3",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    caption:
      "Weaver's touch: 240 hours of handloom dedication on traditional looms",
    link: "https://instagram.com",
  },
  {
    id: "insta-4",
    image:
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    caption:
      "Celebrations draped in timeless vermillion and antique gold #FestiveEdit",
    link: "https://instagram.com",
  },
];

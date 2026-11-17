/**
 * Site configuration and brand constants.
 * Centralized place for store information, dummy contact details, and policies.
 */

export const SITE_CONFIG = {
  name: "Harini Sarees",
  tagline: "Handcrafted Luxury Sarees & Silk Heritage",
  description: "Immerse yourself in authentic Indian heritage with pure Kanjivaram silks, festive Banarasi weaves, and artisanal handlooms woven with timeless elegance.",
  currency: {
    code: "INR",
    symbol: "₹",
  },
  contact: {
    address: {
      line1: "12, Heritage Street",
      line2: "Anna Nagar",
      city: "Madurai",
      state: "Tamil Nadu",
      postalCode: "625020",
      country: "India",
      formatted: "12, Heritage Street, Anna Nagar, Madurai, Tamil Nadu 625020, India.",
    },
    phone: "+91 90000 00000",
    phoneDisplay: "+91 90000 00000",
    email: "support@example.com",
    hours: "Mon - Sat: 10:00 AM – 7:30 PM IST",
  },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.me/919000000000",
  },
  announcement: {
    enabled: true,
    messages: [
      "✨ Handcrafted with Love: Free Insured Shipping Across India",
      "🌿 Certified Pure Silk Mark Guaranteed Handlooms",
      "🪡 Complimentary Fall & Pico Finish with Every Saree",
      "✈️ Worldwide Express Delivery Available",
    ],
  },
  freeShippingThreshold: 2999, // in INR
};

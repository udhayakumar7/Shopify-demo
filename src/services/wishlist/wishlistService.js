/**
 * Wishlist storage service for guest and customer sessions.
 */
import { storage } from "../../utils/storage";

const WISHLIST_KEY = "harini_wishlist_items";

export const wishlistService = {
  getItems() {
    return storage.get(WISHLIST_KEY, []);
  },

  addItem(product) {
    const items = this.getItems();
    if (!items.some((item) => item.id === product.id)) {
      const updated = [
        ...items,
        {
          id: product.id,
          title: product.title,
          handle: product.handle,
          featuredImage: product.featuredImage,
          priceRange: product.priceRange,
          compareAtPriceRange: product.compareAtPriceRange,
          availableForSale: product.availableForSale,
          productType: product.productType,
          addedAt: new Date().toISOString(),
        },
      ];
      storage.set(WISHLIST_KEY, updated);
      return updated;
    }
    return items;
  },

  removeItem(productId) {
    const items = this.getItems();
    const updated = items.filter((item) => item.id !== productId);
    storage.set(WISHLIST_KEY, updated);
    return updated;
  },

  isWishlisted(productId) {
    const items = this.getItems();
    return items.some((item) => item.id === productId);
  },

  toggle(product) {
    if (this.isWishlisted(product.id)) {
      return this.removeItem(product.id);
    }
    return this.addItem(product);
  },

  clear() {
    storage.remove(WISHLIST_KEY);
    return [];
  },
};

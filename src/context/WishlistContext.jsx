/**
 * Wishlist Context Provider
 * Manages wishlisted sarees with LocalStorage guest persistence and instant feedback.
 */
import { createContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { wishlistService } from "../services/wishlist/wishlistService";

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(wishlistService.getItems());
  }, []);

  const toggleWishlist = useCallback((product) => {
    if (!product || !product.id) return;
    const isCurrentlyWishlisted = wishlistService.isWishlisted(product.id);
    const updated = wishlistService.toggle(product);
    setItems(updated);

    if (isCurrentlyWishlisted) {
      toast("Removed from your wishlist", {
        icon: "🤍",
        style: {
          background: "#FFF8F3",
          color: "#521225",
          border: "1px solid #EADBCE",
        },
      });
    } else {
      toast.success("Saved to your wishlist ✨", {
        icon: "❤️",
        style: {
          background: "#521225",
          color: "#FFF8F3",
          border: "1px solid #C5A059",
        },
      });
    }
  }, []);

  const removeItem = useCallback((productId) => {
    const updated = wishlistService.removeItem(productId);
    setItems(updated);
  }, []);

  const isWishlisted = useCallback(
    (productId) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalItems: items.length,
        toggleWishlist,
        removeItem,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

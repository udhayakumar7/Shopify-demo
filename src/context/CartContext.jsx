/**
 * Cart Context Provider
 * Synchronizes cart state across the application, provides drawer controls,
 * optimistic updates, and seamless Shopify hosted checkout redirect.
 */
import { createContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartLine as apiUpdateCartLine,
  removeCartLine as apiRemoveCartLine,
} from "../services/shopify/cart";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingLineId, setUpdatingLineId] = useState(null);

  // Initialize cart on mount
  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error("[CartContext] Failed to load cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  /**
   * Add item to cart with feedback and auto-open drawer.
   */
  const addItem = useCallback(
    async (variantId, quantity = 1, options = { openDrawer: true }) => {
      try {
        setIsLoading(true);
        const updatedCart = await apiAddToCart(variantId, quantity);
        setCart(updatedCart);
        toast.success("Added to your shopping bag ✨", {
          style: {
            background: "#521225",
            color: "#FFF8F3",
            border: "1px solid #C5A059",
            borderRadius: "8px",
          },
        });
        if (options.openDrawer) {
          setIsOpen(true);
        }
        return updatedCart;
      } catch (err) {
        toast.error(err.message || "Failed to add item to bag");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Update line quantity.
   */
  const updateQuantity = useCallback(async (lineId, quantity) => {
    try {
      setUpdatingLineId(lineId);
      const updatedCart = await apiUpdateCartLine(lineId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      toast.error(err.message || "Could not update quantity");
      throw err;
    } finally {
      setUpdatingLineId(null);
    }
  }, []);

  /**
   * Remove item from cart.
   */
  const removeItem = useCallback(async (lineId) => {
    try {
      setUpdatingLineId(lineId);
      const updatedCart = await apiRemoveCartLine(lineId);
      setCart(updatedCart);
      toast.success("Item removed from bag", {
        style: {
          background: "#FFF8F3",
          color: "#521225",
          border: "1px solid #EADBCE",
        },
      });
      return updatedCart;
    } catch (err) {
      toast.error(err.message || "Could not remove item");
      throw err;
    } finally {
      setUpdatingLineId(null);
    }
  }, []);

  const totalQuantity = cart?.totalQuantity || 0;
  const subtotal = cart?.cost?.subtotalAmount?.amount || "0.0";
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || "INR";
  const checkoutUrl = cart?.checkoutUrl || "";
  const lines = cart?.lines?.edges?.map((edge) => edge.node) || [];

  return (
    <CartContext.Provider
      value={{
        cart,
        lines,
        isOpen,
        isLoading,
        updatingLineId,
        totalQuantity,
        subtotal,
        currencyCode,
        checkoutUrl,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

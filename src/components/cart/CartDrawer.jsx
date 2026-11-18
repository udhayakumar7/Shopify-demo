import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/currency";
import { SITE_CONFIG } from "../../config/site";
import CartItem from "./CartItem";
import Button from "../common/Button";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    totalQuantity,
    subtotal,
    currencyCode,
    checkoutUrl,
    updateQuantity,
    removeItem,
    updatingLineId,
    isLoading,
  } = useCart();

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) closeCart();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotalNumber = Number(subtotal) || 0;
  const threshold = SITE_CONFIG.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, threshold - subtotalNumber);
  const freeShippingProgress = Math.min(100, (subtotalNumber / threshold) * 100);

  const handleCheckout = () => {
    if (!checkoutUrl) return;
    window.location.href = checkoutUrl;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#380C19]/60 backdrop-blur-xs z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 max-w-full w-full sm:w-[440px] bg-[#FFF8F3] shadow-2xl z-50 flex flex-col border-l border-[#EADBCE]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#EADBCE] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#7B1E3A]" />
                <h2 className="text-lg font-serif font-semibold text-[#380C19]">
                  Shopping Bag
                </h2>
                <span className="text-xs font-medium bg-[#F4DCD6] text-[#7B1E3A] px-2 py-0.5 rounded-full">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-[#8A7B78] hover:text-[#7B1E3A] hover:bg-[#F4DCD6]/50 rounded-full transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Ribbon */}
            <div className="px-5 py-3 bg-[#F4DCD6]/60 border-b border-[#EADBCE] text-xs">
              {remainingForFreeShipping > 0 ? (
                <p className="text-[#521225]">
                  Add <strong className="text-[#7B1E3A]">{formatPrice(remainingForFreeShipping, currencyCode)}</strong> more to enjoy <span className="font-semibold text-[#7B1E3A]">FREE insured shipping!</span>
                </p>
              ) : (
                <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  Congratulations! You unlocked FREE Insured Shipping ✨
                </p>
              )}
              <div className="w-full h-1.5 bg-white/80 rounded-full mt-2 overflow-hidden border border-[#EADBCE]">
                <div
                  className="h-full bg-[#7B1E3A] transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EADBCE]">
              {lines.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 opacity-75" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#380C19] mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#8A7B78] max-w-xs mx-auto mb-6">
                    Explore our exquisite collection of handwoven silks and artisanal kurtis.
                  </p>
                  <Link to="/collections/sarees" onClick={closeCart} className="block w-full">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                lines.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isUpdating={updatingLineId === item.id}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    onItemClick={closeCart}
                  />
                ))
              )}
            </div>

            {/* Footer Summary */}
            {lines.length > 0 && (
              <div className="p-5 border-t border-[#EADBCE] bg-white space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#8A7B78]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#380C19] text-base">
                      {formatPrice(subtotal, currencyCode)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#8A7B78]">
                    <span>Shipping</span>
                    <span>{remainingForFreeShipping === 0 ? "FREE" : "Calculated at checkout"}</span>
                  </div>
                  <p className="text-[11px] text-[#8A7B78] pt-1">
                    Applicable GST and custom duty calculated at checkout.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 group shadow-md"
                    loading={isLoading}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A7B78] pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Safe & Encrypted Shopify Hosted Checkout</span>
                  </div>

                  <div className="text-center">
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="text-xs text-[#7B1E3A] hover:underline font-medium inline-block py-1"
                    >
                      View detailed bag page →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

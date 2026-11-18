import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/currency";
import { SITE_CONFIG } from "../config/site";
import { applyDiscountCode } from "../services/shopify/cart";
import CartItem from "../components/cart/CartItem";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Cart() {
  const {
    lines,
    totalQuantity,
    subtotal,
    currencyCode,
    checkoutUrl,
    updateQuantity,
    removeItem,
    updatingLineId,
    isLoading,
    refreshCart,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const subtotalNumber = Number(subtotal) || 0;
  const threshold = SITE_CONFIG.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, threshold - subtotalNumber);
  const freeShippingProgress = Math.min(100, (subtotalNumber / threshold) * 100);

  const handleCheckout = () => {
    if (!checkoutUrl) {
      toast.error("Checkout is currently preparing. Please refresh.");
      return;
    }
    window.location.href = checkoutUrl;
  };

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    try {
      setApplyingDiscount(true);
      await applyDiscountCode(discountCode.trim());
      await refreshCart();
      toast.success(`Discount code "${discountCode}" applied! ✨`);
      setDiscountCode("");
    } catch (err) {
      toast.error(err.message || "Invalid discount code");
    } finally {
      setApplyingDiscount(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Shopping Bag" }]} />

        <div className="border-b border-[#EADBCE] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19]">
              Your Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-[#8A7B78] mt-1">
              Review your selected handloom sarees and artisanal kurtis before proceeding to checkout.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#7B1E3A] bg-[#F4DCD6] px-3.5 py-1.5 rounded-full w-fit">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in bag
          </span>
        </div>

        {lines.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your Shopping Bag is Empty"
            description="You haven't added any handcrafted pieces yet. Explore our royal Kanjivaram sarees and artisanal kurtis to begin."
            actionText="Explore Collections"
            actionLink="/collections/sarees"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT: Items List (8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-[#EADBCE] shadow-2xs divide-y divide-[#EADBCE]">
              {/* Free Shipping Progress Ribbon */}
              <div className="pb-6 mb-2">
                <div className="p-4 bg-[#F4DCD6]/50 rounded-lg border border-[#EADBCE]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    {remainingForFreeShipping > 0 ? (
                      <span className="text-[#521225]">
                        Add <strong>{formatPrice(remainingForFreeShipping, currencyCode)}</strong> more to get <strong>FREE Insured Delivery</strong> across India!
                      </span>
                    ) : (
                      <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        You have unlocked FREE Insured Shipping ✨
                      </span>
                    )}
                    <span className="font-semibold text-[#7B1E3A]">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#EADBCE]">
                    <div
                      className="h-full bg-[#7B1E3A] rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#EADBCE]">
                {lines.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isUpdating={updatingLineId === item.id}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-6 flex justify-between items-center text-xs">
                <Link
                  to="/products"
                  className="text-[#7B1E3A] hover:underline font-semibold"
                >
                  ← Continue Shopping Handcrafted Sarees
                </Link>
                <span className="text-[#8A7B78]">
                  Complimentary fall & pico included
                </span>
              </div>
            </div>

            {/* RIGHT: Order Summary Card (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-xl border border-[#EADBCE] shadow-2xs space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-semibold text-[#380C19] pb-4 border-b border-[#EADBCE]">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#8A7B78]">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-medium text-[#380C19]">
                    {formatPrice(subtotal, currencyCode)}
                  </span>
                </div>

                <div className="flex justify-between text-[#8A7B78]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                    Insured Shipping
                  </span>
                  <span className="font-medium text-[#380C19]">
                    {remainingForFreeShipping === 0 ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#8A7B78] pt-1">
                  <span>Fall & Pico Finishing</span>
                  <span className="text-emerald-700 font-semibold">Complimentary</span>
                </div>

                <div className="border-t border-[#EADBCE] pt-3 flex justify-between items-baseline">
                  <span className="font-serif text-base font-semibold text-[#380C19]">
                    Estimated Total
                  </span>
                  <span className="text-2xl font-bold text-[#7B1E3A]">
                    {formatPrice(subtotal, currencyCode)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8A7B78]">
                  Applicable GST, duty and taxes calculated during final checkout step.
                </p>
              </div>

              {/* Discount Code Form */}
              <form onSubmit={handleApplyDiscount} className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#380C19] mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#C5A059]" /> Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 text-xs px-3 py-2 rounded border border-[#EADBCE] bg-[#FFF8F3] uppercase focus:outline-none focus:border-[#7B1E3A]"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    loading={applyingDiscount}
                  >
                    Apply
                  </Button>
                </div>
              </form>

              {/* Proceed to Checkout CTA */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 group shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Hosted Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A7B78] text-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>Secure 256-bit Encrypted Checkout Powered by Shopify</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

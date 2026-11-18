import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Heart, Plus, Minus, ArrowRight } from "lucide-react";
import { formatPrice, calculateDiscount } from "../../utils/currency";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { PRODUCT_FALLBACK_IMAGE } from "../../config/banners";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { extractKurtiSizes } from "../../hooks/useKurtiFilters.js";
import toast from "react-hot-toast";

/**
 * Reusable Quick View Modal for Sarees and Kurtis.
 * - Sarees: Direct quantity selection and Add to Bag without size selectors.
 * - Kurtis: Variant-based size selection (S, M, L, XL, etc.) with sold out detection.
 */
export default function QuickViewModal({ product, onClose }) {
  const { addItem, isLoading: isCartLoading } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Determine product category
  const isKurti = useMemo(() => {
    if (!product) return false;
    return (
      /kurti/i.test(product.productType || "") ||
      /kurti/i.test(product.title || "")
    );
  }, [product]);

  // Kurti Size Variants Extraction (Shopify variants and category size attributes)
  const kurtiSizes = useMemo(() => {
    if (!isKurti || !product) return [];
    return extractKurtiSizes(product);
  }, [isKurti, product]);

  // Selected size state
  const [selectedSize, setSelectedSize] = useState(() => {
    return kurtiSizes.find((s) => s.available)?.name || null;
  });

  if (!product) return null;

  // Saree default available variant
  const firstAvailableVariant =
    product.variants?.nodes?.find((v) => v.availableForSale) ||
    product.variants?.nodes?.[0];

  // Selected variant for pricing
  const currentVariant =
    isKurti && kurtiSizes.length > 0
      ? kurtiSizes.find((s) => s.name === selectedSize)?.variant || firstAvailableVariant
      : firstAvailableVariant;

  const price = currentVariant?.price || product.priceRange?.minVariantPrice;
  const compareAtPrice = currentVariant?.compareAtPrice || product.compareAtPriceRange?.minVariantPrice;
  const discount = calculateDiscount(compareAtPrice?.amount, price?.amount);
  const isAvailable = currentVariant ? currentVariant.availableForSale : product.availableForSale;

  const images =
    product.images?.nodes && product.images.nodes.length > 0
      ? product.images.nodes
      : [{ url: product.featuredImage?.url || PRODUCT_FALLBACK_IMAGE, altText: product.title }];

  const activeImage = images[selectedImageIndex]?.url || PRODUCT_FALLBACK_IMAGE;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    if (!isAvailable) return;

    if (isKurti && kurtiSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    let targetVariantId = firstAvailableVariant?.id;
    if (isKurti && kurtiSizes.length > 0) {
      const matched = kurtiSizes.find((s) => s.name === selectedSize);
      if (!matched?.available || !matched?.variantId) {
        toast.error("Selected size is out of stock");
        return;
      }
      targetVariantId = matched.variantId;
    }

    if (!targetVariantId) return;

    try {
      await addItem(targetVariantId, quantity, { openDrawer: true });
      onClose();
    } catch {
      // Toast handled by CartContext
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#380C19]/60 backdrop-blur-xs"
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#EADBCE] overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#8A7B78] hover:text-[#7B1E3A] hover:bg-[#F4DCD6]/50 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column: Image Gallery */}
              <div className="p-6 bg-[#FFF8F3]/50 flex flex-col justify-between">
                <div className="relative aspect-[3/4] w-full bg-[#F4DCD6]/30 rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={activeImage}
                    alt={product.title}
                    className="w-full h-full object-cover object-center"
                  />
                  {discount && isAvailable && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="sale" size="xs">
                        {discount}% OFF
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Thumbnails if multiple images exist */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-14 h-16 rounded overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          selectedImageIndex === idx
                            ? "border-[#7B1E3A] shadow-xs"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details & Actions */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  {product.productType && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A059] mb-1">
                      {product.productType}
                    </p>
                  )}

                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#380C19] mb-2 leading-snug">
                    {product.title}
                  </h2>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                    <span className="text-xl font-bold text-[#7B1E3A]">
                      {formatPrice(price?.amount, price?.currencyCode)}
                    </span>
                    {discount && (
                      <span className="text-sm text-[#8A7B78] line-through">
                        {formatPrice(
                          compareAtPrice?.amount,
                          compareAtPrice?.currencyCode
                        )}
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isAvailable
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {isAvailable ? "In Stock" : "Sold Out"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#8A7B78] line-clamp-3 mb-5 leading-relaxed">
                    {product.description ||
                      "Artisanal luxury handloom creation crafted with refined precision and timeless Indian elegance."}
                  </p>

                  {/* Size Selector for Kurtis Only */}
                  {isKurti && kurtiSizes.length > 0 && (
                    <div className="mb-5 pt-3 border-t border-[#EADBCE]/60">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-[#380C19]">
                          Select Size
                        </label>
                        {selectedSize && (
                          <span className="text-xs font-semibold text-[#7B1E3A]">
                            Size: {selectedSize}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {kurtiSizes.map((size) => {
                          const isSelected = selectedSize === size.name;
                          return (
                            <button
                              key={size.name}
                              type="button"
                              onClick={() => setSelectedSize(size.name)}
                              disabled={!size.available}
                              className={`min-w-9 h-9 px-2.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#7B1E3A] text-white border border-[#7B1E3A] shadow-xs"
                                  : size.available
                                  ? "bg-white text-[#380C19] border border-[#EADBCE] hover:border-[#7B1E3A]"
                                  : "bg-stone-100 text-stone-400 border border-stone-200 line-through cursor-not-allowed opacity-50"
                              }`}
                            >
                              {size.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Stepper */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-[#380C19] mb-2">
                      Quantity
                    </label>
                    <div className="inline-flex items-center border border-[#EADBCE] rounded-md bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-2 text-[#521225] hover:bg-[#F4DCD6]/50 disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-semibold text-[#380C19]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-2 text-[#521225] hover:bg-[#F4DCD6]/50 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-[#EADBCE]">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!isAvailable || (isKurti && kurtiSizes.length > 0 && !selectedSize)}
                      loading={isCartLoading}
                      variant="primary"
                      className="flex-1"
                      icon={ShoppingBag}
                    >
                      {isAvailable ? "Add to Bag" : "Sold Out"}
                    </Button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-3 rounded-md border border-[#EADBCE] transition-colors cursor-pointer ${
                        wishlisted
                          ? "bg-[#7B1E3A] text-white border-[#7B1E3A]"
                          : "hover:bg-[#F4DCD6]/50 text-[#7B1E3A]"
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <Link
                    to={`/products/${product.handle}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-1.5 w-full text-center text-xs font-semibold text-[#7B1E3A] hover:text-[#521225] transition-colors pt-1"
                  >
                    <span>View Complete Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

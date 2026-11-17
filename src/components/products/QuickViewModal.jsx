import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Heart, Plus, Minus } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { PRODUCT_FALLBACK_IMAGE } from "../../config/banners";
import Button from "../common/Button";

export default function QuickViewModal({ product, onClose }) {
  const { addItem, isLoading: isCartLoading } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants?.nodes?.find((v) => v.availableForSale)?.id ||
      product?.variants?.nodes?.[0]?.id ||
      ""
  );

  if (!product) return null;

  const variants = product.variants?.nodes || [];
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const isAvailable = selectedVariant ? selectedVariant.availableForSale : product.availableForSale;

  const imageUrl =
    product.featuredImage?.url ||
    product.images?.nodes?.[0]?.url ||
    PRODUCT_FALLBACK_IMAGE;

  const price = selectedVariant?.price || product.priceRange?.minVariantPrice;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    if (!selectedVariantId || !isAvailable) return;
    await addItem(selectedVariantId, quantity, { openDrawer: true });
    onClose();
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#EADBCE] overflow-hidden z-10"
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
              {/* Image Column */}
              <div className="relative aspect-[3/4] bg-[#F4DCD6]/30 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Product Info Column */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  {product.productType && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A059] mb-1">
                      {product.productType}
                    </p>
                  )}
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#380C19] mb-2">
                    {product.title}
                  </h2>

                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-xl font-bold text-[#7B1E3A]">
                      {formatPrice(price?.amount, price?.currencyCode)}
                    </span>
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

                  <p className="text-xs sm:text-sm text-[#8A7B78] line-clamp-3 mb-6 leading-relaxed">
                    {product.description ||
                      "Handcrafted by master artisans with pure silk threads, gold zari borders, and timeless Indian heritage."}
                  </p>

                  {/* Variant Selection if multiple */}
                  {variants.length > 1 && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-[#380C19] mb-2">
                        Select Variant
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariantId(v.id)}
                            disabled={!v.availableForSale}
                            className={`px-3 py-1.5 text-xs rounded border transition-all cursor-pointer ${
                              selectedVariantId === v.id
                                ? "border-[#7B1E3A] bg-[#7B1E3A] text-white font-medium"
                                : "border-[#EADBCE] text-[#380C19] hover:border-[#7B1E3A]"
                            } disabled:opacity-40 disabled:line-through`}
                          >
                            {v.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Stepper */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-[#380C19] mb-2">
                      Quantity
                    </label>
                    <div className="inline-flex items-center border border-[#EADBCE] rounded bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-2 text-[#521225] hover:bg-[#F4DCD6]/50 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-medium text-[#380C19]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-2 text-[#521225] hover:bg-[#F4DCD6]/50"
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
                      disabled={!isAvailable || !selectedVariantId}
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
                    className="block text-center text-xs font-medium text-[#7B1E3A] hover:underline"
                  >
                    View Complete Saree Details & Metafields →
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

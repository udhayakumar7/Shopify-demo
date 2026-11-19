import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Loader2 } from "lucide-react";
import { formatPrice, calculateDiscount } from "../../utils/currency";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { PRODUCT_FALLBACK_IMAGE } from "../../config/banners";
import Badge from "../common/Badge";
import toast from "react-hot-toast";

/**
 * Reusable Luxury Product Card for Sarees and Kurtis.
 * - Aspect ratio: 3:4 with subtle desktop hover zoom.
 * - Reveals second drape/detail image on hover if available.
 * - Saree: Direct Add to Bag with default available variant (no size selector).
 * - Kurti: Variant-based size selection (S, M, L, XL, etc.) with sold-out detection.
 */
export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  // Determine product category
  const isKurti = useMemo(() => {
    if (!product) return false;
    return (
      /kurti/i.test(product.productType || "") ||
      /kurti/i.test(product.title || "")
    );
  }, [product]);

  // Kurti Size Variants Extraction (strictly from Shopify variants)
  const kurtiSizes = useMemo(() => {
    if (!product || !isKurti) return [];

    const sizeOption = product.options?.find((o) => /size/i.test(o.name));
    const sizeValues = sizeOption?.values || [];

    if (sizeValues.length > 0) {
      return sizeValues.map((sizeName) => {
        const matchingVariant = product.variants?.nodes?.find(
          (v) =>
            v.selectedOptions?.some(
              (so) =>
                /size/i.test(so.name) &&
                so.value.trim().toLowerCase() === sizeName.trim().toLowerCase()
            ) ||
            (v.title &&
              v.title.trim().toLowerCase() === sizeName.trim().toLowerCase())
        );

        return {
          name: sizeName,
          available: Boolean(matchingVariant?.availableForSale),
          variantId: matchingVariant?.id || null,
        };
      });
    }

    // Check if variants represent sizes directly (e.g. S, M, L)
    const nonDefaultVariants = (product.variants?.nodes || []).filter(
      (v) => v.title && v.title !== "Default Title"
    );

    if (nonDefaultVariants.length > 0) {
      return nonDefaultVariants.map((v) => ({
        name: v.title,
        available: Boolean(v.availableForSale),
        variantId: v.id,
      }));
    }

    return [];
  }, [product, isKurti]);

  if (!product) return null;

  // Pricing & Availability
  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const discount = calculateDiscount(compareAtPrice?.amount, price?.amount);
  const isAvailable = product.availableForSale;

  // Badges: New Arrival & Best Seller
  const tags = product.tags || [];
  const metafields = product.metafields || [];

  const isNewArrival =
    tags.some((t) => /new[-_ ]?arrival|^new$/i.test(t)) ||
    metafields.some(
      (m) =>
        (m?.key === "new_arrival" || m?.key === "is_new_arrival") &&
        String(m?.value).toLowerCase() === "true"
    ) ||
    metafields.some(
      (m) => m?.key === "badge" && /new/i.test(m?.value || "")
    );

  const isBestSeller =
    tags.some((t) => /best[-_ ]?seller|^bestseller$/i.test(t)) ||
    metafields.some(
      (m) =>
        (m?.key === "best_seller" || m?.key === "is_best_seller") &&
        String(m?.value).toLowerCase() === "true"
    ) ||
    metafields.some(
      (m) => m?.key === "badge" && /best/i.test(m?.value || "")
    );

  // Saree default available variant
  const firstAvailableVariant =
    product.variants?.nodes?.find((v) => v.availableForSale) ||
    product.variants?.nodes?.[0];

  // Images
  const imageUrl =
    product.featuredImage?.url ||
    product.images?.nodes?.[0]?.url ||
    PRODUCT_FALLBACK_IMAGE;

  // Reveal second image on hover if available
  const hoverImageUrl =
    product.images?.nodes?.find((img) => img.url !== imageUrl)?.url || null;

  const altText =
    product.featuredImage?.altText || product.title || "Handcrafted Product";
  const wishlisted = isWishlisted(product.id);
  const href = `/products/${product.handle}`;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Add to Cart handler
  const handleAddToCart = async (e) => {
    stop(e);

    if (!isAvailable) return;

    // Kurti size validation
    if (isKurti && kurtiSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    let targetVariantId = firstAvailableVariant?.id;
    if (isKurti && kurtiSizes.length > 0) {
      const matched = kurtiSizes.find((s) => s.name === selectedSize);
      if (!matched || !matched.available || !matched.variantId) {
        toast.error("Selected size is currently out of stock");
        return;
      }
      targetVariantId = matched.variantId;
    }

    if (!targetVariantId) return;

    try {
      setIsAdding(true);
      await addItem(targetVariantId, 1, { openDrawer: true });
    } catch {
      // toast is handled in CartContext
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = (e) => {
    stop(e);
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    stop(e);
    if (onQuickView) onQuickView(product);
  };

  const handleSizeClick = (e, size) => {
    stop(e);
    if (!size.available) return;
    setSelectedSize((prev) => (prev === size.name ? null : size.name));
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-lg border border-[#EADBCE]/60 hover:border-[#C5A059]/60 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* 3:4 Aspect Ratio Image Frame */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F4DCD6]/30">
        <Link
          to={href}
          aria-label={product.title}
          className="absolute inset-0 block focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#C5A059]"
        >
          <img
            src={imageUrl}
            alt={altText}
            loading="lazy"
            className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
              !isAvailable ? "grayscale-[35%] opacity-80" : ""
            }`}
          />
          {hoverImageUrl && (
            <img
              src={hoverImageUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges (Top-Left) */}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5 items-start">
          {isBestSeller && (
            <Badge variant="gold" size="xs">
              Best Seller
            </Badge>
          )}
          {isNewArrival && (
            <Badge variant="goldOutline" size="xs">
              New Arrival
            </Badge>
          )}
          {discount && isAvailable && (
            <Badge variant="sale" size="xs">
              {discount}% OFF
            </Badge>
          )}
          {!isAvailable && (
            <Badge variant="soldOut" size="xs">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2.5 top-2.5 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full backdrop-blur transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059] ${
            wishlisted
              ? "bg-[#7B1E3A] text-white shadow-sm"
              : "bg-white/90 text-[#380C19] hover:bg-white hover:text-[#7B1E3A] shadow-2xs"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Desktop Quick Actions Overlay (Slides up on card hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden items-stretch gap-2 transition duration-300 sm:flex sm:translate-y-[140%] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded bg-white/95 px-2.5 py-2 text-xs font-medium text-[#380C19] backdrop-blur transition-colors hover:bg-white hover:text-[#7B1E3A] shadow-sm"
            >
              <Eye className="h-3.5 w-3.5 text-[#7B1E3A]" />
              <span>Quick view</span>
            </button>
          )}

          {isAvailable && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded bg-[#7B1E3A] px-2.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#63172E] disabled:opacity-60 shadow-sm"
            >
              {isAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5" />
              )}
              <span>Add to bag</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Information Container (Order: Title, Price, Discount, Sizes) */}
      <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-4">
        <div>
          {/* 1. Title */}
          <Link to={href} className="block group-hover:text-[#7B1E3A] transition-colors">
            <h3 className="line-clamp-2 font-serif text-sm sm:text-base leading-snug text-[#380C19] font-medium">
              {product.title}
            </h3>
          </Link>

          {/* 2 & 3. Price & Compare-at Price & Discount */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-semibold text-[#7B1E3A]">
              {formatPrice(price?.amount, price?.currencyCode)}
            </span>
            {discount && (
              <span className="text-xs text-[#8A7B78] line-through">
                {formatPrice(
                  compareAtPrice?.amount,
                  compareAtPrice?.currencyCode
                )}
              </span>
            )}
            {discount && (
              <span className="text-[11px] font-medium text-[#C5A059]">
                ({discount}% OFF)
              </span>
            )}
          </div>
        </div>

        {/* 4. Kurti Size Selector (Kurtis Only) */}
        {isKurti && kurtiSizes.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-[#EADBCE]/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A7B78]">
                Select Size:
              </span>
              {selectedSize && (
                <span className="text-[10px] font-semibold text-[#7B1E3A]">
                  {selectedSize}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {kurtiSizes.map((size) => {
                const isSelected = selectedSize === size.name;
                return (
                  <button
                    key={size.name}
                    type="button"
                    onClick={(e) => handleSizeClick(e, size)}
                    disabled={!size.available}
                    title={size.available ? `Select size ${size.name}` : `Size ${size.name} Sold Out`}
                    className={`min-w-6 h-6 px-1.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#7B1E3A] text-white border border-[#7B1E3A]"
                        : size.available
                        ? "bg-[#FFF8F3] text-[#380C19] border border-[#EADBCE] hover:border-[#7B1E3A]"
                        : "bg-stone-100 text-stone-400 border border-stone-200 line-through cursor-not-allowed opacity-60"
                    }`}
                  >
                    {size.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Quick Add Button (visible on touch devices) */}
        {isAvailable && (
          <div className="mt-3 pt-2 sm:hidden border-t border-[#EADBCE]/50">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#7B1E3A] text-white text-xs font-medium hover:bg-[#63172E] transition-colors disabled:opacity-60"
            >
              {isAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5" />
              )}
              <span>{isKurti && kurtiSizes.length > 0 && !selectedSize ? "Select Size" : "Add to Bag"}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

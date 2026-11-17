import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Loader2 } from "lucide-react";
import { formatPrice, calculateDiscount } from "../../utils/currency";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { PRODUCT_FALLBACK_IMAGE } from "../../config/banners";
import Badge from "../common/Badge";

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const discount = calculateDiscount(compareAtPrice?.amount, price?.amount);
  const isAvailable = product.availableForSale;

  const firstAvailableVariant =
    product.variants?.nodes?.find((v) => v.availableForSale) ||
    product.variants?.nodes?.[0];

  const imageUrl =
    product.featuredImage?.url ||
    product.images?.nodes?.[0]?.url ||
    PRODUCT_FALLBACK_IMAGE;

  // Second image (e.g. drape / pallu shot) revealed on hover
  const hoverImageUrl =
    product.images?.nodes?.find((img) => img.url !== imageUrl)?.url || null;

  const altText =
    product.featuredImage?.altText || product.title || "Handcrafted Saree";
  const wishlisted = isWishlisted(product.id);
  const href = `/products/${product.handle}`;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleQuickAdd = async (e) => {
    stop(e);
    if (!firstAvailableVariant?.id || !isAvailable) return;
    try {
      setIsAdding(true);
      await addItem(firstAvailableVariant.id, 1, { openDrawer: true });
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

  return (
    <article className="group relative flex flex-col">
      {/* Image frame */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#F4DCD6]/30 shadow-[0_1px_2px_rgba(56,12,25,0.06),0_14px_30px_-18px_rgba(56,12,25,0.35)] transition-shadow duration-500 group-hover:shadow-[0_2px_4px_rgba(56,12,25,0.08),0_30px_50px_-22px_rgba(56,12,25,0.45)]">
        <Link
          to={href}
          aria-label={product.title}
          className="absolute inset-0 block focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#C5A059]"
        >
          <img
            src={imageUrl}
            alt={altText}
            loading="lazy"
            className={`h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] ${!isAvailable ? "grayscale-[40%] opacity-80" : ""
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

        {/* Gold inner frame on hover */}
        <div className="pointer-events-none absolute inset-3 rounded-[3px] border border-[#C5A059]/0 transition-colors duration-500 group-hover:border-[#C5A059]/80" />

        {/* Bottom fade so action bar stays legible */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-t from-[#380C19]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block" />

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
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

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059] ${wishlisted
              ? "bg-[#7B1E3A] text-white"
              : "bg-white/90 text-[#380C19] hover:bg-white hover:text-[#7B1E3A]"
            }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Desktop action bar: slides up on hover / keyboard focus */}
        <div className="absolute inset-x-4 bottom-4 z-10 hidden items-stretch gap-2 transition duration-300 sm:flex sm:translate-y-[140%] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 motion-reduce:transition-none">
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[3px] bg-white/95 px-3 py-2.5 text-xs font-medium text-[#380C19] backdrop-blur transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059]"
            >
              <Eye className="h-3.5 w-3.5 text-[#7B1E3A]" />
              Quick view
            </button>
          )}
          {isAvailable && (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[3px] bg-[#7B1E3A] px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#63172E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059] disabled:opacity-60"
            >
              {isAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5" />
              )}
              Add to bag
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 items-start justify-between gap-3 px-1 pt-4">
        <div className="min-w-0">
          {product.productType && (
            <p className="mb-1 text-xs font-medium text-[#C5A059]">
              {product.productType}
            </p>
          )}
          <Link to={href}>
            <h3 className="line-clamp-2 font-serif text-base leading-snug text-[#380C19] transition-colors hover:text-[#7B1E3A]">
              {product.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-[15px] font-semibold text-[#7B1E3A]">
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
          </div>
        </div>

        {/* Mobile add to bag (no hover on touch) */}
        {isAvailable && (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            aria-label="Add to cart"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#7B1E3A] text-white transition-colors hover:bg-[#63172E] disabled:opacity-60 sm:hidden"
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </article>
  );
}
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { isBestSellerProduct } from "../../hooks/useSareeFilters";
import { ProductGridSkeleton } from "../common/Skeleton";
import ProductCard from "../products/ProductCard";
import QuickViewModal from "../products/QuickViewModal";
import Button from "../common/Button";
import { TrendingUp, ArrowRight } from "lucide-react";

function filterBestSellers(products) {
  if (!products || products.length === 0) return [];
  const tagged = products.filter(isBestSellerProduct);
  if (tagged.length > 0) return tagged.slice(0, 8);
  // Graceful fallback to first catalog products if none explicitly marked
  return products.slice(0, 8);
}

/**
 * Best Sellers Homepage Section
 * Features center-aligned heading in Fraunces serif with "Trending" pill badge.
 * Powered by live Shopify Storefront API metafields (custom.best_seller).
 */
export default function BestSellers() {
  const { products, loading, error } = useProducts({ first: 20 });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const bestSellerProducts = useMemo(
    () => filterBestSellers(products),
    [products]
  );

  return (
    <section className="w-full border-t border-[#EADBCE] bg-gradient-to-b from-white to-[#FFFDF9] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,4rem)]">
        {/* Center-aligned Header */}
        <div className="mb-10 sm:mb-12 flex flex-col items-center text-center">
          {/* Trending Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#FFF8F3] text-[#7B1E3A] border border-[#EADBCE] shadow-2xs mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-[#7B1E3A]" />
            <span>Trending</span>
          </div>

          {/* Heading with Fraunces font */}
          <h2
            className="font-head text-3xl sm:text-4xl lg:text-5xl font-medium text-[#380C19] tracking-tight mb-2.5"
            style={{ fontFamily: 'var(--font-head, "Fraunces", serif)' }}
          >
            Best Sellers
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#8A7B78] max-w-lg mx-auto">
            Our most cherished silhouettes and celebrated weaves, timelessly crafted for elegance.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && <ProductGridSkeleton count={4} />}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-[#F4DCD6] p-6 text-center text-sm text-[#7B1E3A]">
            Unable to load best sellers: {error}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && bestSellerProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellerProducts.map((product) => (
              <ProductCard
                key={`bestseller-${product.id}`}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bestSellerProducts.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-[#EADBCE]">
            <p className="text-sm font-medium text-[#380C19]">
              Best seller creations coming soon.
            </p>
          </div>
        )}

        {/* Center CTA Button */}
        {!loading && !error && bestSellerProducts.length > 0 && (
          <div className="mt-8 sm:mt-12 text-center">
            <Link to="/collections/sarees?sort_by=best-selling">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                Explore All Best Sellers
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}

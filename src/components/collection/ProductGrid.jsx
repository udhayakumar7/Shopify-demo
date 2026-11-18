import React from "react";
import ProductCard from "../products/ProductCard";

/**
 * Responsive product grid for collection listings.
 * Grid breakpoint specifications:
 * - Mobile: 2 columns
 * - Tablet: 3 columns
 * - Desktop: 4 columns
 */
export default function ProductGrid({
  products = [],
  onQuickView,
  className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8",
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className={className}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

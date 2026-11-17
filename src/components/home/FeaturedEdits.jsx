import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { ProductGridSkeleton } from "../common/Skeleton";
import ProductCard from "../products/ProductCard";
import QuickViewModal from "../products/QuickViewModal";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";

export default function FeaturedEdits() {
  const { products, loading, error } = useProducts({ first: 8 });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="w-full border-y border-[#EADBCE] bg-gradient-to-b from-white to-[#FBF6F0] py-16 sm:py-24">
      {/* Fluid container: spans full width, padding scales with viewport,
          content is only capped on very large screens */}
      <div className="mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,4rem)]">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {/* <div className="mb-2 inline-flex items-center gap-1.5 font-fancy text-[14px] font-semibold tracking-widest text-[#C5A059]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Timeless Silks</span>
            </div> */}
            <h2 className="font-serif text-3xl font-medium text-[#380C19] sm:text-4xl lg:text-4xl">
              Featured Masterpieces
            </h2>
          </div>

          <Link
            to="/products"
            className="group flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#7B1E3A] hover:underline sm:text-sm"
          >
            <span>Explore All Sarees</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading && <ProductGridSkeleton count={8} />}

        {error && (
          <div className="rounded-lg bg-[#F4DCD6] p-6 text-center text-sm text-[#7B1E3A]">
            Unable to load featured sarees: {error}
          </div>
        )}

        {/* Fluid grid: columns are added as space allows, no fixed breakpoints */}
        {!loading && !error && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-x-[clamp(1rem,2vw,2rem)] gap-y-12">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-14 text-center sm:hidden">
          <Link to="/products">
            <Button variant="outline" size="md" className="w-full">
              View Complete Saree Catalogue
            </Button>
          </Link>
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
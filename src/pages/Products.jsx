import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/products/ProductCard";
import QuickViewModal from "../components/products/QuickViewModal";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import { Filter, ArrowUpDown, Sparkles, RefreshCw } from "lucide-react";

export default function Products() {
  const [sortOption, setSortOption] = useState("default");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { products, loading, loadingMore, error, loadMore, pageInfo, refresh } =
    useProducts({ first: 24 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "All Sarees | Harini Sarees Handwoven Collection";
  }, []);

  // Filter and sort products
  const displayProducts = useMemo(() => {
    let list = [...products];

    // Filter by availability
    if (availabilityFilter === "in-stock") {
      list = list.filter((p) => p.availableForSale);
    } else if (availabilityFilter === "sold-out") {
      list = list.filter((p) => !p.availableForSale);
    }

    // Sort
    if (sortOption === "price-low") {
      list.sort(
        (a, b) =>
          Number(a.priceRange?.minVariantPrice?.amount || 0) -
          Number(b.priceRange?.minVariantPrice?.amount || 0)
      );
    } else if (sortOption === "price-high") {
      list.sort(
        (a, b) =>
          Number(b.priceRange?.minVariantPrice?.amount || 0) -
          Number(a.priceRange?.minVariantPrice?.amount || 0)
      );
    } else if (sortOption === "name-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "name-desc") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [products, availabilityFilter, sortOption]);

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "All Sarees" }]} />

        {/* Page Title & Intro */}
        <div className="border-b border-[#EADBCE] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C5A059] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Complete Archive</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#380C19]">
              All Handcrafted Sarees
            </h1>
            <p className="text-xs sm:text-sm text-[#8A7B78] mt-1.5 max-w-xl">
              Immerse yourself in our full catalogue of pure Kanjivaram silks, festive Banarasi weaves, and artisanal handlooms.
            </p>
          </div>

          {/* Saree Count Indicator */}
          <div className="text-xs text-[#8A7B78] bg-white px-3 py-1.5 rounded-full border border-[#EADBCE] w-fit">
            Showing <strong className="text-[#7B1E3A]">{displayProducts.length}</strong> {displayProducts.length === 1 ? "weave" : "weaves"}
          </div>
        </div>

        {/* Controls Bar: Sort & Filter Pills */}
        <div className="bg-white p-4 rounded-xl border border-[#EADBCE] shadow-2xs mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7B78] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {/* Availability Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-[#FFF8F3] p-1 rounded-lg border border-[#EADBCE]">
              {[
                { id: "all", label: "All" },
                { id: "in-stock", label: "In Stock" },
                { id: "sold-out", label: "Sold Out" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAvailabilityFilter(tab.id)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    availabilityFilter === tab.id
                      ? "bg-[#7B1E3A] text-white shadow-2xs"
                      : "text-[#521225] hover:text-[#7B1E3A]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
            <label htmlFor="sort" className="text-xs font-medium text-[#8A7B78]">
              Sort By:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-xs font-medium text-[#380C19] bg-[#FFF8F3] border border-[#EADBCE] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#7B1E3A] cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
              <option value="name-desc">Alphabetical: Z to A</option>
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && <ProductGridSkeleton count={8} />}

        {/* Error */}
        {error && (
          <div className="p-8 text-center bg-[#F4DCD6] border border-[#EADBCE] rounded-xl my-8">
            <p className="text-sm text-[#7B1E3A] mb-4">Error loading sarees: {error}</p>
            <Button onClick={() => refresh()} variant="primary" size="sm" icon={RefreshCw}>
              Retry Loading
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayProducts.length === 0 && (
          <div className="py-20 text-center bg-white rounded-xl border border-[#EADBCE] p-8">
            <h3 className="font-serif text-xl font-medium text-[#380C19] mb-2">
              No Sarees Found
            </h3>
            <p className="text-xs sm:text-sm text-[#8A7B78] max-w-md mx-auto mb-6">
              No products match your selected availability filter. Please try resetting your filter criteria.
            </p>
            <Button onClick={() => setAvailabilityFilter("all")} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Cursor Pagination: Load More */}
        {pageInfo.hasNextPage && (
          <div className="mt-14 text-center">
            <Button
              onClick={loadMore}
              loading={loadingMore}
              variant="outline"
              size="lg"
              className="min-w-48 bg-white hover:bg-[#7B1E3A]"
            >
              Load More Handcrafted Sarees
            </Button>
            <p className="text-[11px] text-[#8A7B78] mt-2">
              Explore additional heirloom weaves from our archives
            </p>
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
    </div>
  );
}

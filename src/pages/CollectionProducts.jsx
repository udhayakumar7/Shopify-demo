import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getCollectionByHandle } from "../services/shopify/collections";
import ProductCard from "../components/products/ProductCard";
import QuickViewModal from "../components/products/QuickViewModal";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import {
  Filter,
  ArrowUpDown,
  X,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export default function CollectionProducts() {
  const { handle } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter & Sort state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");
  const [selectedProductType, setSelectedProductType] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getCollectionByHandle(handle, { first: 50 });
        if (!data) {
          throw new Error("Collection not found in Shopify.");
        }
        setCollection(data);
        document.title = `${data.title} | Harini Sarees Collection`;
      } catch (err) {
        setError(err.message || "Failed to load collection");
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [handle]);

  const rawProducts = useMemo(() => {
    return collection?.products || [];
  }, [collection]);

  // Derive unique product types
  const productTypes = useMemo(() => {
    return [
      ...new Set(rawProducts.map((p) => p.productType).filter(Boolean)),
    ];
  }, [rawProducts]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    // Min price
    if (minPrice !== "") {
      list = list.filter(
        (p) =>
          Number(p.priceRange?.minVariantPrice?.amount || 0) >= Number(minPrice)
      );
    }

    // Max price
    if (maxPrice !== "") {
      list = list.filter(
        (p) =>
          Number(p.priceRange?.minVariantPrice?.amount || 0) <= Number(maxPrice)
      );
    }

    // Availability
    if (availability === "in-stock") {
      list = list.filter((p) => p.availableForSale);
    } else if (availability === "sold-out") {
      list = list.filter((p) => !p.availableForSale);
    }

    // Product Type
    if (selectedProductType !== "all") {
      list = list.filter((p) => p.productType === selectedProductType);
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort(
        (a, b) =>
          Number(a.priceRange?.minVariantPrice?.amount || 0) -
          Number(b.priceRange?.minVariantPrice?.amount || 0)
      );
    } else if (sortBy === "price-high") {
      list.sort(
        (a, b) =>
          Number(b.priceRange?.minVariantPrice?.amount || 0) -
          Number(a.priceRange?.minVariantPrice?.amount || 0)
      );
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [
    rawProducts,
    minPrice,
    maxPrice,
    availability,
    selectedProductType,
    sortBy,
  ]);

  // Active filter count
  const hasActiveFilters =
    minPrice !== "" ||
    maxPrice !== "" ||
    availability !== "all" ||
    selectedProductType !== "all";

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setSelectedProductType("all");
    setSortBy("default");
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Collections", path: "/products" },
            { label: collection?.title || handle },
          ]}
        />

        {/* Collection Hero Header */}
        <div className="border-b border-[#EADBCE] pb-8 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C5A059] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#380C19]">
            {collection?.title || "Silk Sarees"}
          </h1>
          {collection?.description && (
            <p className="text-xs sm:text-sm text-[#8A7B78] mt-2 max-w-2xl leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        {/* Mobile Filter Button & Desktop Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#EADBCE] shadow-2xs mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-md bg-[#7B1E3A] text-white text-xs font-medium cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters & Sort</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              )}
            </button>

            <span className="text-xs text-[#8A7B78]">
              Showing <strong className="text-[#7B1E3A]">{filteredProducts.length}</strong> of {rawProducts.length} sarees
            </span>
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
            <label htmlFor="collection-sort" className="text-xs font-medium text-[#8A7B78]">
              Sort:
            </label>
            <select
              id="collection-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white/70 rounded-lg border border-[#EADBCE]">
            <span className="text-xs font-semibold text-[#8A7B78] uppercase tracking-wider">
              Active Filters:
            </span>
            {minPrice !== "" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#F4DCD6] text-[#7B1E3A] px-2.5 py-1 rounded-full font-medium">
                Min ₹{minPrice}
                <button onClick={() => setMinPrice("")} className="cursor-pointer hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {maxPrice !== "" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#F4DCD6] text-[#7B1E3A] px-2.5 py-1 rounded-full font-medium">
                Max ₹{maxPrice}
                <button onClick={() => setMaxPrice("")} className="cursor-pointer hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {availability !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#F4DCD6] text-[#7B1E3A] px-2.5 py-1 rounded-full font-medium">
                {availability === "in-stock" ? "In Stock" : "Sold Out"}
                <button onClick={() => setAvailability("all")} className="cursor-pointer hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedProductType !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#F4DCD6] text-[#7B1E3A] px-2.5 py-1 rounded-full font-medium">
                {selectedProductType}
                <button onClick={() => setSelectedProductType("all")} className="cursor-pointer hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#7B1E3A] hover:underline ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Layout: Desktop Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-6 rounded-xl border border-[#EADBCE] shadow-2xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
              <h3 className="font-serif text-base font-semibold text-[#380C19] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#7B1E3A]" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#7B1E3A] hover:underline font-medium cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#380C19] mb-3">
                Price Range (₹)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#8A7B78] uppercase">Min</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-[#EADBCE] bg-[#FFF8F3] focus:outline-none focus:border-[#7B1E3A]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8A7B78] uppercase">Max</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-[#EADBCE] bg-[#FFF8F3] focus:outline-none focus:border-[#7B1E3A]"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-[#EADBCE]/60">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#380C19] mb-3">
                Availability
              </h4>
              <div className="space-y-2">
                {[
                  { id: "all", label: "All Items" },
                  { id: "in-stock", label: "In Stock" },
                  { id: "sold-out", label: "Sold Out" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-[#521225] cursor-pointer hover:text-[#7B1E3A]"
                  >
                    <input
                      type="radio"
                      name="desktop-avail"
                      value={item.id}
                      checked={availability === item.id}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="accent-[#7B1E3A]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Types */}
            {productTypes.length > 0 && (
              <div className="pt-4 border-t border-[#EADBCE]/60">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#380C19] mb-3">
                  Weave Type
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[#521225] cursor-pointer hover:text-[#7B1E3A]">
                    <input
                      type="radio"
                      name="desktop-type"
                      value="all"
                      checked={selectedProductType === "all"}
                      onChange={(e) => setSelectedProductType(e.target.value)}
                      className="accent-[#7B1E3A]"
                    />
                    <span>All Types</span>
                  </label>
                  {productTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-xs text-[#521225] cursor-pointer hover:text-[#7B1E3A]"
                    >
                      <input
                        type="radio"
                        name="desktop-type"
                        value={type}
                        checked={selectedProductType === type}
                        onChange={(e) => setSelectedProductType(e.target.value)}
                        className="accent-[#7B1E3A]"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Products Grid Column */}
          <main className="lg:col-span-3">
            {loading && <ProductGridSkeleton count={6} />}

            {error && (
              <div className="p-8 text-center bg-[#F4DCD6] border border-[#EADBCE] rounded-xl">
                <p className="text-sm text-[#7B1E3A] mb-4">{error}</p>
                <Link to="/products">
                  <Button variant="primary" size="sm">
                    View All Sarees
                  </Button>
                </Link>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="py-20 text-center bg-white rounded-xl border border-[#EADBCE] p-8">
                <h3 className="font-serif text-xl font-medium text-[#380C19] mb-2">
                  No Sarees Match Your Filters
                </h3>
                <p className="text-xs sm:text-sm text-[#8A7B78] max-w-md mx-auto mb-6">
                  Try adjusting the price range or resetting availability to view all available sarees in this collection.
                </p>
                <Button onClick={clearAllFilters} variant="primary" size="sm">
                  Reset All Filters
                </Button>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-[#380C19]/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
                <h3 className="font-serif text-lg font-semibold text-[#380C19]">
                  Filters & Options
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-[#8A7B78] hover:text-[#7B1E3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price Filter */}
              <div className="py-4 border-b border-[#EADBCE]">
                <h4 className="text-xs font-semibold uppercase text-[#380C19] mb-3">
                  Price Range (₹)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-[#EADBCE]"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-[#EADBCE]"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div className="py-4 border-b border-[#EADBCE]">
                <h4 className="text-xs font-semibold uppercase text-[#380C19] mb-3">
                  Availability
                </h4>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Items" },
                    { id: "in-stock", label: "In Stock" },
                    { id: "sold-out", label: "Sold Out" },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="mob-avail"
                        value={item.id}
                        checked={availability === item.id}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="accent-[#7B1E3A]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EADBCE] space-y-2">
              <Button
                onClick={() => setIsMobileFilterOpen(false)}
                variant="primary"
                className="w-full"
              >
                Apply Filters ({filteredProducts.length} Results)
              </Button>
              <Button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                variant="ghost"
                className="w-full"
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        </div>
      )}

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

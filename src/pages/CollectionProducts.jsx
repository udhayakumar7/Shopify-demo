import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getCollectionByHandle } from "../services/shopify/collections";
import CollectionHeader from "../components/collection/CollectionHeader";
import SortDropdown from "../components/collection/SortDropdown";
import ProductGrid from "../components/collection/ProductGrid";
import LoadMoreButton from "../components/collection/LoadMoreButton";
import QuickViewModal from "../components/products/QuickViewModal";
import Button from "../components/common/Button";
import SareeFilterSidebar from "../components/collection/SareeFilterSidebar";
import KurtiFilterSidebar from "../components/collection/KurtiFilterSidebar";
import ActiveFilterChips from "../components/collection/ActiveFilterChips";
import FilterButton from "../components/collection/FilterButton";
import MobileFilterDrawer from "../components/collection/MobileFilterDrawer";
import { useSareeFilters } from "../hooks/useSareeFilters";
import { useKurtiFilters } from "../hooks/useKurtiFilters";
import {
  Sparkles,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

const PAGE_SIZE = 12;

/**
 * Reusable Collection Listing Page for all Saree and Kurti collections.
 * Handles dynamic routing, Storefront API data, 7-option sorting,
 * cursor-based pagination, and category-tailored faceted filtering.
 */
export default function CollectionProducts() {
  const { handle } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven sort parameter (supports sort_by and legacy sort)
  const sortBy = searchParams.get("sort_by") || searchParams.get("sort") || "featured";

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null,
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [loadMoreError, setLoadMoreError] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Category Detection
  const isKurti = useMemo(() => {
    if (!handle) return false;
    const h = handle.toLowerCase();
    if (
      h.includes("kurti") ||
      h === "cotton-kurtis" ||
      h === "designer-kurtis" ||
      h === "kurtis"
    ) {
      return true;
    }
    const title = (collection?.title || "").toLowerCase();
    if (title.includes("kurti")) return true;
    return products.some((p) => /kurti/i.test(p.productType || ""));
  }, [handle, collection, products]);

  const isSaree = useMemo(() => {
    if (isKurti) return false;
    if (!handle) return false;
    const h = handle.toLowerCase();
    if (
      h.includes("saree") ||
      h === "silk-sarees" ||
      h === "cotton-sarees" ||
      h === "premium-saree" ||
      h === "banarasi-sarees" ||
      h === "designer-sarees" ||
      h === "sarees"
    ) {
      return true;
    }
    const title = (collection?.title || "").toLowerCase();
    if (title.includes("saree")) return true;
    return products.some((p) => /saree/i.test(p.productType || ""));
  }, [handle, collection, products, isKurti]);

  const hasCategoryFilters = isSaree || isKurti;

  // Unconditionally invoke filter hooks
  const sareeFilters = useSareeFilters(isSaree ? products : []);
  const kurtiFilters = useKurtiFilters(isKurti ? products : []);

  const activeEngine = isKurti ? kurtiFilters : sareeFilters;

  const {
    filteredProducts,
    availableFacets,
    activeFilters,
    activeChips,
    activeFilterCount,
    toggleFilter,
    toggleBooleanFilter,
    setPriceRange,
    clearPriceRange,
    clearAllFilters,
  } = activeEngine;

  const displayProducts = hasCategoryFilters ? filteredProducts : products;

  // Handle Sort Change (preserves URL filter parameters without reloading)
  const handleSortChange = useCallback(
    (newSort) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("sort"); // Clean legacy key
          if (newSort && newSort !== "featured") {
            next.set("sort_by", newSort);
          } else {
            next.delete("sort_by");
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Fetch initial collection data and products when handle or sort changes
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        setLoadMoreError("");

        const data = await getCollectionByHandle(handle, {
          first: PAGE_SIZE,
          sortBy,
        });

        if (!active) return;

        if (!data) {
          setError(
            "This collection could not be found. Please explore our other curated collections."
          );
          return;
        }

        setCollection(data);
        setProducts(data.products || []);
        setPageInfo(
          data.pageInfo || { hasNextPage: false, endCursor: null }
        );
        document.title = `${data.title} | Harini Sarees`;
      } catch (err) {
        if (active) {
          console.error("[Collection Load Error]:", err);
          setError(
            err.message ||
              "Unable to load this collection. Please check your connection and try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      active = false;
    };
  }, [handle, sortBy]);

  // Load more products using cursor-based pagination
  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || loadingMore) return;

    try {
      setLoadingMore(true);
      setLoadMoreError("");

      const nextData = await getCollectionByHandle(handle, {
        first: PAGE_SIZE,
        after: pageInfo.endCursor,
        sortBy,
      });

      if (nextData && nextData.products) {
        // Prevent duplicate products when appending
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const fresh = nextData.products.filter((p) => !existingIds.has(p.id));
          return [...prev, ...fresh];
        });
        setPageInfo(
          nextData.pageInfo || { hasNextPage: false, endCursor: null }
        );
      }
    } catch (err) {
      console.error("[Load More Error]:", err);
      setLoadMoreError(
        "Unable to load more designs right now. Please check your connection."
      );
    } finally {
      setLoadingMore(false);
    }
  }, [handle, pageInfo, sortBy, loadingMore]);

  const productTypeNoun = isKurti
    ? displayProducts.length === 1
      ? "kurti"
      : "kurtis"
    : isSaree
    ? displayProducts.length === 1
      ? "saree"
      : "sarees"
    : displayProducts.length === 1
    ? "design"
    : "designs";

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collection Header */}
        <CollectionHeader
          title={
            collection?.title ||
            (loading ? "Loading Collection..." : "Collection")
          }
          description={collection?.description || ""}
          totalCount={products.length}
          loading={loading}
        />

        {/* Toolbar: Filter Button, Count, and Sort Dropdown */}
        {!error && (
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EADBCE]/50">
            <div className="flex items-center gap-3">
              {hasCategoryFilters && (
                <FilterButton
                  onClick={() => setIsMobileFilterOpen(true)}
                  activeCount={activeFilterCount}
                  disabled={loading}
                />
              )}
              <span className="text-xs text-[#8A7B78]">
                {loading ? (
                  "Fetching handcrafted pieces..."
                ) : (
                  <>
                    Showing{" "}
                    <strong className="text-[#7B1E3A] font-semibold">
                      {displayProducts.length}
                    </strong>{" "}
                    {productTypeNoun}
                    {hasCategoryFilters &&
                    activeFilterCount > 0 &&
                    products.length > displayProducts.length ? (
                      <span className="ml-1 text-[11px] text-[#8A7B78]">
                        (filtered from {products.length})
                      </span>
                    ) : pageInfo.hasNextPage ? (
                      <span className="ml-1 text-[11px] text-[#8A7B78]">
                        loaded
                      </span>
                    ) : null}
                  </>
                )}
              </span>
            </div>

            <SortDropdown
              value={sortBy}
              onChange={handleSortChange}
              disabled={loading}
            />
          </div>
        )}

        {/* Error State */}
        {error ? (
          <div className="bg-white rounded-2xl border border-[#EADBCE] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-12 h-12 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-[#380C19] mb-2">
              Collection Unavailable
            </h2>
            <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed mb-6">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                icon={RefreshCw}
              >
                Retry
              </Button>
              <Link to="/products">
                <Button variant="outline">Browse All Designs</Button>
              </Link>
            </div>
          </div>
        ) : loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex flex-col space-y-3">
                <div className="aspect-[3/4] w-full rounded-md bg-[#F4DCD6]/40 animate-pulse" />
                <div className="h-4 w-3/4 bg-[#EADBCE]/60 animate-pulse rounded" />
                <div className="h-3.5 w-1/3 bg-[#EADBCE]/40 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Collection Empty State */
          <div className="bg-white rounded-2xl border border-[#EADBCE] p-10 sm:p-16 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-16 h-16 rounded-full bg-[#FFF8F3] border-2 border-[#C5A059]/40 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Sparkles className="w-7 h-7 text-[#C5A059]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#380C19] mb-2">
              New Creations Coming Soon
            </h2>
            <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed mb-8 max-w-md mx-auto">
              Our artisans are currently preparing new pieces for the{" "}
              <strong className="text-[#380C19]">
                {collection?.title || "this"}
              </strong>{" "}
              collection. In the meantime, explore our other curated sarees and
              kurtis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/collections/silk-sarees">
                <Button variant="primary" icon={ShoppingBag}>
                  Explore Silk Sarees
                </Button>
              </Link>
              <Link to="/collections/cotton-kurtis">
                <Button variant="outline">Explore Cotton Kurtis</Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Layout: Desktop Sidebar + Product Grid */
          <div className={hasCategoryFilters ? "flex flex-col lg:flex-row items-start gap-8" : ""}>
            {/* Desktop Filter Sidebar */}
            {isSaree && (
              <SareeFilterSidebar
                facets={availableFacets}
                activeFilters={activeFilters}
                activeFilterCount={activeFilterCount}
                onToggleFilter={toggleFilter}
                onToggleBooleanFilter={toggleBooleanFilter}
                onSetPriceRange={setPriceRange}
                onClearPriceRange={clearPriceRange}
                onClearAll={clearAllFilters}
                className="hidden lg:block sticky top-28"
              />
            )}

            {isKurti && (
              <KurtiFilterSidebar
                facets={availableFacets}
                activeFilters={activeFilters}
                activeFilterCount={activeFilterCount}
                onToggleFilter={toggleFilter}
                onToggleBooleanFilter={toggleBooleanFilter}
                onSetPriceRange={setPriceRange}
                onClearPriceRange={clearPriceRange}
                onClearAll={clearAllFilters}
                className="hidden lg:block sticky top-28"
              />
            )}

            {/* Grid & Active Chips Container */}
            <div className="flex-1 min-w-0 w-full">
              {/* Active Filter Chips */}
              {hasCategoryFilters && (
                <ActiveFilterChips
                  chips={activeChips}
                  onClearAll={clearAllFilters}
                />
              )}

              {/* Filtered Empty State */}
              {hasCategoryFilters && displayProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#EADBCE] p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm my-6">
                  <div className="w-14 h-14 rounded-full bg-[#FFF8F3] border border-[#C5A059]/40 flex items-center justify-center mx-auto mb-4 text-[#7B1E3A]">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#380C19] mb-2">
                    No {isKurti ? "Kurtis" : "Sarees"} Match Your Filters
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed mb-6 max-w-sm mx-auto">
                    We could not find any {isKurti ? "kurtis" : "sarees"} matching
                    all your selected filter criteria. Try removing or adjusting
                    filters to view more creations.
                  </p>
                  <Button
                    variant="primary"
                    onClick={clearAllFilters}
                    icon={RotateCcw}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                /* Live Products Grid */
                <>
                  <ProductGrid
                    products={displayProducts}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    className={
                      hasCategoryFilters
                        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6"
                        : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                    }
                  />

                  {/* Load More Pagination */}
                  <LoadMoreButton
                    hasNextPage={pageInfo.hasNextPage}
                    loading={loadingMore}
                    onLoadMore={handleLoadMore}
                    currentCount={products.length}
                    error={loadMoreError}
                    onRetry={handleLoadMore}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {hasCategoryFilters && (
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          facets={availableFacets}
          activeFilters={activeFilters}
          activeFilterCount={activeFilterCount}
          filteredCount={displayProducts.length}
          isKurti={isKurti}
          onToggleFilter={toggleFilter}
          onToggleBooleanFilter={toggleBooleanFilter}
          onSetPriceRange={setPriceRange}
          onClearPriceRange={clearPriceRange}
          onClearAll={clearAllFilters}
        />
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

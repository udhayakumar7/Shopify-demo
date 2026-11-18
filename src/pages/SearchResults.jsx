import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { searchProducts } from "../services/shopify/search.js";
import ProductCard from "../components/products/ProductCard";
import QuickViewModal from "../components/products/QuickViewModal";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import { Search, Sparkles, RefreshCw } from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [inputQuery, setInputQuery] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync input when search query URL param changes
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setInputQuery(query);
  }

  useEffect(() => {
    async function executeSearch() {
      const trimmed = query.trim();
      if (!trimmed) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await searchProducts(trimmed, 30);
        setProducts(data);
        document.title = `Search results for "${trimmed}" | Harini Sarees`;
      } catch (err) {
        setError(err.message || "Failed to complete search");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(inputQuery.trim())}`);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Search Results" }]} />

        {/* Search Header & Query Form */}
        <div className="border-b border-[#EADBCE] pb-8 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C5A059] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Results</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19] mb-4">
            {query ? `Results for "${query}"` : "Search Our Collection"}
          </h1>

          <form onSubmit={handleSearchSubmit} className="max-w-xl flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A7B78] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search sarees, kurtis, silk, cotton, wedding..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EADBCE] rounded-md text-xs sm:text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A] shadow-2xs"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>

          {!loading && !error && query && (
            <p className="text-xs text-[#8A7B78] mt-3">
              Found <strong className="text-[#7B1E3A]">{products.length}</strong> {products.length === 1 ? "creation" : "creations"} matching your search.
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && <ProductGridSkeleton count={4} />}

        {/* Error */}
        {error && (
          <div className="p-8 text-center bg-[#F4DCD6] border border-[#EADBCE] rounded-xl my-6">
            <p className="text-sm text-[#7B1E3A] mb-3">{error}</p>
            <Button
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
              variant="outline"
              size="sm"
              icon={RefreshCw}
            >
              Retry Search
            </Button>
          </div>
        )}

        {/* Empty state when no products found */}
        {!loading && !error && products.length === 0 && query && (
          <div className="py-16 text-center bg-white rounded-xl border border-[#EADBCE] p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#380C19] mb-2">
              No matching creations found
            </h3>
            <p className="text-xs sm:text-sm text-[#8A7B78] mb-6 leading-relaxed">
              We couldn't find any items matching "{query}". Try searching with terms like "Silk", "Kurti", "Cotton", or explore our collections.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/collections/sarees">
                <Button variant="primary">Explore Sarees</Button>
              </Link>
              <Link to="/collections/kurtis">
                <Button variant="outline">Explore Kurtis</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
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

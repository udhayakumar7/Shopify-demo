import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { ProductGridSkeleton } from "../common/Skeleton";
import ProductCard from "../products/ProductCard";
import QuickViewModal from "../products/QuickViewModal";
import Button from "../common/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FeaturedEdits() {
  const { products, loading, error } = useProducts({ first: 16 });
  const [activeTab, setActiveTab] = useState("all"); // "all" | "sarees" | "kurtis" | "new"
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter products by selected showcase tab
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    switch (activeTab) {
      case "sarees":
        return products.filter((p) => !/kurti/i.test(p.productType || "") && !/kurti/i.test(p.title || ""));
      case "kurtis":
        return products.filter((p) => /kurti/i.test(p.productType || "") || /kurti/i.test(p.title || ""));
      case "new":
        return products.filter(
          (p) =>
            p.tags?.some((t) => /new/i.test(t)) ||
            p.metafields?.some((m) => m?.key === "is_new_arrival" && String(m.value) === "true")
        );
      case "all":
      default:
        return products;
    }
  }, [products, activeTab]);

  const categoryHref =
    activeTab === "sarees"
      ? "/collections/sarees"
      : activeTab === "kurtis"
      ? "/collections/kurtis"
      : "/products";

  const categoryLabel =
    activeTab === "sarees"
      ? "Explore All Sarees"
      : activeTab === "kurtis"
      ? "Explore All Kurtis"
      : "Explore All Creations";

  return (
    <section className="w-full border-y border-[#EADBCE] bg-gradient-to-b from-white to-[#FBF6F0] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,4rem)]">
        {/* Header & Category Switcher */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#C5A059]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Showcases</span>
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#380C19] sm:text-4xl">
              Featured Masterpieces
            </h2>
          </div>

          {/* Interactive Showcase Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Creations" },
              { id: "sarees", label: "Handcrafted Sarees" },
              { id: "kurtis", label: "Artisanal Kurtis" },
              { id: "new", label: "New Arrivals" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#7B1E3A] text-white shadow-xs"
                      : "bg-[#FFF8F3] text-[#521225] border border-[#EADBCE] hover:border-[#7B1E3A] hover:text-[#7B1E3A]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Link
            to={categoryHref}
            className="group hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-[#7B1E3A] hover:underline sm:text-sm md:flex"
          >
            <span>{categoryLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading && <ProductGridSkeleton count={4} />}

        {error && (
          <div className="rounded-lg bg-[#F4DCD6] p-6 text-center text-sm text-[#7B1E3A]">
            Unable to load featured creations: {error}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-[#EADBCE]">
            <p className="text-sm font-medium text-[#380C19]">
              No pieces currently in this showcase.
            </p>
            <p className="text-xs text-[#8A7B78] mt-1 mb-4">
              Explore our full catalog of sarees and kurtis.
            </p>
            <Link to="/products">
              <Button variant="outline" size="sm">
                View All Creations
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile View Complete Catalog Button */}
        <div className="mt-10 text-center md:hidden">
          <Link to={categoryHref}>
            <Button variant="outline" size="md" className="w-full">
              {categoryLabel}
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

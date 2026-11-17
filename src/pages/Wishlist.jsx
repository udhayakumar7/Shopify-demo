import React, { useEffect, useState } from "react";
import { useWishlist } from "../hooks/useWishlist";
import ProductCard from "../components/products/ProductCard";
import QuickViewModal from "../components/products/QuickViewModal";
import EmptyState from "../components/common/EmptyState";
import Breadcrumb from "../components/common/Breadcrumb";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { items } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "My Wishlist | Harini Sarees";
  }, []);

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "My Wishlist" }]} />

        <div className="border-b border-[#EADBCE] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19]">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#8A7B78] mt-1">
              Your curated shortlist of treasured handloom sarees.
            </p>
          </div>
          <p className="text-xs font-medium text-[#7B1E3A] bg-[#F4DCD6] px-3 py-1.5 rounded-full w-fit">
            {items.length} {items.length === 1 ? "saved saree" : "saved sarees"}
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Explore our handwoven Kanjivaram and bridal silks to save your dream sarees for future celebrations."
            actionText="Discover All Sarees"
            actionLink="/products"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

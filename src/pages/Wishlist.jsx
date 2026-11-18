import React, { useEffect, useState } from "react";
import { useWishlist } from "../hooks/useWishlist";
import { getProductByHandle } from "../services/shopify/products.js";
import ProductCard from "../components/products/ProductCard";
import QuickViewModal from "../components/products/QuickViewModal";
import EmptyState from "../components/common/EmptyState";
import Breadcrumb from "../components/common/Breadcrumb";
import { Heart, Loader2 } from "lucide-react";

export default function Wishlist() {
  const { items, removeItem } = useWishlist();
  const [liveItems, setLiveItems] = useState(items);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "My Wishlist | Harini Luxury Indian Ethnic Wear";
  }, []);

  // Refresh live pricing, stock, and availability from Shopify on mount
  useEffect(() => {
    let isMounted = true;

    async function refreshFromShopify() {
      if (items.length === 0) return;
      try {
        setIsRefreshing(true);
        const promises = items.map(async (item) => {
          try {
            const fresh = await getProductByHandle(item.handle);
            if (!fresh) {
              // Product was deleted in Shopify
              removeItem(item.id);
              return null;
            }
            return fresh;
          } catch {
            return item; // Fallback to cached item
          }
        });

        const refreshed = await Promise.all(promises);
        if (isMounted) {
          setLiveItems(refreshed.filter(Boolean));
        }
      } catch (err) {
        console.warn("[Wishlist] Failed to refresh live items:", err);
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
        }
      }
    }

    refreshFromShopify();

    return () => {
      isMounted = false;
    };
  }, [items, removeItem]);

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "My Wishlist" }]} />

        <div className="border-b border-[#EADBCE] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19]">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#8A7B78] mt-1">
              Your curated shortlist of treasured handloom sarees and artisanal kurtis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isRefreshing && (
              <span className="text-xs text-[#8A7B78] flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-[#7B1E3A]" />
                Refreshing live availability...
              </span>
            )}
            <p className="text-xs font-medium text-[#7B1E3A] bg-[#F4DCD6] px-3.5 py-1.5 rounded-full w-fit">
              {liveItems.length} {liveItems.length === 1 ? "saved piece" : "saved pieces"}
            </p>
          </div>
        </div>

        {liveItems.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Explore our handwoven sarees and contemporary kurtis to save your dream outfits for upcoming celebrations."
            actionText="Explore Collections"
            actionLink="/collections/sarees"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {liveItems.map((product) => (
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

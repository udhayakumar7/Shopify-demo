import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useSearch } from "../../hooks/useSearch";
import { formatPrice } from "../../utils/currency";
import { PRODUCT_FALLBACK_IMAGE } from "../../config/banners";

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { results, loading } = useSearch(searchTerm, 250);

  const handleClose = useCallback(() => {
    setSearchTerm("");
    onClose();
  }, [onClose]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    handleClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSelectProduct = (handle) => {
    handleClose();
    navigate(`/products/${handle}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#380C19]/60 backdrop-blur-xs z-50"
          />

          {/* Search Box Card */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 sm:top-16 inset-x-4 max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-[#EADBCE] z-50 overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Input Header */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center px-4 py-3 sm:py-4 border-b border-[#EADBCE] bg-[#FFF8F3]"
            >
              <Search className="w-5 h-5 text-[#7B1E3A] shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search luxury sarees, kurtis, silk, cotton, wedding..."
                className="w-full bg-transparent text-[#380C19] placeholder-[#8A7B78] text-sm sm:text-base focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-1 text-[#8A7B78] hover:text-[#7B1E3A] mr-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-1 text-[#8A7B78] hover:text-[#7B1E3A] border-l border-[#EADBCE] pl-3 cursor-pointer"
              >
                <span className="text-xs font-medium">ESC</span>
              </button>
            </form>

            {/* Quick tags when search is empty */}
            {!searchTerm.trim() && (
              <div className="p-6 bg-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7B78] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Popular Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Silk Sarees",
                    "Cotton Kurtis",
                    "Banarasi Sarees",
                    "Designer Kurtis",
                    "Wedding Edit",
                    "Kanjivaram",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchTerm(tag)}
                      className="px-3 py-1.5 rounded-full text-xs bg-[#F4DCD6] text-[#7B1E3A] hover:bg-[#7B1E3A] hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions & Results List */}
            {searchTerm.trim().length >= 2 && (
              <div className="flex-1 overflow-y-auto divide-y divide-[#EADBCE]/60">
                {loading && (
                  <div className="py-10 text-center text-[#8A7B78] flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#7B1E3A]" />
                    <span className="text-sm">Searching authentic creations...</span>
                  </div>
                )}

                {!loading && results.length === 0 && (
                  <div className="py-12 text-center px-4">
                    <p className="text-sm font-medium text-[#380C19]">
                      No matching items found for "{searchTerm}"
                    </p>
                    <p className="text-xs text-[#8A7B78] mt-1">
                      Try searching with different keywords like "Silk", "Kurti", "Cotton" or explore all collections.
                    </p>
                  </div>
                )}

                {!loading &&
                  results.slice(0, 6).map((product) => {
                    const price = product.priceRange?.minVariantPrice;
                    const imageUrl = product.featuredImage?.url || PRODUCT_FALLBACK_IMAGE;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product.handle)}
                        className="w-full p-3.5 flex items-center gap-4 hover:bg-[#F4DCD6]/30 text-left transition-colors cursor-pointer group"
                      >
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-12 h-14 object-cover rounded bg-[#F4DCD6]/30 border border-[#EADBCE] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#380C19] group-hover:text-[#7B1E3A] transition-colors truncate">
                            {product.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-semibold text-[#7B1E3A]">
                              {formatPrice(price?.amount, price?.currencyCode)}
                            </span>
                            {product.availableForSale ? (
                              <span className="text-[10px] text-emerald-700 font-medium">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-500 font-medium">
                                Sold Out
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8A7B78] group-hover:text-[#7B1E3A] group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })}
              </div>
            )}

            {/* Bottom Footer Action */}
            {searchTerm.trim().length >= 2 && !loading && results.length > 0 && (
              <div className="p-3 bg-[#FFF8F3] border-t border-[#EADBCE] text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-semibold text-[#7B1E3A] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View all {results.length} search results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

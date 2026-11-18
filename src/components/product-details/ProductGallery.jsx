import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Badge from "../common/Badge";

/**
 * Luxury Product Image Gallery for Sarees & Kurtis
 * - 3:4 aspect ratio container
 * - Mobile swipe / touch gestures
 * - Desktop arrow navigation and thumbnail strip
 * - Fullscreen zoom / lightbox modal with keyboard navigation
 */
export default function ProductGallery({
  images = [],
  title = "Handcrafted Garment",
  discount = null,
  isAvailable = true,
  isNewArrival = false,
  isBestSeller = false,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const touchStartX = useRef(null);

  // Normalize images
  const safeImages = images.length > 0 ? images : [{ url: "", altText: title }];
  const currentImage = safeImages[selectedIndex] || safeImages[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (!isZoomOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsZoomOpen(false);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, safeImages.length]);

  // Mobile Touch handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    touchStartX.current = null;
  };

  return (
    <div className="space-y-4">
      {/* Main 3:4 Image Stage */}
      <div
        className="relative rounded-2xl overflow-hidden bg-white border border-[#EADBCE] shadow-xs aspect-[3/4] group select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={currentImage.url}
          alt={currentImage.altText || title}
          className="w-full h-full object-cover object-top sm:object-center transition-transform duration-500 cursor-zoom-in group-hover:scale-[1.02]"
          onClick={() => setIsZoomOpen(true)}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
          {!isAvailable && (
            <Badge variant="soldOut" size="sm">
              Sold Out
            </Badge>
          )}
          {discount && isAvailable && (
            <Badge variant="sale" size="sm">
              Save {discount}%
            </Badge>
          )}
          {isNewArrival && (
            <Badge variant="gold" size="sm">
              New Arrival
            </Badge>
          )}
          {isBestSeller && (
            <Badge variant="primary" size="sm">
              Best Seller
            </Badge>
          )}
        </div>

        {/* Previous / Next Arrow Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#380C19] hover:text-[#7B1E3A] shadow-md transition-all backdrop-blur-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#380C19] hover:text-[#7B1E3A] shadow-md transition-all backdrop-blur-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#380C19] hover:text-[#7B1E3A] shadow-md transition-all backdrop-blur-xs cursor-pointer focus:outline-none"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Mobile image counter pill */}
        {safeImages.length > 1 && (
          <div className="sm:hidden absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-medium backdrop-blur-xs">
            {selectedIndex + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          {safeImages.map((img, idx) => {
            const isActive = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`w-18 h-24 sm:w-20 sm:h-26 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-white cursor-pointer relative ${
                  isActive
                    ? "border-[#7B1E3A] ring-2 ring-[#7B1E3A]/20 shadow-sm scale-102"
                    : "border-[#EADBCE] opacity-70 hover:opacity-100 hover:border-[#C5A059]"
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={img.url}
                  alt={img.altText || `${title} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top sm:object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox Prev / Next */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Lightbox Image Container */}
          <div
            className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.altText || title}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
            />
            {safeImages.length > 1 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-xs font-medium tracking-widest">
                {selectedIndex + 1} OF {safeImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

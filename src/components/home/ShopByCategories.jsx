import React from "react";
import { Link } from "react-router-dom";
import { useCollections } from "../../hooks/useCollections";
import { Skeleton } from "../common/Skeleton";

const TOTAL_GRIDS = 6;
const FALLBACK_MODEL = "/weaves/cards/linen-model.webp";

const SLOT_CONFIGS = [
  {
    gradient: "linear-gradient(180deg, #7a3712 0%, #24201e 100%)",
    modelImage: "/weaves/cards/collection-1.png",
  },
  {
    gradient: "linear-gradient(180deg, #2f7a52 0%, #14221a 100%)",
    modelImage: "/weaves/cards/collection-2.png",
  },
  {
    gradient: "linear-gradient(180deg, #6b3a14 0%, #231b16 100%)",
    modelImage: "/weaves/cards/collection-3.png",
  },
  {
    gradient: "linear-gradient(180deg, #4a2a7a 0%, #1a1224 100%)",
    modelImage: "/weaves/cards/collection-4.png",
  },
  {
    gradient: "linear-gradient(180deg, #7a1f3a 0%, #200a12 100%)",
    modelImage: "/weaves/cards/collection-1.png",
  },
  {
    gradient: "linear-gradient(180deg, #3a7568 0%, #12201d 100%)",
    modelImage: "/weaves/cards/collection-2.png",
  },
];

// Centered row of circles
const GRID_CLASSES =
  "flex flex-wrap justify-center gap-x-5 gap-y-8 sm:gap-x-8 lg:gap-x-10";

// Medium size: 2 per row on mobile, fixed size on larger screens
const ITEM_WIDTH = "w-[40%] sm:w-40 lg:w-44";

function CategoryCard({ item }) {
  const card = (
    <>
      {/* Circle */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_8px_16px_-10px_rgba(0,0,0,0.45)] transition-shadow duration-500 group-hover:shadow-[0_14px_22px_-10px_rgba(0,0,0,0.5)]"
        style={{ backgroundImage: item.gradient }}
      >
        {/* Soft pattern */}
        <img
          alt=""
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute -right-[18%] -top-[10%] w-[90%] opacity-20 mix-blend-screen"
          src="/weaves/cards/pattern.webp"
        />

        {/* Thin white inner ring */}
        <div className="pointer-events-none absolute inset-[6%] rounded-full border border-white/80" />

        {/* Model, kept inside the circle */}
        <img
          alt={item.name}
          loading="lazy"
          decoding="async"
          className={`pointer-events-none absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-105 ${!item.isAvailable ? "opacity-70 grayscale-[25%]" : ""
            }`}
          src={item.modelImage}
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(FALLBACK_MODEL)) {
              e.currentTarget.src = FALLBACK_MODEL;
            }
          }}
        />

        {/* Coming soon badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/40 p-2">
            <span className="rounded-full bg-[#C5A059] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#240711] shadow-md">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        className={`mt-3 line-clamp-1 text-center font-serif text-sm font-medium transition-colors sm:text-base ${item.isAvailable
            ? "text-[#380C19] group-hover:text-[#7B1E3A]"
            : "text-[#8A7B78]"
          }`}
      >
        {item.name}
      </h3>
    </>
  );

  return item.isAvailable ? (
    <Link
      to={item.href}
      className={`group block ${ITEM_WIDTH} rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFF8F3]`}
    >
      {card}
    </Link>
  ) : (
    <div className={`group block ${ITEM_WIDTH} cursor-default select-none`}>
      {card}
    </div>
  );
}

export default function ShopByCategories() {
  const { collections, loading, error } = useCollections(30);

  // Valid collections only, without Shopify's default "Home page" collection
  const validApiCollections = (collections || []).filter(
    (col) =>
      col &&
      col.title &&
      col.title.trim().length > 0 &&
      col.handle !== "frontpage" &&
      !/^home\s*-?\s*page$/i.test(col.title.trim())
  );

  const gridSlots = Array.from({ length: TOTAL_GRIDS }).map((_, index) => {
    const apiCol = validApiCollections[index];
    const slot = SLOT_CONFIGS[index % SLOT_CONFIGS.length];

    if (apiCol) {
      return {
        id: apiCol.id || `col-${index}`,
        isAvailable: true,
        name: apiCol.title,
        href: `/collections/${apiCol.handle}`,
        gradient: slot.gradient,
        modelImage: slot.modelImage,
      };
    }

    return {
      id: `coming-soon-${index}`,
      isAvailable: false,
      name: "Coming Soon",
      href: null,
      gradient: slot.gradient,
      modelImage: slot.modelImage,
    };
  });

  return (
    <section
      id="collections"
      aria-label="Shop by category"
      className="w-full bg-[#FFF8F3] py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10">
        {loading && (
          <div className={GRID_CLASSES}>
            {Array.from({ length: TOTAL_GRIDS }).map((_, i) => (
              <div key={i} className={`space-y-3 ${ITEM_WIDTH}`}>
                <div className="aspect-square w-full overflow-hidden rounded-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex justify-center">
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mx-auto mb-6 max-w-md rounded-lg bg-[#F4DCD6] p-4 text-center text-xs text-[#7B1E3A]">
            Unable to load categories right now. Please try again.
          </div>
        )}

        {!loading && (
          <div className={GRID_CLASSES}>
            {gridSlots.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
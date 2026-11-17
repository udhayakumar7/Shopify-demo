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

const GRID_CLASSES =
  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-5 lg:gap-x-6";

function CategoryCard({ item }) {
  const card = (
    <>
      {/* Same size for every card */}
      <div className="relative w-full" style={{ aspectRatio: "362 / 440" }}>
        {/* Gradient box */}
        <div
          className="absolute inset-x-0 bottom-0 top-[16%] overflow-hidden rounded-xl shadow-[0_8px_16px_-10px_rgba(0,0,0,0.45)] transition-shadow duration-500 group-hover:shadow-[0_14px_22px_-10px_rgba(0,0,0,0.5)]"
          style={{ backgroundImage: item.gradient }}
        >
          {/* Soft pattern, right side */}
          <img
            alt=""
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute -right-[18%] -top-[10%] w-[90%] opacity-20 mix-blend-screen"
            style={{
              maskImage:
                "linear-gradient(to top, transparent 0%, #000 34%), linear-gradient(to right, transparent 0%, #000 28%)",
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, #000 34%), linear-gradient(to right, transparent 0%, #000 28%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
            src="/weaves/cards/pattern.webp"
          />

          {/* Thin white inner border */}
          <div className="pointer-events-none absolute inset-x-[6%] inset-y-[7%] rounded-lg border border-white/80" />

          {/* Coming soon badge */}
          {!item.isAvailable && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-2">
              <span className="rounded-full bg-[#C5A059] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#240711] shadow-md">
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Model cutout, centered, pops above the box */}
        <img
          alt={item.name}
          loading="lazy"
          decoding="async"
          className={`pointer-events-none absolute inset-0 h-full w-full origin-bottom object-contain object-bottom drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out group-hover:scale-[1.03] ${!item.isAvailable ? "opacity-70 grayscale-[25%]" : ""
            }`}
          src={item.modelImage}
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(FALLBACK_MODEL)) {
              e.currentTarget.src = FALLBACK_MODEL;
            }
          }}
        />
      </div>

      {/* Name only */}
      <h3
        className={`mt-3 line-clamp-1 text-center font-serif text-base font-medium transition-colors sm:text-lg ${item.isAvailable
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
      className="group block w-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFF8F3]"
    >
      {card}
    </Link>
  ) : (
    <div className="group block w-full cursor-default select-none">{card}</div>
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
              <div key={i} className="space-y-3">
                <div
                  className="w-full overflow-hidden rounded-xl"
                  style={{ aspectRatio: "362 / 440" }}
                >
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex justify-center">
                  <Skeleton className="h-4 w-24" />
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
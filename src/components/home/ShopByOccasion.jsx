import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

// Existing local occasion image assets
import weddingWearImg from "../../assets/Wedding Wear.jpg";
import casualWearImg from "../../assets/Casual Wear.jpg";
import officeWearImg from "../../assets/Office Wear.jpg";
import festiveWearImg from "../../assets/Festive Wear.jpg";
import partyWearImg from "../../assets/Party Wear.jpg";

/**
 * Occasion definitions with exact Shopify custom.occasion values
 * and existing local image assets.
 */
const OCCASIONS = {
  wedding: {
    name: "Wedding Wear",
    tagline: "Royal & Timeless",
    description:
      "Grand Kanjivaram and pure mulberry silk weaves crafted with timeless zari for your most sacred moments.",
    image: weddingWearImg,
    href: "/collections/all?filter.occasion=Wedding+Wear",
  },
  rightGrid: [
    {
      name: "Casual Wear",
      image: casualWearImg,
      href: "/collections/all?filter.occasion=Casual+Wear",
    },
    {
      name: "Office Wear",
      image: officeWearImg,
      href: "/collections/all?filter.occasion=Office+Wear",
    },
    {
      name: "Festive Wear",
      image: festiveWearImg,
      href: "/collections/all?filter.occasion=Festive+Wear",
    },
    {
      name: "Party Wear",
      image: partyWearImg,
      href: "/collections/all?filter.occasion=Party+Wear",
    },
  ],
};

/**
 * Shop By Occasion – Static 2-Column Masonry Grid
 *
 * Desktop Layout:
 * - 2 columns
 * - Left column: Wedding Wear (spans full height)
 * - Right column: 4 smaller images in a 2-column x 2-row grid:
 *     Row 1: Casual Wear, Office Wear
 *     Row 2: Festive Wear, Party Wear
 *
 * Mobile Layout:
 * - Responsive grid: Wedding Wear full width, remaining 4 in a 2-column grid.
 *
 * Features:
 * - Pure CSS Grid stretching (no sliders, dynamic shifts, or carousels)
 * - Exact filter URL navigation (/collections/all?filter.occasion=...)
 * - Preserves existing Storefront API filtering, sorting, and pagination
 */
export default function ShopByOccasion() {
  const { wedding, rightGrid } = OCCASIONS;

  return (
    <section
      aria-label="Shop by Occasion"
      className="w-full border-t border-[#EADBCE] bg-[#FFF8F3] py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,4rem)]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-14 flex flex-col items-center text-center">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-white text-[#7B1E3A] border border-[#EADBCE] shadow-2xs mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>Curated Moments</span>
          </div>

          {/* Heading in Fraunces serif */}
          <h2
            className="font-head text-3xl sm:text-4xl lg:text-5xl font-medium text-[#380C19] tracking-tight mb-2.5"
            style={{ fontFamily: 'var(--font-head, "Fraunces", serif)' }}
          >
            Shop by Occasion
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#8A7B78] max-w-lg mx-auto">
            Find the perfect outfit for every moment.
          </p>
        </div>

        {/* Static Masonry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Left Column: Wedding Wear (Large Full-Height Card) */}
          <div className="h-full w-full">
            <Link
              to={wedding.href}
              className="group relative flex flex-col justify-end h-full w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-shadow"
              aria-label={`Shop ${wedding.name}`}
            >
              <img
                src={wedding.image}
                alt={wedding.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 group-hover:from-black/90 transition-all duration-300" />

              {/* Card Content */}
              <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col items-start">
                <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#C5A059] mb-1.5">
                  {wedding.tagline}
                </span>

                <h3
                  className="font-head text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-tight"
                  style={{ fontFamily: 'var(--font-head, "Fraunces", serif)' }}
                >
                  {wedding.name}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#F4DCD6]/90 line-clamp-2 max-w-md">
                  {wedding.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#F4DCD6] group-hover:text-white transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column: 2-column x 2-row Grid (Casual, Office, Festive, Party) */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 h-full w-full">
            {rightGrid.map((item) => (
              <div key={item.name} className="h-full w-full">
                <Link
                  to={item.href}
                  className="group relative flex flex-col justify-end h-full w-full min-h-[190px] sm:min-h-[250px] lg:min-h-[270px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-shadow"
                  aria-label={`Shop ${item.name}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/85 transition-all duration-300" />

                  {/* Card Content */}
                  <div className="relative z-10 p-4 sm:p-5 lg:p-6 flex flex-col items-start">
                    <h3
                      className="font-head text-lg sm:text-xl lg:text-2xl font-normal text-white tracking-tight group-hover:text-[#F4DCD6] transition-colors leading-snug"
                      style={{
                        fontFamily: 'var(--font-head, "Fraunces", serif)',
                      }}
                    >
                      {item.name}
                    </h3>

                    <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#F4DCD6]/90 group-hover:text-white transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

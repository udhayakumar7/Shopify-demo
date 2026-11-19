import React from "react";
import { Link } from "react-router-dom";
import { PROMOTIONAL_BANNERS } from "../../config/banners";
import { ArrowUpRight } from "lucide-react";

/* Large mandala / kolam-style ornament */
function Mandala({ className = "" }) {
  const petals = Array.from({ length: 16 });
  const dots = Array.from({ length: 32 });
  return (
    <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="190" strokeWidth="1" />
      <circle cx="200" cy="200" r="172" strokeWidth="0.6" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="120" strokeWidth="1" />
      <circle cx="200" cy="200" r="60" strokeWidth="1" />
      <circle cx="200" cy="200" r="14" strokeWidth="1.2" />
      {petals.map((_, i) => (
        <g key={i} transform={`rotate(${(360 / 16) * i} 200 200)`}>
          <path d="M200 30 C 218 70, 218 100, 200 128 C 182 100, 182 70, 200 30 Z" strokeWidth="1" />
          <path d="M200 140 C 210 160, 210 176, 200 190 C 190 176, 190 160, 200 140 Z" strokeWidth="0.8" />
        </g>
      ))}
      {dots.map((_, i) => {
        const a = (Math.PI * 2 * i) / 32;
        return (
          <circle key={i} cx={200 + Math.cos(a) * 150} cy={200 + Math.sin(a) * 150} r="2.2" fill="currentColor" stroke="none" />
        );
      })}
    </svg>
  );
}

/* Repeating paisley pattern for the background */
function PaisleyPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full text-[#C5A059] opacity-[0.07]" aria-hidden="true">
      <defs>
        <pattern id="paisley" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M40 12 C 58 12, 64 32, 52 46 C 44 56, 28 56, 24 44 C 22 36, 30 30, 36 34 C 40 36, 38 42, 34 42"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="40" cy="22" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#paisley)" />
    </svg>
  );
}

/* Small lotus divider */
function Lotus({ className = "" }) {
  return (
    <svg viewBox="0 0 120 40" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden="true">
      <path d="M60 6 C 70 14, 70 28, 60 36 C 50 28, 50 14, 60 6 Z" />
      <path d="M60 36 C 44 34, 36 24, 38 14 C 48 16, 56 24, 60 36 Z" />
      <path d="M60 36 C 76 34, 84 24, 82 14 C 72 16, 64 24, 60 36 Z" />
      <path d="M2 38 H 36 M 84 38 H 118" />
    </svg>
  );
}

export default function PromotionalBanners() {
  const bridalEdit = PROMOTIONAL_BANNERS?.bridalEdit || {
    tag: "The Bridal Edit",
    title: "Made for Your Forever.",
    description:
      "Celebrate life's most beautiful beginnings with exquisite silk sarees, timeless craftsmanship and the richness of traditional zari.",
    ctaText: "Explore the Collection",
    ctaLink: "/collections/silk-sarees",
    offer: "Up to 20% Off",
  };

  return (
    <section className="my-14 sm:my-20 lg:my-24 px-3 sm:px-6">
      <div className="relative max-w-[1700px] mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#380C19] via-[#5A1229] to-[#7B1E3A] text-[#FAF7F2]">
        <PaisleyPattern />

        {/* Glow */}
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[#C5A059]/20 blur-3xl" />

        {/* Mandala (big, right) */}
        <Mandala className="absolute -right-24 sm:-right-10 lg:right-10 top-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] lg:w-[560px] text-[#C5A059]/50 animate-[spin_90s_linear_infinite]" />

        {/* Gold frame */}
        <div className="absolute inset-3 sm:inset-5 rounded-[1.5rem] border border-[#C5A059]/40 pointer-events-none" />

        <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 lg:px-24 lg:py-28 max-w-3xl">
          <Lotus className="w-24 text-[#E8C987] mb-6" />

          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#E8C987]">
            {bridalEdit.tag}
          </span>

          <h2 className="mt-4 font-serif text-4xl sm:text-6xl xl:text-7xl leading-[1.08] font-normal">
            {bridalEdit.title}
          </h2>

          <p className="mt-6 text-sm sm:text-base leading-8 text-[#E6D2D0]/85 max-w-lg">
            {bridalEdit.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              to={bridalEdit.ctaLink}
              className="group inline-flex items-center gap-4 rounded-full bg-[#C5A059] hover:bg-[#D9B878] text-[#240711] pl-7 pr-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300"
            >
              {bridalEdit.ctaText}
              <span className="w-9 h-9 rounded-full bg-[#380C19] text-[#E8C987] flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight size={17} />
              </span>
            </Link>


          </div>
        </div>

        {/* Offer badge */}
        {bridalEdit.offer && (
          <div className="absolute top-8 right-8 sm:top-12 sm:right-14 z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#C5A059] text-[#240711] flex flex-col items-center justify-center text-center rotate-12 shadow-xl border-4 border-[#380C19]/30">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">Festive Offer</span>
            <span className="font-serif text-sm sm:text-lg leading-tight px-2">{bridalEdit.offer}</span>
          </div>
        )}
      </div>
    </section>
  );
}
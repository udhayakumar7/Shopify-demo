import React from "react";
import { Link } from "react-router-dom";
import { PROMOTIONAL_BANNERS } from "../../config/banners";
import Button from "../common/Button";
import { Sparkles, ArrowRight, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import cardTexture from "../../assets/card-texture.webp";

export default function PromotionalBanners() {
  const bridalEdit = PROMOTIONAL_BANNERS?.bridalEdit || {
    tag: "Heirloom Edition",
    title: "The Royal Bridal Sanctuary",
    description:
      "Celebrate sacred vows in pure mulberry silk enriched with authentic silver and gold dipped zari threads. Each piece is authenticated with the Silk Mark of India.",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    alt: "Intricate red and gold zari silk saree fabric closeup",
    ctaText: "Discover Bridal Weaves",
    ctaLink: "/collections/silk-sarees",
  };

  return (
    <section
      aria-label="Promotional Bridal Showcase"
      className="w-full relative overflow-hidden bg-[#240711] my-12 sm:my-16 lg:my-20"
      style={{
        backgroundImage: `url(${cardTexture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle gold accent zari border at top & bottom */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#240711]/95 via-[#380C19]/85 to-[#240711]/90 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Fluid container: spans full width, padding scales smoothly with viewport */}
      <div className="relative w-full max-w-[1920px] mx-auto px-[clamp(1rem,4vw,4rem)] py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Editorial Story Column */}
          <div className="lg:col-span-7 text-[#FFF8F3] space-y-6 sm:space-y-7">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{bridalEdit.tag}</span>
            </div>

            {/* Serif Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.2] text-[#FFF8F3]">
              {bridalEdit.title}
            </h2>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base text-[#F4DCD6] font-light leading-relaxed max-w-2xl">
              {bridalEdit.description}
            </p>

            {/* Heritage Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-black/30 border border-[#C5A059]/30 backdrop-blur-xs">
                <Award className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="text-xs text-[#FFF8F3] font-medium tracking-wide">
                  Pure Silk Mark
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-black/30 border border-[#C5A059]/30 backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="text-xs text-[#FFF8F3] font-medium tracking-wide">
                  Gold Dipped Zari
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-black/30 border border-[#C5A059]/30 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="text-xs text-[#FFF8F3] font-medium tracking-wide">
                  Complimentary Tassels
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to={bridalEdit.ctaLink}>
                <Button variant="secondary" size="lg" className="group shadow-xl">
                  <span>{bridalEdit.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#C5A059]/50 text-[#FFF8F3] hover:bg-[#C5A059]/15 hover:border-[#C5A059]"
                >
                  <span>Explore All Drapes</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-2xl bg-[#240711] group">
              {/* Inner Decorative Border Frame */}
              <div className="absolute inset-2.5 rounded-xl border border-[#C5A059]/30 pointer-events-none z-10" />

              {/* Showcase Image */}
              <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden">
                <img
                  src={bridalEdit.image}
                  alt={bridalEdit.alt}
                  className="w-full h-full object-cover object-center filter brightness-[0.92] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#240711]/90 via-transparent to-black/10" />
              </div>

              {/* Floating Hallmark Card */}
              <div className="absolute bottom-5 inset-x-5 bg-[#240711]/90 backdrop-blur-md border border-[#C5A059]/40 rounded-xl p-3.5 sm:p-4 shadow-xl z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#FFF8F3] tracking-wide">
                      Silk Mark Certified
                    </p>
                    <p className="text-[11px] text-[#C5A059]">
                      100% Genuine Mulberry Silk
                    </p>
                  </div>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#240711] bg-[#C5A059] px-2.5 py-1 rounded shadow-sm">
                  Heirloom
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

import { HERO_BANNERS } from "../../config/banners";
import Button from "../common/Button";

export default function HeroBanner() {
  const banner = HERO_BANNERS[0];

  if (!banner) return null;

  return (
    <section
      className="
        relative flex w-full items-center overflow-hidden bg-[#380C19]
        min-h-[clamp(460px,75vh,680px)]
      "
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 640px)" srcSet={banner.mobileImage} />
          <img
            src={banner.desktopImage}
            alt={banner.alt}
            className="h-full w-full object-cover object-center lg:object-right"
            loading="eager"
          />
        </picture>

        {/* Left overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#380C19]/85 via-[#380C19]/55 via-55% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#380C19]/30 via-transparent to-transparent" />
      </div>

      {/* Fluid container: same side padding as the sections below,
          so the hero text lines up with the page content edge */}
      <div
        className="
          relative z-10 mx-auto w-full max-w-[1920px]
          px-[clamp(1rem,4vw,4rem)]
          py-[clamp(2.5rem,7vw,5rem)]
        "
      >
        <div className="max-w-[clamp(20rem,48vw,38rem)] text-left text-[#FFF8F3]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="
              mb-5 inline-flex items-center gap-2 rounded-full
              border border-[#C5A059]/50 bg-[#C5A059]/15
              px-3.5 py-1.5 text-xs font-semibold uppercase
              tracking-[0.14em] text-[#E3C583] backdrop-blur-sm sm:text-[12px]
            "
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{banner.badge}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
              mb-4 font-serif font-medium leading-[1.1] tracking-tight text-white
              text-[clamp(2.25rem,5vw,4rem)]
            "
          >
            {banner.title}
          </motion.h1>

          {/* Gold line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 56 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-5 h-[3px] bg-[#C5A059]"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="
              mb-8 max-w-md text-base font-normal leading-relaxed
              text-[#F1E4DC] sm:text-lg
            "
          >
            {banner.subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link to={banner.ctaLink}>
              <Button
                variant="secondary"
                size="lg"
                className="
                  group shadow-md transition-all duration-300
                  !bg-[#C5A059] !px-6 !py-3 !text-sm !font-semibold !text-[#280711]
                  hover:!bg-[#DFC17F] sm:!text-base
                "
              >
                <span>{banner.ctaText}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link to={banner.secondaryCtaLink}>
              <Button
                variant="goldOutline"
                size="lg"
                className="
                  backdrop-blur-sm transition-all duration-300
                  !border-[#C5A059]/80 !bg-white/5 !px-6 !py-3 !text-sm !font-semibold !text-[#FFF8F3]
                  hover:!bg-[#FFF8F3] hover:!text-[#380C19] sm:!text-base
                "
              >
                {banner.secondaryCtaText}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
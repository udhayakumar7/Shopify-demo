import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

import { HERO_BANNERS } from "../../config/banners";
import Button from "../common/Button";
import BannerImage from "../../assets/banner.webp"

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
            src={BannerImage}
            alt={banner.alt}
            className="h-full w-full object-cover object-center lg:object-right"
            loading="eager"
          />
        </picture>

        {/* Left overlay for text readability */}

      </div>

      {/* Fluid container: same side padding as the sections below,
          so the hero text lines up with the page content edge */}

    </section>
  );
}
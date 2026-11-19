
import React from "react";
import {
  Sprout,
  MapPin,
  Gem,
  Truck,
  HandHeart,
} from "lucide-react";

const PROMISES = [
  {
    icon: Sprout,
    number: "01",
    title: "Weaving Since 2005",
    description: "A legacy woven with passion and tradition.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "Made in India",
    description: "Proudly celebrating India's rich textile heritage.",
  },
  {
    icon: Gem,
    number: "03",
    title: "Authentic Weaves",
    description: "Timeless craftsmanship in every thread.",
  },
  {
    icon: Truck,
    number: "04",
    title: "Express Shipping",
    description: "Beautiful traditions delivered to your doorstep.",
  },
  {
    icon: HandHeart,
    number: "05",
    title: "Hand-Picked",
    description: "Every piece chosen with care and attention.",
  },
];

export default function WhyShopWithUs() {
  return (
    <section
      id="heritage"
      className="relative overflow-hidden bg-[#fff] py-10 sm:py-12 lg:py-14"
    >
      {/* Subtle background decoration */}
      <div className="absolute -top-40 -left-32 w-72 h-72 rounded-full bg-[#C5A059]/[0.05] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-80 h-80 rounded-full bg-[#7B1E3A]/[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">

          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-8 h-px bg-[#C5A059]" />

            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A17B43]">
              Our Promise To You
            </span>

            <span className="w-8 h-px bg-[#C5A059]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] text-[#380C19] leading-tight tracking-tight"
            style={{
              fontFamily: 'var(--font-head, "Fraunces", serif)',
            }}
          >
            The Harini Heritage
            <span className="block italic text-[#A17B43] mt-0.5">
              Promise
            </span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#81736E] leading-6">
            More than just sarees, we bring you a legacy of artistry,
            authenticity and timeless elegance.
          </p>
        </div>

        {/* Promise cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">

          {PROMISES.map(({ icon: Icon, number, title, description }) => (
            <div
              key={number}
              className="group relative bg-white border border-[#EADBCE] rounded-xl p-4 sm:p-5 lg:p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(56,12,25,0.07)] hover:border-[#C5A059]/60"
            >
              {/* Number */}
              <span className="absolute top-3 right-3 text-[9px] tracking-widest text-[#C5A059]/70">
                {number}
              </span>

              {/* Icon */}
              <div className="mx-auto mb-4 w-14 h-14 rounded-full border border-[#C5A059]/50 flex items-center justify-center bg-[#FAF7F2] transition-all duration-300 group-hover:bg-[#7B1E3A] group-hover:border-[#7B1E3A]">
                <Icon
                  size={25}
                  strokeWidth={1.3}
                  className="text-[#7B1E3A] transition-colors duration-300 group-hover:text-[#F4DDAA]"
                />
              </div>

              {/* Decorative line */}
              <div className="w-7 h-px bg-[#C5A059] mx-auto mb-3 transition-all duration-300 group-hover:w-11" />

              <h3
                className="text-xs sm:text-sm font-semibold text-[#380C19] leading-snug mb-1.5"
                style={{
                  fontFamily: 'var(--font-head, "Fraunces", serif)',
                }}
              >
                {title}
              </h3>

              <p className="text-[10px] sm:text-[11px] text-[#8A7B78] leading-relaxed">
                {description}
              </p>
            </div>
          ))}

        </div>

        {/* Bottom statement */}
        <div className="mt-7 sm:mt-9 flex items-center justify-center gap-3 text-center">
          <span className="w-6 sm:w-8 h-px bg-[#C5A059]" />

          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.17em] text-[#7B1E3A] font-medium">
            Tradition in every thread. Elegance in every drape.
          </p>

          <span className="w-6 sm:w-8 h-px bg-[#C5A059]" />
        </div>

      </div>
    </section>
  );
}

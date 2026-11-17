import React from "react";
import { Award, ShieldCheck, HeartHandshake, Truck } from "lucide-react";

const VALUES = [
  {
    icon: Award,
    title: "100% Pure Silk Mark Certified",
    description: "Every saree is crafted from authentic, lab-certified mulberry silk threads, ensuring unmatched purity and heirloom longevity.",
  },
  {
    icon: HeartHandshake,
    title: "Direct from Master Weavers",
    description: "We work directly with traditional weaving families across Madurai and Kanchipuram, honouring generational artistry with fair trade.",
  },
  {
    icon: ShieldCheck,
    title: "Artisanal Finishing Included",
    description: "Complimentary soft cotton fall and hand-stitched pico border finishing with every drape, ready to wear upon arrival.",
  },
  {
    icon: Truck,
    title: "Insured Global Delivery",
    description: "Carefully wrapped in luxury keepsake boxes, tamper-proof packaging, and insured courier delivery worldwide.",
  },
];

export default function WhyShopWithUs() {
  return (
    <section id="heritage" className="py-16 sm:py-24 bg-white border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] block mb-2">
            Purity & Trust
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19] mb-3">
            The Harini Heritage Promise
          </h2>
          <p className="text-sm text-[#8A7B78] leading-relaxed">
            More than just clothing, each drape is a woven heirloom preserving sacred traditions, pure zari, and artisanal devotion.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-[#FFF8F3] border border-[#EADBCE] hover:border-[#C5A059] hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#7B1E3A] group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#380C19] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#8A7B78] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

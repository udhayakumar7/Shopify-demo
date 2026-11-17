import React from "react";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Dr. Ananya Sundaram",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    saree: "Royal Blue Kanjivaram Silk Saree",
    comment:
      "The weight of the silk and the brilliance of the gold zari border exceeded all expectations. Draped it for my sister's wedding and received non-stop compliments all evening! The fall and pico was done to perfection.",
  },
  {
    id: 2,
    name: "Meera Krishnan",
    location: "Bengaluru, Karnataka",
    rating: 5,
    saree: "Bridal Crimson Brocade Saree",
    comment:
      "Authentic pure silk feel. You can instantly distinguish real handloom work from machine-made sarees. The packaging in the keepsake box made unboxing feel like opening a treasured royal gift.",
  },
  {
    id: 3,
    name: "Pooja Radhakrishnan",
    location: "Mumbai, Maharashtra",
    rating: 5,
    saree: "Traditional Muhurtham Silk",
    comment:
      "Customer support was incredibly helpful in answering questions about blouse fabric measurements. Delivered within 3 days with insured tracking. Harini is now my family's go-to boutique.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-[#FFF8F3] border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] block mb-2">
            Words of Love
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19] mb-3">
            Treasured by Brides & Connoisseurs
          </h2>
          <p className="text-sm text-[#8A7B78]">
            Read experiences from our discerning patrons across India and abroad.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-7 rounded-xl border border-[#EADBCE] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#F4DCD6] -scale-x-100 opacity-60" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#C5A059]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#380C19] leading-relaxed mb-6 italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#EADBCE]/50">
                <p className="font-serif font-semibold text-sm text-[#521225]">
                  {review.name}
                </p>
                <p className="text-[11px] text-[#8A7B78]">{review.location}</p>
                <p className="text-[10px] text-[#C5A059] font-medium mt-1">
                  Verified Buyer • {review.saree}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

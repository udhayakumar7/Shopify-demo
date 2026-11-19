
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";
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

const SPEED = 42;

function ReviewCard({ review }) {
  return (
    <motion.article
      whileHover={{
        y: -7,
        scale: 1.015,
        transition: { duration: 0.3 },
      }}
      className="relative flex flex-col justify-between shrink-0 w-[290px] sm:w-[340px] min-h-[260px] sm:min-h-[280px] p-5 sm:p-6 bg-white border border-[#EADBCE] rounded-xl shadow-[0_3px_15px_rgba(56,12,25,0.025)] hover:border-[#C5A059]/60 hover:shadow-[0_12px_30px_rgba(56,12,25,0.08)] transition-colors duration-300"
    >
      <Quote className="absolute top-5 right-5 w-9 h-9 text-[#C5A059]/15 -scale-x-100" />

      <div>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className="fill-[#C5A059] text-[#C5A059]"
            />
          ))}

          <span className="ml-2 text-[10px] font-medium text-[#A17B43]">
            Excellent
          </span>
        </div>

        {/* Comment */}
        <p className="text-[12px] sm:text-[13px] text-[#57464A] leading-[1.85] mb-6">
          "{review.comment}"
        </p>
      </div>

      {/* Customer */}
      <div className="pt-4 border-t border-[#EADBCE]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3
              className="text-sm font-semibold text-[#380C19]"
              style={{
                fontFamily: 'var(--font-head, "Fraunces", serif)',
              }}
            >
              {review.name}
            </h3>

            <p className="text-[10px] text-[#948780] mt-1">
              {review.location}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-center text-[#A17B43] text-sm font-serif">
            {review.name.charAt(0)}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-[#A17B43] font-medium">
          {review.saree}
        </p>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const x = useMotionValue(0);
  const speedRef = useRef(SPEED);

  const shouldReduceMotion = useReducedMotion();

  // Measure one complete set of cards.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      setTrackWidth(track.scrollWidth / 2);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  // Smooth acceleration and deceleration.
  useAnimationFrame((time, delta) => {
    if (!trackWidth || shouldReduceMotion) return;

    const targetSpeed = isPaused ? 0 : SPEED;

    const smoothing = 1 - Math.exp(-delta / 350);

    speedRef.current +=
      (targetSpeed - speedRef.current) * smoothing;

    let nextX = x.get() - (speedRef.current * delta) / 1000;

    if (nextX <= -trackWidth) {
      nextX += trackWidth;
    }

    x.set(nextX);
  });

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] py-10 sm:py-12 lg:py-14 border-b border-[#EADBCE]">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-9 sm:mb-11">

        <div className="text-center max-w-2xl mx-auto">

          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-8 h-px bg-[#C5A059]" />

            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A17B43]">
              Words of Love
            </span>

            <span className="w-8 h-px bg-[#C5A059]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] text-[#380C19] leading-tight"
            style={{
              fontFamily: 'var(--font-head, "Fraunces", serif)',
            }}
          >
            Loved, Worn &
            <span className="block italic text-[#A17B43] mt-0.5">
              Remembered.
            </span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#81736E] leading-6">
            Every saree carries a story. Here are a few beautiful
            moments shared by our customers.
          </p>
        </div>
      </div>

      {/* Infinite marquee */}
      <div
        className="relative w-full overflow-hidden"
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        <motion.div
          ref={trackRef}
          style={{
            x: shouldReduceMotion ? 0 : x,
          }}
          className="flex w-max gap-4 sm:gap-5 px-3 sm:px-5 py-3"
        >
          {/* First set */}
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* Duplicate set for seamless looping */}
          {REVIEWS.map((review) => (
            <div
              key={`duplicate-${review.id}`}
              aria-hidden="true"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </motion.div>

        {/* Soft smoke / fade edges */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24 lg:w-36"
          style={{
            background:
              "linear-gradient(to right, #FAF7F2 0%, rgba(250,247,242,0.85) 35%, rgba(250,247,242,0) 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24 lg:w-36"
          style={{
            background:
              "linear-gradient(to left, #FAF7F2 0%, rgba(250,247,242,0.85) 35%, rgba(250,247,242,0) 100%)",
          }}
        />
      </div>

      {/* Footer */}
      <div className="mt-7 sm:mt-9 flex items-center justify-center gap-3 px-4">
        <span className="w-7 h-px bg-[#C5A059]" />

        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#7B1E3A] font-medium text-center">
          Your love makes our legacy beautiful
        </p>

        <span className="w-7 h-px bg-[#C5A059]" />
      </div>

    </section>
  );
}

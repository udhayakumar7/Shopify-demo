import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { FaInstagram } from "react-icons/fa6";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { INSTAGRAM_POSTS } from "../../config/banners";
import { SITE_CONFIG } from "../../config/site";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Turn any post/reel link into its official embed URL */
function toEmbedUrl(url = "") {
  const clean = url.split("?")[0].replace(/\/+$/, "");
  return `${clean}/embed`;
}

function InstagramEmbedCard({ url, index }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative mx-auto w-full max-w-[400px] rounded-lg overflow-hidden bg-white border border-[#EADBCE] shadow-sm hover:shadow-lg hover:border-[#C5A059] transition-all duration-500"
    >
      <iframe
        src={toEmbedUrl(url)}
        title={`Instagram post ${index + 1}`}
        loading="lazy"
        scrolling="no"
        allowTransparency="true"
        className="block w-full h-[540px] sm:h-[560px] border-0"
      />
    </motion.div>
  );
}

export default function SocialGallery() {
  const posts = INSTAGRAM_POSTS || [];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] py-12 sm:py-16 lg:py-20 border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          className="text-center max-w-2xl mx-auto mb-9 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#C5A059]" />
            <FaInstagram className="w-4 h-4 text-[#A17B43]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A17B43]">
              Follow Our Journey
            </span>
            <span className="w-8 h-px bg-[#C5A059]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[46px] text-[#380C19] leading-tight"
            style={{ fontFamily: 'var(--font-head, "Fraunces", serif)' }}
          >
            The Silk
            <span className="italic text-[#A17B43] ml-2">Lookbook.</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#81736E] leading-6">
            A glimpse into our world of timeless weaves, beautiful drapes and
            moments worth celebrating.
          </p>

          <p className="mt-2 text-xs text-[#7B1E3A]">
            Share your style with{" "}
            <a
              href={SITE_CONFIG.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="font-semibold hover:text-[#A17B43] transition-colors"
            >
              @harinisarees
            </a>
          </p>
        </motion.div>

        {/* Real Instagram posts */}
        {posts.length > 0 ? (
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          >
            {posts.map((url, index) => (
              <InstagramEmbedCard key={url} url={url} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-sm text-[#8A7B78]">
            Our lookbook is coming soon.
          </div>
        )}

        {/* Instagram CTA */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="mt-10 sm:mt-14 text-center"
        >
          <a
            href={SITE_CONFIG.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-[#7B1E3A] text-white rounded-sm text-[10px] sm:text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#380C19] transition-all duration-300 hover:shadow-lg hover:shadow-[#7B1E3A]/15 group"
          >
            <FaInstagram size={16} />
            Follow @harinisarees
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>

          <div className="mt-5 flex items-center justify-center gap-2 text-[#A17B43]">
            <Sparkles size={12} strokeWidth={1.3} />
            <p className="text-[9px] uppercase tracking-[0.2em]">Tag us to be featured</p>
            <Sparkles size={12} strokeWidth={1.3} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
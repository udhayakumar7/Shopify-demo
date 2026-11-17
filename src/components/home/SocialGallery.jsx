import React from "react";
import { INSTAGRAM_GALLERY } from "../../config/banners";
import { FaInstagram } from "react-icons/fa6";
import { SITE_CONFIG } from "../../config/site";

export default function SocialGallery() {
  const posts = INSTAGRAM_GALLERY || [];
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C5A059] mb-2">
            <FaInstagram className="w-3.5 h-3.5" />
            <span>#HariniSarees</span>
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#380C19] mb-2">
            The Silk Lookbook
          </h2>
          <p className="text-xs sm:text-sm text-[#8A7B78]">
            Tag <span className="font-semibold text-[#7B1E3A]">@harinisarees</span> on Instagram to be featured in our royal heritage gallery.
          </p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={SITE_CONFIG.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-[#F4DCD6]/30 border border-[#EADBCE]"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#380C19]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                <FaInstagram className="w-6 h-6 text-[#C5A059] mb-2" />
                <p className="text-[11px] font-light line-clamp-3 text-[#EADBCE]">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

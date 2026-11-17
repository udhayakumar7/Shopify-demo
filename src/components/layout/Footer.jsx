import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
} from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa6";
import { SITE_CONFIG } from "../../config/site";
import { FOOTER_LINKS } from "../../config/navigation";

export default function Footer() {
  return (
    <footer className="bg-[#380C19] text-[#FFF8F3] border-t border-[#C5A059]/40 mt-auto">
      {/* Trust Badges Ribbon */}
      <div className="border-b border-[#521225] py-8 bg-[#2A0711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-2">
              <Award className="w-6 h-6 text-[#C5A059]" />
              <h4 className="font-serif text-sm font-semibold text-white">Silk Mark Certified</h4>
              <p className="text-xs text-[#EADBCE]/70">100% Guaranteed Pure Handloom Silk</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <Truck className="w-6 h-6 text-[#C5A059]" />
              <h4 className="font-serif text-sm font-semibold text-white">Free Insured Shipping</h4>
              <p className="text-xs text-[#EADBCE]/70">Across India on orders over ₹2,999</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              <h4 className="font-serif text-sm font-semibold text-white">Secure Shopify Checkout</h4>
              <p className="text-xs text-[#EADBCE]/70">256-bit SSL encrypted transactions</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <RotateCcw className="w-6 h-6 text-[#C5A059]" />
              <h4 className="font-serif text-sm font-semibold text-white">Artisanal Support</h4>
              <p className="text-xs text-[#EADBCE]/70">Complimentary fall, pico & tassels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Dummy Contact (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="font-serif text-2xl font-bold tracking-widest text-[#FFF8F3] uppercase">
                {SITE_CONFIG.name}
              </h3>
              <p className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-medium">
                Madurai • Pure Silk Heritage
              </p>
            </Link>

            <p className="text-xs sm:text-sm text-[#EADBCE]/80 leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>

            {/* Centralized Contact Information with Note */}
            <div className="pt-2 space-y-2.5 text-xs text-[#EADBCE]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.address.formatted}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.contact.phone}`}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{SITE_CONFIG.contact.hours}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#521225] hover:bg-[#C5A059] text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#521225] hover:bg-[#C5A059] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059] uppercase mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EADBCE]/80">
              {FOOTER_LINKS.shop.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="hover:text-[#C5A059] hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059] uppercase mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EADBCE]/80">
              {FOOTER_LINKS.customerCare.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="hover:text-[#C5A059] hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Policies Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059] uppercase mb-4">
              Our Heritage & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EADBCE]/80">
              {FOOTER_LINKS.about.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="hover:text-[#C5A059] hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Copyright */}
      <div className="border-t border-[#521225] py-6 bg-[#20050D] text-[11px] text-[#EADBCE]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved. Handcrafted with pride in Tamil Nadu, India.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#C5A059]">Shopify Storefront Headless</span>
            <span>•</span>
            <span>Verified 256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

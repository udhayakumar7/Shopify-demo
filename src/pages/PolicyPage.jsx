import React, { useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { SITE_CONFIG } from "../config/site";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Award,
} from "lucide-react";

const POLICIES = {
  about: {
    title: "About Harini Sarees",
    badge: "Our Artisanal Heritage",
    icon: Award,
    description: "Centuries of South Indian handloom mastery woven into timeless silk drapes and contemporary silhouettes.",
    content: (
      <div className="space-y-6 text-sm sm:text-base text-[#521225] leading-relaxed">
        <p>
          Founded with a devotion to preserving ancient South Indian weaving traditions, <strong>Harini Sarees</strong> brings the sacred artistry of master weavers directly to connoisseurs of authentic handloom silk and artisanal ethnic wear worldwide.
        </p>
        <h3 className="font-serif text-xl text-[#380C19] pt-2">The Handloom Legacy</h3>
        <p>
          Every Harini saree is an heirloom crafted on traditional pit and frame handlooms. From the temple borders of Kanchipuram and the imperial brocades of Banaras to the lightweight breathable weaves of our contemporary Kurti collection, our garments represent hundreds of hours of painstaking artisanal dedication.
        </p>
        <h3 className="font-serif text-xl text-[#380C19] pt-2">Silk Mark Authenticity</h3>
        <p>
          We are committed to uncompromising purity. All pure silk creations are certified under the Silk Mark Scheme of India, guaranteeing 100% natural mulberry silk warp and weft woven with genuine gold and silver electroplated zari.
        </p>
        <div className="p-4 bg-[#F4DCD6]/40 rounded-xl border border-[#EADBCE] text-xs text-[#8A7B78]">
          <strong>Artisanal Note:</strong> Minor irregularities in weave texture, zari knots, or subtle dyeing variations are intrinsic hallmarks of genuine handwoven craftsmanship, not manufacturing flaws.
        </div>
      </div>
    ),
  },

  contact: {
    title: "Contact Us",
    badge: "Concierge Assistance",
    icon: Mail,
    description: "Our dedicated styling advisors and customer care concierge are here to assist with custom orders, sizing, and styling advice.",
    content: (
      <div className="space-y-6 text-sm text-[#521225]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#FFF8F3] border border-[#EADBCE] space-y-2">
            <div className="flex items-center gap-2 text-[#7B1E3A] font-semibold text-sm">
              <Phone className="w-4 h-4" />
              <span>Customer Helpline</span>
            </div>
            <p className="text-base font-bold text-[#380C19]">{SITE_CONFIG.contact.phone}</p>
            <p className="text-xs text-[#8A7B78]">{SITE_CONFIG.contact.hours}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFF8F3] border border-[#EADBCE] space-y-2">
            <div className="flex items-center gap-2 text-[#7B1E3A] font-semibold text-sm">
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </div>
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="text-base font-bold text-[#7B1E3A] hover:underline block"
            >
              {SITE_CONFIG.contact.email}
            </a>
            <p className="text-xs text-[#8A7B78]">Response within 24 business hours</p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFF8F3] border border-[#EADBCE] space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-[#7B1E3A] font-semibold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Boutique & Design Studio</span>
            </div>
            <p className="text-sm font-medium text-[#380C19]">{SITE_CONFIG.contact.address.formatted}</p>
            <p className="text-xs text-[#8A7B78]">
              Personal styling visits and bridal trousseau consultations by prior appointment.
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#EADBCE] space-y-3">
          <h4 className="font-serif text-lg text-[#380C19]">Need Quick Guidance?</h4>
          <p className="text-xs text-[#8A7B78] leading-relaxed">
            For questions about existing orders, please log in to your <Link to="/account" className="text-[#7B1E3A] font-semibold underline">Customer Account</Link> to view real-time courier tracking and shipping updates.
          </p>
        </div>
      </div>
    ),
  },

  shipping: {
    title: "Shipping & Delivery Policy",
    badge: "Insured Air Transit",
    icon: Truck,
    description: "Insured, tamper-evident courier dispatch across India and select international destinations.",
    content: (
      <div className="space-y-5 text-sm sm:text-base text-[#521225] leading-relaxed">
        <h3 className="font-serif text-xl text-[#380C19]">1. Domestic Shipping Across India</h3>
        <p>
          We offer <strong>Complimentary Insured Shipping</strong> on all domestic prepaid orders over ₹2,999. Orders below ₹2,999 are subject to a nominal standard shipping fee of ₹150.
        </p>
        <h3 className="font-serif text-xl text-[#380C19]">2. Processing & Dispatch Timelines</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[#521225]">
          <li><strong>Ready to Ship Sarees & Kurtis:</strong> Dispatched within 24 to 48 hours of order confirmation.</li>
          <li><strong>Custom Fall & Pico Stitching:</strong> Adds 1 additional business day for precision hand-finishing.</li>
          <li><strong>Transit Time:</strong> 2 to 5 business days across tier-1 and metro cities; 4 to 7 business days for regional pin codes.</li>
        </ul>
        <h3 className="font-serif text-xl text-[#380C19]">3. Luxury Keepsake Packaging</h3>
        <p>
          Every Harini drape is steam-pressed and packaged in our signature luxury rigid keepsake box with acid-free tissue paper wrap and a tamper-evident holographic security seal to ensure pristine arrival.
        </p>
      </div>
    ),
  },

  refund: {
    title: "Return & Refund Policy",
    badge: "7-Day Exchange Window",
    icon: RotateCcw,
    description: "Clear guidelines on returns, exchanges, and craftsmanship authenticity verification.",
    content: (
      <div className="space-y-5 text-sm sm:text-base text-[#521225] leading-relaxed">
        <h3 className="font-serif text-xl text-[#380C19]">1. 7-Day Exchange Policy</h3>
        <p>
          We want you to treasure your handcrafted piece. If you wish to exchange a kurti for a different size or select an alternate saree, you may request an exchange within <strong>7 days</strong> of delivery.
        </p>
        <h3 className="font-serif text-xl text-[#380C19]">2. Conditions for Return / Exchange</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[#521225]">
          <li>The garment must be unworn, unwashed, and unpleated with all original brand tags, Silk Mark tags, and security seals intact.</li>
          <li>Items with custom-stitched blouses, cut fabrics, or altered falls are non-returnable.</li>
          <li>The item must be returned in its original rigid gift box to prevent fabric damage during return transit.</li>
        </ul>
        <h3 className="font-serif text-xl text-[#380C19]">3. Refund Processing</h3>
        <p>
          Upon inspection and approval at our quality inspection facility, refunds are credited back to the original payment source within 5 to 7 business days. Store credit options are also available for immediate exchange reorders.
        </p>
      </div>
    ),
  },

  privacy: {
    title: "Privacy Policy",
    badge: "Data Protection",
    icon: ShieldCheck,
    description: "How Harini Sarees collects, protects, and handles customer personal data in accordance with Indian IT and DPDP regulations.",
    content: (
      <div className="space-y-5 text-sm sm:text-base text-[#521225] leading-relaxed">
        <h3 className="font-serif text-xl text-[#380C19]">1. Information We Collect</h3>
        <p>
          When you place an order, create an account, or browse our website, we collect necessary contact information (name, delivery address, phone number, and email address). Payment processing is conducted exclusively through certified PCI-DSS compliant Shopify checkout gateways; we never store your credit card or UPI credentials on our servers.
        </p>
        <h3 className="font-serif text-xl text-[#380C19]">2. Use of Information</h3>
        <p>
          Your information is used strictly to fulfill orders, provide courier transit notifications, and handle customer service inquiries. We never sell, lease, or monetize your personal details to third-party marketing brokers.
        </p>
        <h3 className="font-serif text-xl text-[#380C19]">3. Cookies & Session Storage</h3>
        <p>
          We use browser storage strictly for session authentication, maintaining your shopping bag, and remembering wishlisted items.
        </p>
      </div>
    ),
  },

  terms: {
    title: "Terms of Service",
    badge: "Store Terms",
    icon: FileText,
    description: "Terms and conditions governing orders, intellectual property, pricing, and purchase contracts at Harini Sarees.",
    content: (
      <div className="space-y-5 text-sm sm:text-base text-[#521225] leading-relaxed">
        <h3 className="font-serif text-xl text-[#380C19]">1. Product Descriptions & Photography</h3>
        <p>
          We photograph our weaves under calibrated natural studio daylight. However, due to individual screen calibration, fabric weave iridescence (especially dual-tone shot silks), slight color variations may exist between screen rendering and physical drape.
        </p>
        <h3 className="font-serif text-xl text-[#380C19]">2. Pricing & Taxes</h3>
        <p>
          All product prices listed on the store are inclusive of applicable Goods and Services Tax (GST) as mandated by the Government of India.
        </p>
        <h3 className="font-serif text-xl text-[#380C19]">3. Intellectual Property</h3>
        <p>
          All photography, brand typography, editorial texts, and artisanal narratives are the exclusive intellectual property of Harini Sarees and may not be reproduced without prior written consent.
        </p>
      </div>
    ),
  },

  faq: {
    title: "Frequently Asked Questions",
    badge: "Help & FAQ",
    icon: HelpCircle,
    description: "Find instant answers to common questions about our handloom silks, stitching services, sizing, and shipping.",
    content: (
      <div className="space-y-4">
        {[
          {
            q: "How do I know my saree is genuine handloom silk?",
            a: "Every pure silk saree in our collection carries an authentic Silk Mark certification tag issued by the Silk Mark Organisation of India (SMOI), verifying 100% natural mulberry silk content.",
          },
          {
            q: "Are Fall and Pico services included?",
            a: "Yes! Complimentary premium fall stitching, edge pico, and traditional hand-tied pallu tassels are provided complimentary on all full-priced sarees.",
          },
          {
            q: "How do I choose the correct Kurti size?",
            a: "Refer to the interactive Size Guide modal available on every Kurti product page. We recommend measuring your bust and choosing 1 to 2 inches of ease for an elegant relaxed Indian ethnic drape.",
          },
          {
            q: "How do I track my dispatched order?",
            a: "Once dispatched, you will receive an SMS and email notification with your Air Waybill (AWB) number and direct courier tracking link. You can also monitor your package directly from your Customer Account page.",
          },
          {
            q: "How should I care for my silk sarees?",
            a: "Pure silk weaves must be dry-cleaned only. Store them wrapped in breathable, unbleached cotton or muslin saree covers. Avoid plastic covers and direct contact with perfumes on zari work.",
          },
        ].map((item, index) => (
          <div key={index} className="p-4 rounded-xl bg-white border border-[#EADBCE] space-y-1.5 shadow-2xs">
            <h4 className="font-serif text-base font-semibold text-[#380C19]">{item.q}</h4>
            <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  },
};

export default function PolicyPage({ defaultType = null }) {
  const { type: paramType } = useParams();
  const location = useLocation();

  // Determine active key from props, route params, or pathname
  const activeKey = useMemo(() => {
    if (defaultType) return defaultType;
    if (paramType) return paramType.toLowerCase();
    const pathname = location.pathname.toLowerCase();
    if (pathname.includes("about")) return "about";
    if (pathname.includes("contact")) return "contact";
    if (pathname.includes("faq")) return "faq";
    if (pathname.includes("privacy")) return "privacy";
    if (pathname.includes("refund") || pathname.includes("return")) return "refund";
    if (pathname.includes("shipping")) return "shipping";
    if (pathname.includes("terms")) return "terms";
    return "about";
  }, [defaultType, paramType, location.pathname]);

  const activePolicy = POLICIES[activeKey] || POLICIES.about;
  const Icon = activePolicy.icon;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = `${activePolicy.title} | Harini Sarees`;
  }, [activePolicy]);

  const navLinks = [
    { key: "about", label: "About Us & Heritage", path: "/about" },
    { key: "contact", label: "Contact Concierge", path: "/contact" },
    { key: "faq", label: "Frequently Asked Questions", path: "/faq" },
    { key: "shipping", label: "Shipping & Delivery Policy", path: "/policies/shipping" },
    { key: "refund", label: "Return & Refund Policy", path: "/policies/refund" },
    { key: "privacy", label: "Privacy Policy", path: "/policies/privacy" },
    { key: "terms", label: "Terms of Service", path: "/policies/terms" },
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: activePolicy.title }]} />

        {/* Page Header */}
        <div className="border-b border-[#EADBCE] pb-8 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activePolicy.badge}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#380C19]">
            {activePolicy.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7B78] max-w-2xl mt-2 leading-relaxed">
            {activePolicy.description}
          </p>
        </div>

        {/* 2-Column Layout: Sidebar Nav + Policy Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-2xs space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] block px-3 pb-2 border-b border-[#EADBCE]">
              Customer Information & Trust
            </span>
            <nav className="space-y-1 pt-1">
              {navLinks.map((item) => {
                const isSelected = activeKey === item.key;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-[#7B1E3A] text-white shadow-xs"
                        : "text-[#380C19] hover:bg-[#F4DCD6]/40 hover:text-[#7B1E3A]"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Policy Content (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#EADBCE]">
              <div className="p-2.5 rounded-xl bg-[#F4DCD6] text-[#7B1E3A]">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#380C19]">
                  {activePolicy.title}
                </h2>
                <span className="text-[11px] text-[#8A7B78]">
                  Harini Sarees • Official Store Policy
                </span>
              </div>
            </div>

            {/* Dynamic Content */}
            {activePolicy.content}
          </div>
        </div>
      </div>
    </div>
  );
}

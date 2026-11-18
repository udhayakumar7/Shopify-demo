import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronDown,
  Heart,
  User,
  ShoppingBag,
  Phone,
  Mail,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { SITE_CONFIG } from "../../config/site";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";

/**
 * Mobile slide-out navigation drawer with simple expandable text accordions
 * for Sarees and Kurtis powered dynamically by Shopify Storefront collections.
 */
export default function MobileMenu({
  isOpen,
  onClose,
  sareeCollections = [],
  kurtiCollections = [],
  loadingCollections = false,
}) {
  const { totalItems: wishlistCount } = useWishlist();
  const { totalQuantity, openCart } = useCart();

  // Expanded accordion sections: "sarees" | "kurtis" | null
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionKey) => {
    setExpandedSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  const handleNavClick = () => {
    onClose();
  };

  const handleCartClick = () => {
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#380C19]/60 backdrop-blur-xs z-50 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FFF8F3] shadow-2xl z-50 flex flex-col justify-between border-r border-[#EADBCE] lg:hidden"
          >
            {/* Top Bar */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 border-b border-[#EADBCE] flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#521225] tracking-tight">
                    {SITE_CONFIG.name}
                  </h2>
                  <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-medium">
                    Handcrafted Luxury
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#8A7B78] hover:text-[#7B1E3A] rounded-full hover:bg-[#F4DCD6]/50 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                {/* Home */}
                <div className="border-b border-[#EADBCE]/50">
                  <NavLink
                    to="/"
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3 px-3 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#F4DCD6] text-[#7B1E3A] font-semibold"
                          : "text-[#380C19] hover:bg-[#F4DCD6]/40"
                      }`
                    }
                  >
                    <span>Home</span>
                  </NavLink>
                </div>

                {/* Sarees Dropdown Accordion */}
                <div className="border-b border-[#EADBCE]/50">
                  <button
                    type="button"
                    onClick={() => toggleSection("sarees")}
                    className="w-full flex items-center justify-between py-3 px-3 text-sm font-medium text-[#380C19] hover:text-[#7B1E3A] transition-colors cursor-pointer"
                    aria-expanded={expandedSection === "sarees"}
                  >
                    <span className={expandedSection === "sarees" ? "text-[#7B1E3A] font-semibold" : ""}>
                      Sarees
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedSection === "sarees" ? "rotate-180 text-[#7B1E3A]" : "text-[#8A7B78]"
                      }`}
                    />
                  </button>

                  {/* Saree Collections List */}
                  {expandedSection === "sarees" && (
                    <div className="pb-2 px-3 space-y-1 bg-[#FFFDF9] rounded-md mb-2 border border-[#EADBCE]/40">
                      {loadingCollections ? (
                        <div className="flex items-center gap-2 py-2 px-3 text-xs text-[#8A7B78]">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7B1E3A]" />
                          <span>Loading collections...</span>
                        </div>
                      ) : sareeCollections.length === 0 ? (
                        <div className="py-2 px-3 text-xs text-[#8A7B78]">
                          No saree collections found
                        </div>
                      ) : (
                        sareeCollections.map((col) => (
                          <Link
                            key={col.id}
                            to={`/collections/${col.handle}`}
                            onClick={handleNavClick}
                            className="flex items-center justify-between py-2 px-3 rounded text-xs text-[#380C19] hover:bg-[#F4DCD6]/40 hover:text-[#7B1E3A] transition-colors"
                          >
                            <span>{col.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#8A7B78]" />
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Kurtis Dropdown Accordion */}
                <div className="border-b border-[#EADBCE]/50">
                  <button
                    type="button"
                    onClick={() => toggleSection("kurtis")}
                    className="w-full flex items-center justify-between py-3 px-3 text-sm font-medium text-[#380C19] hover:text-[#7B1E3A] transition-colors cursor-pointer"
                    aria-expanded={expandedSection === "kurtis"}
                  >
                    <span className={expandedSection === "kurtis" ? "text-[#7B1E3A] font-semibold" : ""}>
                      Kurtis
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedSection === "kurtis" ? "rotate-180 text-[#7B1E3A]" : "text-[#8A7B78]"
                      }`}
                    />
                  </button>

                  {/* Kurti Collections List */}
                  {expandedSection === "kurtis" && (
                    <div className="pb-2 px-3 space-y-1 bg-[#FFFDF9] rounded-md mb-2 border border-[#EADBCE]/40">
                      {loadingCollections ? (
                        <div className="flex items-center gap-2 py-2 px-3 text-xs text-[#8A7B78]">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7B1E3A]" />
                          <span>Loading collections...</span>
                        </div>
                      ) : kurtiCollections.length === 0 ? (
                        <div className="py-2 px-3 text-xs text-[#8A7B78]">
                          No kurti collections found
                        </div>
                      ) : (
                        kurtiCollections.map((col) => (
                          <Link
                            key={col.id}
                            to={`/collections/${col.handle}`}
                            onClick={handleNavClick}
                            className="flex items-center justify-between py-2 px-3 rounded text-xs text-[#380C19] hover:bg-[#F4DCD6]/40 hover:text-[#7B1E3A] transition-colors"
                          >
                            <span>{col.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#8A7B78]" />
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* New Arrivals */}
                <div className="border-b border-[#EADBCE]/50">
                  <NavLink
                    to="/collections/silk-sarees"
                    onClick={handleNavClick}
                    className="flex items-center justify-between py-3 px-3 rounded-md text-sm font-medium text-[#380C19] hover:bg-[#F4DCD6]/40 transition-colors"
                  >
                    <span>New Arrivals</span>
                  </NavLink>
                </div>

                {/* Best Sellers */}
                <div className="border-b border-[#EADBCE]/50">
                  <NavLink
                    to="/collections/silk-sarees"
                    onClick={handleNavClick}
                    className="flex items-center justify-between py-3 px-3 rounded-md text-sm font-medium text-[#380C19] hover:bg-[#F4DCD6]/40 transition-colors"
                  >
                    <span>Best Sellers</span>
                  </NavLink>
                </div>

                {/* About Us */}
                <div className="border-b border-[#EADBCE]/50">
                  <a
                    href="/#heritage"
                    onClick={handleNavClick}
                    className="flex items-center justify-between py-3 px-3 rounded-md text-sm font-medium text-[#380C19] hover:bg-[#F4DCD6]/40 transition-colors"
                  >
                    <span>About Us</span>
                  </a>
                </div>

                {/* Contact */}
                <div className="border-b border-[#EADBCE]/50 last:border-none">
                  <a
                    href="/#contact"
                    onClick={handleNavClick}
                    className="flex items-center justify-between py-3 px-3 rounded-md text-sm font-medium text-[#380C19] hover:bg-[#F4DCD6]/40 transition-colors"
                  >
                    <span>Contact</span>
                  </a>
                </div>
              </nav>

              {/* Account, Wishlist & Cart Shortcuts */}
              <div className="px-4 py-3 space-y-2 border-t border-[#EADBCE] bg-[#FFFDF9]">
                <Link
                  to="/wishlist"
                  onClick={handleNavClick}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md text-sm text-[#380C19] hover:bg-[#F4DCD6]/40"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#7B1E3A]" />
                    <span>My Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-xs bg-[#7B1E3A] text-white px-2 py-0.5 rounded-full font-medium">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleCartClick}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-md text-sm text-[#380C19] hover:bg-[#F4DCD6]/40 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#7B1E3A]" />
                    <span>Shopping Bag</span>
                  </div>
                  {totalQuantity > 0 && (
                    <span className="text-xs bg-[#7B1E3A] text-white px-2 py-0.5 rounded-full font-medium">
                      {totalQuantity}
                    </span>
                  )}
                </button>

                <Link
                  to="/account"
                  onClick={handleNavClick}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md text-sm text-[#380C19] hover:bg-[#F4DCD6]/40"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#7B1E3A]" />
                    <span>Customer Account</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Support Info */}
            <div className="p-4 bg-[#F4DCD6]/40 border-t border-[#EADBCE] text-xs text-[#8A7B78] space-y-2 shrink-0">
              <div className="flex items-center gap-2 text-[#521225]">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <a href={`tel:${SITE_CONFIG.contact.phone}`} className="hover:underline">
                  {SITE_CONFIG.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#521225]">
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:underline">
                  {SITE_CONFIG.contact.email}
                </a>
              </div>
              <p className="text-[11px] text-[#8A7B78] pt-1">
                {SITE_CONFIG.contact.address.formatted}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

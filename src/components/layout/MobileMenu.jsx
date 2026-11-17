import React from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Heart, User, ShoppingBag, Phone, Mail } from "lucide-react";
import { MAIN_NAV } from "../../config/navigation";
import { SITE_CONFIG } from "../../config/site";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";

export default function MobileMenu({ isOpen, onClose }) {
  const { totalItems: wishlistCount } = useWishlist();
  const { totalQuantity, openCart } = useCart();

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
            <div>
              <div className="p-5 border-b border-[#EADBCE] flex items-center justify-between bg-white">
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
                  className="p-1.5 text-[#8A7B78] hover:text-[#7B1E3A] rounded-full hover:bg-[#F4DCD6]/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1 overflow-y-auto">
                {MAIN_NAV.map((item, idx) => (
                  <div key={idx} className="border-b border-[#EADBCE]/50 last:border-none">
                    <NavLink
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-3.5 px-3 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#F4DCD6] text-[#7B1E3A] font-semibold"
                            : "text-[#380C19] hover:bg-[#F4DCD6]/40"
                        }`
                      }
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#8A7B78]" />
                    </NavLink>
                  </div>
                ))}
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
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-md text-sm text-[#380C19] hover:bg-[#F4DCD6]/40 text-left"
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

            {/* Bottom Support Info */}
            <div className="p-4 bg-[#F4DCD6]/40 border-t border-[#EADBCE] text-xs text-[#8A7B78] space-y-2">
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

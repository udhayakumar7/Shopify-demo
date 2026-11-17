import React, { useState, useEffect, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { MAIN_NAV } from "../../config/navigation";
import { SITE_CONFIG } from "../../config/site";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useCollections } from "../../hooks/useCollections";
import SearchModal from "../search/SearchModal";
import MobileMenu from "./MobileMenu";

// Hide Best Sellers from the header nav
const NAV_ITEMS = MAIN_NAV.filter(
  (item) => !/best\s*sellers?/i.test(item.name)
);

// Shopify's default "Home page" collection should not appear in the list
const isHomepageCollection = (col) =>
  col.handle === "frontpage" ||
  /^home\s*-?\s*page$/i.test((col.title || "").trim());

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const { totalQuantity, openCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { collections } = useCollections(12);

  const categories = useMemo(
    () => (collections || []).filter((col) => !isHomepageCollection(col)),
    [collections]
  );

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
            ? "bg-[#FFF8F3]/95 backdrop-blur-md shadow-sm border-b border-[#EADBCE]"
            : "bg-[#FFF8F3] border-b border-[#EADBCE]/70"
          }`}
      >
        {/* Fluid container: matches HeroBanner and FeaturedEdits */}
        <div className="mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,4rem)]">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Left */}
            <div className="flex items-center gap-3 lg:w-1/4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#380C19] hover:text-[#7B1E3A] hover:bg-[#F4DCD6]/50 rounded-md transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-[#EADBCE] bg-white/70 hover:bg-white text-[#8A7B78] hover:text-[#7B1E3A] hover:border-[#C5A059] transition-all text-xs w-[clamp(14rem,18vw,20rem)] cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-[#7B1E3A]" />
                <span className="truncate">Search luxury sarees...</span>
                <kbd className="ml-auto text-[10px] bg-[#F4DCD6] text-[#7B1E3A] px-1.5 py-0.5 rounded font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center lg:w-2/4">
              <Link to="/" className="inline-block" aria-label={SITE_CONFIG.name}>
                <h1 className="sr-only">{SITE_CONFIG.name}</h1>
                <img
                  src={logo}
                  alt={SITE_CONFIG.name}
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center justify-end gap-1 sm:gap-3 lg:w-1/4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2 text-[#380C19] hover:text-[#7B1E3A] rounded-full hover:bg-[#F4DCD6]/50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/wishlist"
                className="relative p-2 text-[#380C19] hover:text-[#7B1E3A] rounded-full hover:bg-[#F4DCD6]/50 transition-colors hidden sm:inline-flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#7B1E3A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/account"
                className="p-2 text-[#380C19] hover:text-[#7B1E3A] rounded-full hover:bg-[#F4DCD6]/50 transition-colors hidden sm:inline-flex"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 text-[#380C19] hover:text-[#7B1E3A] rounded-full hover:bg-[#F4DCD6]/50 transition-colors cursor-pointer group flex items-center gap-1.5"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#7B1E3A] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                      {totalQuantity}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline-block text-xs font-semibold text-[#521225] pl-1">
                  Bag
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-[clamp(1.5rem,2.5vw,3rem)] py-3 border-t border-[#EADBCE]/50">
            {NAV_ITEMS.map((item, index) => {
              if (item.isDropdown) {
                return (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                    onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-xs tracking-wider uppercase font-medium text-[#380C19] group-hover:text-[#7B1E3A] transition-colors py-1 cursor-pointer">
                      <span>Category</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </button>

                    {isCategoryDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl border border-[#EADBCE] py-2 z-50 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-2 border-b border-[#EADBCE]/60">
                          <p className="text-[11px] font-semibold text-[#8A7B78] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C5A059]" />
                            Categories
                          </p>
                        </div>
                        {categories.map((col) => (
                          <Link
                            key={col.id}
                            to={`/collections/${col.handle}`}
                            onClick={() => setIsCategoryDropdownOpen(false)}
                            className="block px-4 py-2 text-xs text-[#380C19] hover:bg-[#F4DCD6]/40 hover:text-[#7B1E3A] font-medium transition-colors"
                          >
                            {col.title}
                          </Link>
                        ))}
                        <div className="border-t border-[#EADBCE]/60 mt-1 pt-1">
                          <Link
                            to="/products"
                            onClick={() => setIsCategoryDropdownOpen(false)}
                            className="block px-4 py-2 text-xs font-semibold text-[#7B1E3A] hover:underline"
                          >
                            View All Sarees →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-xs tracking-wider uppercase font-medium transition-colors py-1 border-b-2 ${isActive && item.path !== "/#heritage"
                      ? "text-[#7B1E3A] border-[#7B1E3A] font-semibold"
                      : "text-[#380C19] border-transparent hover:text-[#7B1E3A] hover:border-[#C5A059]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => {
          setIsMobileMenuOpen(false);
          setIsSearchOpen(true);
        }}
      />
    </>
  );
}
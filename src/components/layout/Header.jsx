import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Loader2,
} from "lucide-react";
import logo from "../../assets/logo.png";
import {
  NAV_ITEMS,
  isSareeCollection,
  isKurtiCollection,
} from "../../config/navigation";
import { SITE_CONFIG } from "../../config/site";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useCollections } from "../../hooks/useCollections";
import SearchModal from "../search/SearchModal";
import MobileMenu from "./MobileMenu";

// Edit these two
const ANNOUNCEMENT = "Buy 3 or more sarees & enjoy a FLAT 10% OFF!";
const SUPPORT_PHONES = ["+91-XXXXX XXXXX", "+91-XXXXX XXXXX"];

export default function Header() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const { totalQuantity, openCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { collections, loading: loadingCollections, error: collectionsError } =
    useCollections(20);

  const sareeCollections = useMemo(
    () => (collections || []).filter(isSareeCollection),
    [collections]
  );
  const kurtiCollections = useMemo(
    () => (collections || []).filter(isKurtiCollection),
    [collections]
  );

  // Close dropdown on route change
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setActiveDropdown(null);
  }

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const handleDropdownEnter = (key) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const toggleDropdown = (key) =>
    setActiveDropdown((prev) => (prev === key ? null : key));

  const iconBtn =
    "relative p-2 text-[#380C19] hover:text-[#7B1E3A] transition-colors cursor-pointer";

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#380C19] text-[#FFF8F3] text-center text-[11px] sm:text-xs py-2 px-4 tracking-wide">
        {ANNOUNCEMENT}
      </div>

      <header className="sticky top-0 z-40 bg-[#FFF8F3] shadow-sm">
        <div className="mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,4rem)]">
          {/* ROW 1: logo | support | search | icons */}
          <div className="flex items-center gap-4 lg:gap-8 h-16 sm:h-20">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#380C19] hover:text-[#7B1E3A] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo + divider + customer service */}
            <div className="flex items-center gap-5 shrink-0">
              <Link to="/" aria-label={SITE_CONFIG.name} className="inline-block">
                <h1 className="sr-only">{SITE_CONFIG.name}</h1>
                <img
                  src={logo}
                  alt={SITE_CONFIG.name}
                  className="h-10 sm:h-14 w-auto object-contain"
                />
              </Link>

              <div className="hidden xl:block h-12 w-px bg-[#EADBCE]" />

              <div className="hidden xl:block leading-snug">
                <p className="text-sm text-[#380C19]">Customer Service:</p>
                <p className="text-base font-medium text-[#7B1E3A]">
                  {SUPPORT_PHONES.join(" (or) ")}
                </p>
              </div>
            </div>

            {/* Search pill (desktop) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex flex-1 max-w-2xl mx-auto items-center h-12 pl-6 pr-1.5 rounded-full bg-white border border-[#EADBCE] text-left text-[#8A7B78] cursor-pointer hover:border-[#C5A059] transition-colors"
              aria-label="Search"
            >
              <span className="flex-1 text-sm">Search...</span>
              <span className="w-9 h-9 rounded-full bg-[#7B1E3A] text-white flex items-center justify-center">
                <Search className="w-4 h-4" />
              </span>
            </button>

            {/* Icons */}
            <div className="flex items-center gap-1 sm:gap-3 ml-auto lg:ml-0 shrink-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`lg:hidden ${iconBtn}`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link to="/wishlist" className={`${iconBtn} hidden sm:inline-flex`} aria-label="Wishlist">
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-[#7B1E3A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button onClick={openCart} className={iconBtn} aria-label="Shopping Cart">
                <ShoppingBag className="w-6 h-6" />
                {totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-[#7B1E3A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </button>

              <Link to="/account" className={`${iconBtn} hidden sm:inline-flex`} aria-label="Account">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* ROW 2: nav, evenly spread */}
          <nav className="hidden lg:flex items-center justify-center gap-x-[clamp(2rem,4vw,3.5rem)] border-t border-[#EADBCE] h-12">
            {NAV_ITEMS.map((item, index) => {
              if (item.hasDropdown) {
                const isOpen = activeDropdown === item.key;
                const dropdownCollections =
                  item.key === "sarees" ? sareeCollections : kurtiCollections;

                return (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(item.key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.key)}
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1 text-base transition-colors cursor-pointer ${isOpen ? "text-[#7B1E3A]" : "text-[#380C19] hover:text-[#7B1E3A]"
                        }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                        onMouseEnter={() => handleDropdownEnter(item.key)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="min-w-[220px] bg-white rounded-lg shadow-xl border border-[#EADBCE] py-2">
                          {loadingCollections ? (
                            <div className="flex items-center justify-center gap-2 px-4 py-3 text-xs text-[#8A7B78]">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7B1E3A]" />
                              <span>Loading collections...</span>
                            </div>
                          ) : collectionsError ? (
                            <div className="px-4 py-2 text-xs text-[#8A7B78]">
                              Unable to load collections
                            </div>
                          ) : dropdownCollections.length === 0 ? (
                            <div className="px-4 py-2 text-xs text-[#8A7B78]">
                              No collections found
                            </div>
                          ) : (
                            dropdownCollections.map((col) => (
                              <Link
                                key={col.id}
                                to={`/collections/${col.handle}`}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-4 py-2 text-sm text-[#380C19] hover:bg-[#F4DCD6]/40 hover:text-[#7B1E3A] transition-colors"
                              >
                                {col.title}
                              </Link>
                            ))
                          )}
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
                    `text-base transition-colors ${isActive && item.path !== "/#heritage" && item.path !== "/#contact"
                      ? "text-[#7B1E3A] font-medium"
                      : "text-[#380C19] hover:text-[#7B1E3A]"
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

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sareeCollections={sareeCollections}
        kurtiCollections={kurtiCollections}
        loadingCollections={loadingCollections}
      />
    </>
  );
}
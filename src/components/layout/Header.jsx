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

export default function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active dropdown: "sarees" | "kurtis" | null
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const { totalQuantity, openCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { collections, loading: loadingCollections, error: collectionsError } = useCollections(20);

  // Filter collections dynamically from Shopify Storefront API
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownEnter = (key) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFF8F3]/95 backdrop-blur-md shadow-sm border-b border-[#EADBCE]"
            : "bg-[#FFF8F3] border-b border-[#EADBCE]/70"
        }`}
      >
        <div className="mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,4rem)]">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Left */}
            <div className="flex items-center gap-3 lg:w-1/4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#380C19] hover:text-[#7B1E3A] hover:bg-[#F4DCD6]/50 rounded-md transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-[#EADBCE] bg-white/70 hover:bg-white text-[#8A7B78] hover:text-[#7B1E3A] hover:border-[#C5A059] transition-all text-xs w-[clamp(14rem,18vw,20rem)] cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-[#7B1E3A]" />
                <span className="truncate">Search luxury sarees & kurtis...</span>
                <kbd className="ml-auto text-[10px] bg-[#F4DCD6] text-[#7B1E3A] px-1.5 py-0.5 rounded font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Center: Brand Logo */}
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

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-1 sm:gap-3 lg:w-1/4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2 text-[#380C19] hover:text-[#7B1E3A] rounded-full hover:bg-[#F4DCD6]/50 transition-colors cursor-pointer"
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
                      className={`flex items-center gap-1 text-xs tracking-wider uppercase font-medium transition-colors py-1 border-b-2 cursor-pointer ${
                        isOpen
                          ? "text-[#7B1E3A] border-[#7B1E3A] font-semibold"
                          : "text-[#380C19] border-transparent hover:text-[#7B1E3A] hover:border-[#C5A059]"
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#7B1E3A]" : ""
                        }`}
                      />
                    </button>

                    {/* Simple Text-Only Dropdown */}
                    {isOpen && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 min-w-[210px] bg-white rounded-lg shadow-xl border border-[#EADBCE] py-2 z-50 animate-in fade-in zoom-in-95"
                        onMouseEnter={() => handleDropdownEnter(item.key)}
                        onMouseLeave={handleDropdownLeave}
                      >
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
                              className="block px-4 py-2 text-xs text-[#380C19] hover:bg-[#F4DCD6]/40 hover:text-[#7B1E3A] font-medium transition-colors"
                            >
                              {col.title}
                            </Link>
                          ))
                        )}
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
                    `text-xs tracking-wider uppercase font-medium transition-colors py-1 border-b-2 ${
                      isActive &&
                      item.path !== "/#heritage" &&
                      item.path !== "/#contact"
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

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer */}
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

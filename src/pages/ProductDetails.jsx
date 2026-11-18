import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductByHandle,
  getRelatedProducts,
} from "../services/shopify/products.js";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { formatPrice, calculateDiscount } from "../utils/currency";
import { storage } from "../utils/storage";
import { PRODUCT_FALLBACK_IMAGE } from "../config/banners";

// UI Components
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import ProductCard from "../components/products/ProductCard";
import QuickViewModal from "../components/products/QuickViewModal";
import ProductGallery from "../components/product-details/ProductGallery";
import ProductSpecifications from "../components/product-details/ProductSpecifications";
import SizeGuideModal from "../components/product-details/SizeGuideModal";
import { extractKurtiSizes } from "../hooks/useKurtiFilters.js";

// Icons
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Ruler,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const RECENTLY_VIEWED_KEY = "harini_recently_viewed";

export default function ProductDetails() {
  const { handle } = useParams();

  // Product and Page State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Variant & Option Selection
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeErrorShake, setSizeErrorShake] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Modals & Accordions
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    specifications: true,
    shipping: false,
    care: false,
  });

  // Related & Recently Viewed
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Hooks
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Load product data
  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setSelectedSize(null);
        setQuantity(1);

        const data = await getProductByHandle(handle);

        if (!data) {
          throw new Error("Product not found");
        }

        if (!isMounted) return;

        setProduct(data);
        document.title = `${data.title} | Harini Luxury Indian Ethnic Wear`;

        // Determine default variant
        const firstAvailable =
          data.variants?.nodes?.find((v) => v.availableForSale) ||
          data.variants?.nodes?.[0];
        setSelectedVariantId(firstAvailable?.id || "");

        // Track recently viewed
        const currentViewed = storage.get(RECENTLY_VIEWED_KEY, []);
        const filtered = currentViewed.filter((item) => item.id !== data.id);
        const updatedViewed = [
          {
            id: data.id,
            title: data.title,
            handle: data.handle,
            featuredImage: data.featuredImage,
            priceRange: data.priceRange,
            compareAtPriceRange: data.compareAtPriceRange,
            availableForSale: data.availableForSale,
            productType: data.productType,
          },
          ...filtered,
        ].slice(0, 8);
        storage.set(RECENTLY_VIEWED_KEY, updatedViewed);
        setRecentlyViewed(updatedViewed.filter((item) => item.id !== data.id));

        // Load related products
        getRelatedProducts(data, 4)
          .then((related) => {
            if (isMounted) setRelatedProducts(related || []);
          })
          .catch(() => {
            if (isMounted) setRelatedProducts([]);
          });
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "We could not find the handcrafted piece you requested."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted = false;
    };
  }, [handle]);

  // Determine category
  const isKurti = useMemo(() => {
    if (!product) return false;
    return (
      /kurti/i.test(product.productType || "") ||
      /kurti/i.test(product.title || "")
    );
  }, [product]);

  // Extract Kurti sizes from Shopify product variants and category attributes
  const kurtiSizes = useMemo(() => {
    if (!product || !isKurti) return [];
    return extractKurtiSizes(product);
  }, [product, isKurti]);

  // Handle Kurti size selection
  const handleSelectKurtiSize = (sizeObj) => {
    setSelectedSize(sizeObj.name);
    setSizeErrorShake(false);
    if (sizeObj.variantId) {
      setSelectedVariantId(sizeObj.variantId);
    }
  };

  // Gallery Images
  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.images?.nodes?.length > 0) {
      return product.images.nodes;
    }
    if (product.featuredImage) {
      return [product.featuredImage];
    }
    return [{ url: PRODUCT_FALLBACK_IMAGE, altText: product.title }];
  }, [product]);

  // Active Variant & Pricing
  const variants = product?.variants?.nodes || [];
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ||
    variants[0] ||
    null;

  const isAvailable = selectedVariant
    ? selectedVariant.availableForSale
    : Boolean(product?.availableForSale);

  const price = selectedVariant?.price || product?.priceRange?.minVariantPrice;
  const compareAtPrice =
    selectedVariant?.compareAtPrice ||
    product?.compareAtPriceRange?.minVariantPrice;
  const discount = calculateDiscount(compareAtPrice?.amount, price?.amount);

  // Badges calculation
  const tags = product?.tags || [];
  const metafields = product?.metafields || [];

  const isNewArrival =
    tags.some((t) => /new[-_ ]?arrival|^new$/i.test(t)) ||
    metafields.some(
      (m) =>
        m?.key === "is_new_arrival" &&
        String(m?.value).toLowerCase() === "true"
    ) ||
    metafields.some((m) => m?.key === "badge" && /new/i.test(m?.value || ""));

  const isBestSeller =
    tags.some((t) => /best[-_ ]?seller|^bestseller$/i.test(t)) ||
    metafields.some(
      (m) =>
        m?.key === "is_best_seller" &&
        String(m?.value).toLowerCase() === "true"
    ) ||
    metafields.some((m) => m?.key === "badge" && /best/i.test(m?.value || ""));

  const careInstructions =
    metafields.find((m) => m?.key === "care_instructions")?.value || null;

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Add to Bag handler
  const handleAddToCart = async () => {
    if (isKurti && kurtiSizes.length > 0 && !selectedSize) {
      setSizeErrorShake(true);
      toast.error("Please select a size to proceed", {
        icon: "📏",
      });
      return;
    }

    if (!selectedVariantId || !isAvailable) {
      toast.error("Selected option is currently unavailable");
      return;
    }

    try {
      setIsAdding(true);
      await addItem(selectedVariantId, quantity, { openDrawer: true });
    } catch {
      // Error handled by context toast
    } finally {
      setIsAdding(false);
    }
  };

  // Buy Now handler
  const handleBuyNow = async () => {
    if (isKurti && kurtiSizes.length > 0 && !selectedSize) {
      setSizeErrorShake(true);
      toast.error("Please select a size to proceed", {
        icon: "📏",
      });
      return;
    }

    if (!selectedVariantId || !isAvailable) {
      toast.error("Selected option is currently unavailable");
      return;
    }

    try {
      setIsBuyingNow(true);
      const updatedCart = await addItem(selectedVariantId, quantity, {
        openDrawer: false,
      });
      if (updatedCart?.checkoutUrl) {
        window.location.href = updatedCart.checkoutUrl;
      }
    } catch (err) {
      toast.error(err.message || "Failed to proceed to checkout");
      setIsBuyingNow(false);
    }
  };

  // Dynamic JSON-LD Product Structured Data for SEO
  useEffect(() => {
    if (!product) return;
    const scriptId = "product-jsonld-schema";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.title,
      image: galleryImages.map((img) => img.url).filter(Boolean),
      description: product.description,
      sku: selectedVariant?.sku || product.handle,
      brand: {
        "@type": "Brand",
        name: product.vendor || "Harini Sarees",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: price?.currencyCode || "INR",
        price: price?.amount,
        availability: isAvailable
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: typeof window !== "undefined" ? window.location.href : "",
        seller: {
          "@type": "Organization",
          name: "Harini Sarees",
        },
      },
    };

    script.textContent = JSON.stringify(schema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [product, selectedVariant, price, isAvailable, galleryImages]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="py-8 sm:py-12 bg-[#FFF8F3] min-h-[80vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 bg-[#EADBCE]/50 rounded-md animate-pulse mb-6" />

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Gallery skeleton */}
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[3/4] bg-[#EADBCE]/40 rounded-2xl animate-pulse" />
              <div className="flex gap-3">
                <div className="w-20 h-24 bg-[#EADBCE]/40 rounded-lg animate-pulse" />
                <div className="w-20 h-24 bg-[#EADBCE]/40 rounded-lg animate-pulse" />
                <div className="w-20 h-24 bg-[#EADBCE]/40 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Info skeleton */}
            <div className="lg:col-span-5 space-y-6">
              <div className="h-4 w-32 bg-[#EADBCE]/50 rounded-md animate-pulse" />
              <div className="h-10 w-3/4 bg-[#EADBCE]/50 rounded-md animate-pulse" />
              <div className="h-8 w-40 bg-[#EADBCE]/50 rounded-md animate-pulse" />
              <div className="h-24 bg-[#EADBCE]/30 rounded-xl animate-pulse" />
              <div className="h-14 bg-[#EADBCE]/40 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (error || !product) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center bg-[#FFF8F3] min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mb-5 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#380C19] mb-3">
          Design Not Found
        </h1>
        <p className="text-sm text-[#8A7B78] max-w-md mx-auto mb-8 leading-relaxed">
          {error ||
            "The handcrafted piece you are looking for may have been archived or is temporarily unavailable in our live catalog."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/collections/sarees">
            <Button variant="primary" size="md">
              Explore All Sarees
            </Button>
          </Link>
          <Link to="/collections/kurtis">
            <Button variant="outline" size="md">
              Explore All Kurtis
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="md">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = isKurti ? "Kurtis" : "Sarees";
  const categoryPath = isKurti ? "/collections/kurtis" : "/collections/sarees";

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: categoryLabel, path: categoryPath },
            { label: product.title },
          ]}
        />

        {/* Main Product Grid (Gallery 7 cols, Details 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-6">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={galleryImages}
              title={product.title}
              discount={discount}
              isAvailable={isAvailable}
              isNewArrival={isNewArrival}
              isBestSeller={isBestSeller}
            />
          </div>

          {/* RIGHT: Product Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Product Type & Vendor */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                  {product.productType || (isKurti ? "Artisanal Kurti" : "Pure Silk Saree")} • {product.vendor || "Harini"}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAvailable ? "bg-emerald-600" : "bg-stone-400"
                    }`}
                  />
                  {isAvailable ? "In Stock • Ready to Ship" : "Sold Out"}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#380C19] leading-tight mb-3">
                {product.title}
              </h1>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#7B1E3A]">
                  {formatPrice(price?.amount, price?.currencyCode)}
                </span>
                {discount && (
                  <span className="text-base text-[#8A7B78] line-through">
                    {formatPrice(
                      compareAtPrice?.amount,
                      compareAtPrice?.currencyCode
                    )}
                  </span>
                )}
                {discount && (
                  <span className="text-xs font-semibold text-[#7B1E3A] bg-[#F4DCD6] px-2.5 py-0.5 rounded-md border border-[#EADBCE]">
                    Save {discount}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8A7B78] mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                Inclusive of all taxes. Free insured door-to-door delivery across India.
              </p>
            </div>

            {/* SKU & Luxury Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A7B78] py-2.5 border-y border-[#EADBCE]">
              {selectedVariant?.sku && (
                <span>
                  SKU: <strong className="text-[#380C19]">{selectedVariant.sku}</strong>
                </span>
              )}
              <span>•</span>
              <span className="flex items-center gap-1 text-[#521225]">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                {isKurti ? "Pure Breathable Fabric" : "Silk Mark Certified"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#521225]">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                {isKurti ? "Master Tailored Fit" : "Fall & Pico Included"}
              </span>
            </div>

            {/* VARIANT SECTION: KURTIS (Size Pills from Shopify Variants) */}
            {isKurti && kurtiSizes.length > 0 && (
              <div
                className={`p-4 rounded-xl border transition-all ${
                  sizeErrorShake
                    ? "border-red-400 bg-red-50/50 shadow-xs"
                    : "border-[#EADBCE] bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#380C19]">
                      Select Size:
                    </label>
                    <span className="text-xs font-bold text-[#7B1E3A]">
                      {selectedSize || "Required"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs text-[#7B1E3A] hover:text-[#5A152A] font-medium underline underline-offset-4 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {kurtiSizes.map((s) => {
                    const isSelected = selectedSize === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => handleSelectKurtiSize(s)}
                        disabled={!s.available}
                        className={`min-w-11 h-11 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center relative cursor-pointer ${
                          isSelected
                            ? "border-[#7B1E3A] bg-[#7B1E3A] text-white shadow-sm ring-2 ring-[#7B1E3A]/20"
                            : s.available
                            ? "border-[#EADBCE] text-[#380C19] bg-white hover:border-[#7B1E3A] hover:text-[#7B1E3A]"
                            : "border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed line-through opacity-60"
                        }`}
                        title={s.available ? `Size ${s.name}` : `Size ${s.name} - Sold Out`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>

                {sizeErrorShake && (
                  <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Please choose an available size to add to your bag.
                  </p>
                )}
              </div>
            )}

            {/* VARIANT SECTION: SAREES (Only shown if multiple non-default variants exist) */}
            {!isKurti && variants.length > 1 && (
              <div className="p-4 rounded-xl border border-[#EADBCE] bg-white space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#380C19]">
                  Available Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        disabled={!v.availableForSale}
                        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#7B1E3A] bg-[#7B1E3A] text-white shadow-xs"
                            : v.availableForSale
                            ? "border-[#EADBCE] text-[#380C19] bg-white hover:border-[#7B1E3A]"
                            : "border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed line-through opacity-60"
                        }`}
                      >
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#380C19] mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-[#EADBCE] rounded-lg bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !isAvailable}
                  className="p-3 text-[#521225] hover:bg-[#F4DCD6]/40 disabled:opacity-30 cursor-pointer rounded-l-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-[#380C19]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!isAvailable}
                  className="p-3 text-[#521225] hover:bg-[#F4DCD6]/40 disabled:opacity-30 cursor-pointer rounded-r-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  loading={isAdding}
                  variant="primary"
                  size="lg"
                  className="flex-1 shadow-md"
                  icon={ShoppingBag}
                >
                  {!isAvailable
                    ? "Currently Sold Out"
                    : isKurti && kurtiSizes.length > 0 && !selectedSize
                    ? "Select a Size to Add"
                    : "Add to Shopping Bag"}
                </Button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-lg border border-[#EADBCE] transition-all cursor-pointer ${
                    isWishlisted(product.id)
                      ? "bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-xs"
                      : "bg-white hover:bg-[#F4DCD6]/50 text-[#7B1E3A]"
                  }`}
                  aria-label="Wishlist this item"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted(product.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>

              {isAvailable && (
                <Button
                  onClick={handleBuyNow}
                  loading={isBuyingNow}
                  variant="secondary"
                  size="lg"
                  className="w-full shadow-md"
                  icon={Zap}
                >
                  Instant Checkout • Buy Now
                </Button>
              )}
            </div>

            {/* Delivery & Security Trust Card */}
            <div className="p-4 rounded-xl bg-white border border-[#EADBCE] space-y-2.5 text-xs text-[#8A7B78]">
              <div className="flex items-center gap-2.5 text-[#521225]">
                <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  Dispatched within <strong>24–48 hours</strong> via express air courier.
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#521225]">
                <Package className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  Delivered in Harini luxury rigid keepsake gift box with tamper seal.
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[#521225]">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  100% Genuine Handcrafted Authenticity Guarantee & 7-day hassle-free exchange.
                </span>
              </div>
            </div>

            {/* Accordions Section */}
            <div className="border-t border-[#EADBCE] pt-4 space-y-3">
              {/* Accordion 1: Description & Artisanal Heritage */}
              <div className="border border-[#EADBCE] rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#380C19] hover:bg-[#F4DCD6]/20 transition-colors cursor-pointer"
                >
                  <span>Description & Artisanal Heritage</span>
                  {openAccordions.description ? (
                    <ChevronUp className="w-4 h-4 text-[#7B1E3A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8A7B78]" />
                  )}
                </button>
                {openAccordions.description && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-[#8A7B78] leading-relaxed border-t border-[#EADBCE]/50">
                    {product.descriptionHtml ? (
                      <div
                        className="prose prose-sm max-w-none text-[#521225]"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                      />
                    ) : (
                      <p>
                        {product.description ||
                          (isKurti
                            ? "Elegantly designed contemporary Indian silhouette crafted with premium breathable textiles, master craftsmanship, and artisanal finishes."
                            : "A breathtaking handcrafted creation woven with pure silk warp and weft, featuring authentic traditional motifs inspired by South Indian temple architecture.")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Product Specifications */}
              <div className="border border-[#EADBCE] rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion("specifications")}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#380C19] hover:bg-[#F4DCD6]/20 transition-colors cursor-pointer"
                >
                  <span>
                    {isKurti ? "Kurti Specifications" : "Saree Specifications"}
                  </span>
                  {openAccordions.specifications ? (
                    <ChevronUp className="w-4 h-4 text-[#7B1E3A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8A7B78]" />
                  )}
                </button>
                {openAccordions.specifications && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#EADBCE]/50">
                    <ProductSpecifications product={product} isKurti={isKurti} />
                  </div>
                )}
              </div>

              {/* Accordion 3: Care Instructions */}
              <div className="border border-[#EADBCE] rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion("care")}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#380C19] hover:bg-[#F4DCD6]/20 transition-colors cursor-pointer"
                >
                  <span>Care & Preservation Guide</span>
                  {openAccordions.care ? (
                    <ChevronUp className="w-4 h-4 text-[#7B1E3A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8A7B78]" />
                  )}
                </button>
                {openAccordions.care && (
                  <div className="px-5 pb-5 pt-2 text-xs text-[#8A7B78] space-y-2 border-t border-[#EADBCE]/50 leading-relaxed">
                    <p className="text-[#380C19] font-medium">
                      {careInstructions ||
                        (isKurti
                          ? "Gentle hand wash or dry clean recommended. Wash dark colors separately in cold water."
                          : "Dry clean only. Store in breathable muslin saree covers to preserve handloom luster.")}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[#521225] pt-1">
                      <li>Avoid direct spraying of harsh perfumes or deodorants onto zari or embroidery.</li>
                      <li>Iron at low-to-medium heat on the reverse side of the garment.</li>
                      <li>Keep away from prolonged direct harsh sunlight when drying.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping & Returns */}
              <div className="border border-[#EADBCE] rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#380C19] hover:bg-[#F4DCD6]/20 transition-colors cursor-pointer"
                >
                  <span>Shipping, Exchanges & Authenticity</span>
                  {openAccordions.shipping ? (
                    <ChevronUp className="w-4 h-4 text-[#7B1E3A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8A7B78]" />
                  )}
                </button>
                {openAccordions.shipping && (
                  <div className="px-5 pb-5 pt-2 text-xs text-[#8A7B78] space-y-2.5 border-t border-[#EADBCE]/50 leading-relaxed">
                    <p>
                      <strong>Domestic Shipping (India):</strong> Complimentary insured air shipping on all orders. Expected delivery within 2–5 business days.
                    </p>
                    <p>
                      <strong>Authenticity Tag:</strong> Every piece undergoes stringent multi-stage artisanal quality checks before dispatch.
                    </p>
                    <p>
                      <strong>Exchange Policy:</strong> 7-day hassle-free exchange for size or alternative drape if unwashed and with original security tags intact.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#EADBCE]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] block mb-1">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#380C19]">
                You May Also Admire
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}

        {/* RECENTLY VIEWED SECTION */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#EADBCE]">
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#380C19] mb-6">
              Recently Viewed Creations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {recentlyViewed.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.handle}`}
                  className="group bg-white p-2.5 rounded-xl border border-[#EADBCE] overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#F4DCD6]/30 mb-2">
                    <img
                      src={p.featuredImage?.url || PRODUCT_FALLBACK_IMAGE}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs font-medium text-[#380C19] group-hover:text-[#7B1E3A] line-clamp-1 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs font-bold text-[#7B1E3A] mt-0.5">
                    {formatPrice(
                      p.priceRange?.minVariantPrice?.amount,
                      p.priceRange?.minVariantPrice?.currencyCode
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kurti Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Quick View Modal for Related Products */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

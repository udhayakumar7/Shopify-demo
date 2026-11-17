import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByHandle, getFeaturedProducts } from "../services/shopify/products";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { formatPrice, calculateDiscount } from "../utils/currency";
import { storage } from "../utils/storage";
import { PRODUCT_FALLBACK_IMAGE } from "../config/banners";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import ProductCard from "../components/products/ProductCard";
import {
    Heart,
    ShoppingBag,
    Zap,
    ShieldCheck,
    Truck,
    Sparkles,
    Award,
    ChevronDown,
    ChevronUp,
    X,
    ZoomIn,
    Plus,
    Minus,
} from "lucide-react";
import toast from "react-hot-toast";

const RECENTLY_VIEWED_KEY = "harini_recently_viewed";

export default function ProductDetails() {
    const { handle } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    // Accordion open states
    const [openAccordions, setOpenAccordions] = useState({
        details: true,
        metafields: true,
        shipping: false,
        care: false,
    });

    // Related & Recently Viewed
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    const { addItem } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();

    // Load product data
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError("");
                const data = await getProductByHandle(handle);

                if (!data) {
                    throw new Error("Product not found");
                }

                setProduct(data);
                document.title = `${data.title} | Harini Sarees`;

                // Default variant
                const firstAvailable =
                    data.variants?.nodes?.find((v) => v.availableForSale) ||
                    data.variants?.nodes?.[0];
                setSelectedVariantId(firstAvailable?.id || "");
                setSelectedImageIndex(0);

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
                ].slice(0, 6);
                storage.set(RECENTLY_VIEWED_KEY, updatedViewed);
                setRecentlyViewed(updatedViewed.filter((item) => item.id !== data.id));

                // Fetch related products
                const featured = await getFeaturedProducts(4);
                setRelatedProducts(featured.filter((item) => item.id !== data.id));
            } catch (err) {
                setError(err.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        }

        load();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [handle]);

    if (loading) {
        return (
            <div className="py-24 max-w-7xl mx-auto px-4 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#7B1E3A] border-t-transparent animate-spin mx-auto mb-4" />
                <p className="font-serif text-lg text-[#380C19]">Unfolding Handcrafted Saree...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="py-24 max-w-md mx-auto px-4 text-center">
                <h2 className="font-serif text-2xl text-[#380C19] mb-3">Saree Not Found</h2>
                <p className="text-sm text-[#8A7B78] mb-6">{error || "This product is unavailable."}</p>
                <Link to="/products">
                    <Button variant="primary">Browse All Sarees</Button>
                </Link>
            </div>
        );
    }

    // Gallery images
    const images = product.images?.nodes?.length
        ? product.images.nodes
        : product.featuredImage
            ? [product.featuredImage]
            : [{ url: PRODUCT_FALLBACK_IMAGE, altText: product.title }];

    const currentImage = images[selectedImageIndex] || images[0];

    // Variants & selected variant
    const variants = product.variants?.nodes || [];
    const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
    const isAvailable = selectedVariant?.availableForSale ?? product.availableForSale;

    // Pricing
    const price = selectedVariant?.price || product.priceRange?.minVariantPrice;
    const compareAtPrice =
        selectedVariant?.compareAtPrice || product.compareAtPriceRange?.minVariantPrice;
    const discount = calculateDiscount(compareAtPrice?.amount, price?.amount);

    // Metafield helper
    const metafields = product.metafields || [];
    const getMetafield = (key) =>
        metafields.find((field) => field?.key === key)?.value || null;

    const fabric = getMetafield("fabric");
    const sareeType = getMetafield("saree_type");
    const blouseIncluded = getMetafield("blouse_included");
    const workType = getMetafield("work_type");
    const careInstructions = getMetafield("care_instructions");
    const occasion = getMetafield("occasion");

    const wishlisted = isWishlisted(product.id);

    const toggleAccordion = (key) => {
        setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Add to cart handler
    const handleAddToCart = async () => {
        if (!selectedVariantId || !isAvailable) {
            toast.error("Please select an available variant");
            return;
        }
        try {
            setIsAdding(true);
            await addItem(selectedVariantId, quantity, { openDrawer: true });
        } finally {
            setIsAdding(false);
        }
    };

    // Buy now handler: Adds item and immediately redirects to Shopify hosted checkout URL
    const handleBuyNow = async () => {
        if (!selectedVariantId || !isAvailable) {
            toast.error("Please select an available variant");
            return;
        }
        try {
            setIsBuyingNow(true);
            const updatedCart = await addItem(selectedVariantId, quantity, { openDrawer: false });
            if (updatedCart?.checkoutUrl) {
                window.location.href = updatedCart.checkoutUrl;
            }
        } catch (err) {
            toast.error(err.message || "Failed to proceed to checkout");
            setIsBuyingNow(false);
        }
    };

    return (
        <div className="py-8 sm:py-12 bg-[#FFF8F3]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: "Sarees", path: "/products" },
                        { label: product.productType || "Silk Saree", path: "/products" },
                        { label: product.title },
                    ]}
                />

                {/* Main PDP Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-6">
                    {/* LEFT: Image Gallery (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Main Stage Image */}
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#EADBCE] shadow-xs aspect-[3/4] group">
                            <img
                                src={currentImage.url}
                                alt={currentImage.altText || product.title}
                                className="w-full h-full object-cover object-center cursor-zoom-in"
                                onClick={() => setIsZoomOpen(true)}
                            />

                            {/* Discount / Sold out badge */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                {discount && isAvailable && (
                                    <Badge variant="sale" size="sm">
                                        {discount}% OFF
                                    </Badge>
                                )}
                                {!isAvailable && (
                                    <Badge variant="soldOut" size="sm">
                                        Sold Out
                                    </Badge>
                                )}
                            </div>

                            {/* Zoom Trigger Button */}
                            <button
                                onClick={() => setIsZoomOpen(true)}
                                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 text-[#380C19] hover:bg-white hover:text-[#7B1E3A] shadow-md transition-all backdrop-blur-xs cursor-pointer"
                                aria-label="Zoom image"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thumbnails Row */}
                        {images.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-white cursor-pointer ${selectedImageIndex === idx
                                            ? "border-[#7B1E3A] shadow-sm scale-102"
                                            : "border-[#EADBCE] opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt=""
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details & Actions (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            {/* Product Type & Vendor */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                                    {product.productType || "Pure Silk Saree"} • {product.vendor || "Harini"}
                                </span>
                                <span
                                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isAvailable
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-stone-200 text-stone-700"
                                        }`}
                                >
                                    {isAvailable ? "In Stock" : "Sold Out"}
                                </span>
                            </div>

                            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#380C19] leading-tight mb-3">
                                {product.title}
                            </h1>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-3 pt-1">
                                <span className="text-2xl sm:text-3xl font-bold text-[#7B1E3A]">
                                    {formatPrice(price?.amount, price?.currencyCode)}
                                </span>
                                {discount && (
                                    <span className="text-base text-[#8A7B78] line-through">
                                        {formatPrice(compareAtPrice?.amount, compareAtPrice?.currencyCode)}
                                    </span>
                                )}
                                {discount && (
                                    <span className="text-xs font-semibold text-[#7B1E3A] bg-[#F4DCD6] px-2 py-0.5 rounded">
                                        Save {discount}%
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-[#8A7B78] mt-1">
                                Inclusive of all taxes. Free insured delivery across India.
                            </p>
                        </div>

                        {/* SKU & Quick Trust Pills */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A7B78] py-2 border-y border-[#EADBCE]">
                            {selectedVariant?.sku && (
                                <span>SKU: <strong className="text-[#380C19]">{selectedVariant.sku}</strong></span>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#521225]">
                                <Award className="w-3.5 h-3.5 text-[#C5A059]" /> Silk Mark Certified
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#521225]">
                                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Fall & Pico Free
                            </span>
                        </div>

                        {/* Variant Selector (if more than 1) */}
                        {variants.length > 1 && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#380C19] mb-2">
                                    Select Variant
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariantId(v.id)}
                                            disabled={!v.availableForSale}
                                            className={`px-4 py-2 text-xs font-medium rounded-md border transition-all cursor-pointer ${selectedVariantId === v.id
                                                ? "border-[#7B1E3A] bg-[#7B1E3A] text-white shadow-xs"
                                                : "border-[#EADBCE] text-[#380C19] bg-white hover:border-[#7B1E3A]"
                                                } disabled:opacity-40 disabled:line-through`}
                                        >
                                            {v.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Stepper */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#380C19] mb-2">
                                Quantity
                            </label>
                            <div className="inline-flex items-center border border-[#EADBCE] rounded-md bg-white">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1 || !isAvailable}
                                    className="p-2.5 text-[#521225] hover:bg-[#F4DCD6]/50 disabled:opacity-30 cursor-pointer"
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
                                    className="p-2.5 text-[#521225] hover:bg-[#F4DCD6]/50 cursor-pointer"
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
                                    disabled={!isAvailable || !selectedVariantId}
                                    loading={isAdding}
                                    variant="primary"
                                    size="lg"
                                    className="flex-1 shadow-md"
                                    icon={ShoppingBag}
                                >
                                    {isAvailable ? "Add to Shopping Bag" : "Currently Sold Out"}
                                </Button>

                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`p-3.5 rounded-md border border-[#EADBCE] transition-all cursor-pointer ${wishlisted
                                        ? "bg-[#7B1E3A] text-white border-[#7B1E3A] shadow-xs"
                                        : "bg-white hover:bg-[#F4DCD6]/50 text-[#7B1E3A]"
                                        }`}
                                    aria-label="Wishlist"
                                >
                                    <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
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
                                    Buy Now
                                </Button>
                            )}
                        </div>

                        {/* Delivery Reassurance Card */}
                        <div className="p-4 rounded-xl bg-white border border-[#EADBCE] space-y-2 text-xs text-[#8A7B78]">
                            <div className="flex items-center gap-2.5 text-[#521225]">
                                <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
                                <span>Estimated dispatch in <strong>24–48 hours</strong> with priority air courier.</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-[#521225]">
                                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                                <span>Tamper-evident luxury gift box packing with Silk Mark tag.</span>
                            </div>
                        </div>

                        {/* Accordions: Metafields, Details, Shipping, Care */}
                        <div className="border-t border-[#EADBCE] pt-4 space-y-3">
                            {/* Metafields Accordion */}
                            {(fabric || sareeType || workType || occasion) && (
                                <div className="border border-[#EADBCE] rounded-lg bg-white overflow-hidden">
                                    <button
                                        onClick={() => toggleAccordion("metafields")}
                                        className="w-full px-5 py-3.5 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#380C19] hover:bg-[#F4DCD6]/20 transition-colors"
                                    >
                                        <span>Saree Specifications & Metafields</span>
                                        {openAccordions.metafields ? (
                                            <ChevronUp className="w-4 h-4 text-[#7B1E3A]" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-[#8A7B78]" />
                                        )}
                                    </button>
                                    {openAccordions.metafields && (
                                        <div className="px-5 pb-5 pt-1 grid grid-cols-2 gap-3 text-xs border-t border-[#EADBCE]/50">
                                            {fabric && (
                                                <div className="p-2.5 bg-[#FFF8F3] rounded border border-[#EADBCE]/60">
                                                    <span className="text-[#8A7B78] block text-[10px] uppercase tracking-wider">Fabric</span>
                                                    <strong className="text-[#380C19] text-xs">{fabric}</strong>
                                                </div>
                                            )}
                                            {sareeType && (
                                                <div className="p-2.5 bg-[#FFF8F3] rounded border border-[#EADBCE]/60">
                                                    <span className="text-[#8A7B78] block text-[10px] uppercase tracking-wider">Saree Type</span>
                                                    <strong className="text-[#380C19] text-xs">{sareeType}</strong>
                                                </div>
                                            )}
                                            {blouseIncluded && (
                                                <div className="p-2.5 bg-[#FFF8F3] rounded border border-[#EADBCE]/60">
                                                    <span className="text-[#8A7B78] block text-[10px] uppercase tracking-wider">Blouse Included</span>
                                                    <strong className="text-[#380C19] text-xs">
                                                        {blouseIncluded === "true" ? "Yes (Running Blouse Piece)" : blouseIncluded}
                                                    </strong>
                                                </div>
                                            )}
                                            {workType && (
                                                <div className="p-2.5 bg-[#FFF8F3] rounded border border-[#EADBCE]/60">
                                                    <span className="text-[#8A7B78] block text-[10px] uppercase tracking-wider">Work Type</span>
                                                    <strong className="text-[#380C19] text-xs">{workType.trim()}</strong>
                                                </div>
                                            )}
                                            {occasion && (
                                                <div className="p-2.5 bg-[#FFF8F3] rounded border border-[#EADBCE]/60">
                                                    <span className="text-[#8A7B78] block text-[10px] uppercase tracking-wider">Occasion</span>
                                                    <strong className="text-[#380C19] text-xs">{occasion}</strong>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Description Accordion */}
                            <div className="border border-[#EADBCE] rounded-lg bg-white overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion("details")}
                                    className="w-full px-5 py-3.5 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#380C19] hover:bg-[#F4DCD6]/20 transition-colors"
                                >
                                    <span>Description & Artisanal Heritage</span>
                                    {openAccordions.details ? (
                                        <ChevronUp className="w-4 h-4 text-[#7B1E3A]" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-[#8A7B78]" />
                                    )}
                                </button>
                                {openAccordions.details && (
                                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-[#8A7B78] leading-relaxed border-t border-[#EADBCE]/50">
                                        <p>{product.description || "A breathtaking handcrafted creation woven with pure silk warp and weft, featuring authentic traditional motifs inspired by South Indian temple architecture."}</p>
                                    </div>
                                )}
                            </div>

                            {/* Care Instructions Accordion */}
                            <div className="border border-[#EADBCE] rounded-lg bg-white overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion("care")}
                                    className="w-full px-5 py-3.5 flex items-center justify-between text-left font-serif text-sm font-semibold text-[#380C19] hover:bg-[#F4DCD6]/20 transition-colors"
                                >
                                    <span>Care & Preservation Guide</span>
                                    {openAccordions.care ? (
                                        <ChevronUp className="w-4 h-4 text-[#7B1E3A]" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-[#8A7B78]" />
                                    )}
                                </button>
                                {openAccordions.care && (
                                    <div className="px-5 pb-5 pt-2 text-xs text-[#8A7B78] space-y-2 border-t border-[#EADBCE]/50">
                                        <p>
                                            <strong>Care Advice:</strong>{" "}
                                            {careInstructions || "Dry clean only. Store in a cool, dry place wrapped in soft muslin or cotton saree bags."}
                                        </p>
                                        <p>• Avoid direct contact with liquid perfumes or sprays on gold zari borders.</p>
                                        <p>• Periodically refold the saree along different creases to protect handloom tension.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-[#EADBCE]">
                        <div className="text-center max-w-xl mx-auto mb-10">
                            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] block mb-1">
                                Curated Suggestions
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#380C19]">
                                You May Also Admire
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* RECENTLY VIEWED */}
                {recentlyViewed.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-[#EADBCE]">
                        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#380C19] mb-8">
                            Recently Viewed Weaves
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {recentlyViewed.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/products/${p.handle}`}
                                    className="group bg-white p-2 rounded-lg border border-[#EADBCE] overflow-hidden"
                                >
                                    <div className="aspect-[3/4] overflow-hidden rounded bg-[#F4DCD6]/30 mb-2">
                                        <img
                                            src={p.featuredImage?.url || PRODUCT_FALLBACK_IMAGE}
                                            alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <h4 className="text-xs font-medium text-[#380C19] group-hover:text-[#7B1E3A] truncate">
                                        {p.title}
                                    </h4>
                                    <p className="text-xs font-semibold text-[#7B1E3A] mt-0.5">
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

            {/* Lightbox / Zoom Modal */}
            {isZoomOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <button
                        onClick={() => setIsZoomOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                        aria-label="Close zoom"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={currentImage.url}
                        alt={currentImage.altText || product.title}
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                    />
                </div>
            )}
        </div>
    );
}

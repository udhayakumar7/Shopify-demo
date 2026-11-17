import React, { useEffect } from "react";
import HeroBanner from "../components/home/HeroBanner";
import ShopByCategories from "../components/home/ShopByCategories";
import FeaturedEdits from "../components/home/FeaturedEdits";
import PromotionalBanners from "../components/home/PromotionalBanners";
import WhyShopWithUs from "../components/home/WhyShopWithUs";
import Testimonials from "../components/home/Testimonials";
import SocialGallery from "../components/home/SocialGallery";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Harini Sarees | Handcrafted Luxury Sarees & Silk Heritage";
  }, []);

  return (
    <div className="w-full">
      <HeroBanner />
      <ShopByCategories />
      <FeaturedEdits />
      <PromotionalBanners />
      <WhyShopWithUs />
      <Testimonials />
      <SocialGallery />
      <Newsletter />
    </div>
  );
}

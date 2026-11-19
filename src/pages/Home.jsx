import React, { useEffect } from "react";
import HeroBanner from "../components/home/HeroBanner";
import ShopByCategories from "../components/home/ShopByCategories";
import ShopByOccasion from "../components/home/ShopByOccasion";
import BestSellers from "../components/home/BestSellers";
import NewArrivals from "../components/home/NewArrivals";
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

      <BestSellers />
      <ShopByOccasion />
      <NewArrivals />

      <WhyShopWithUs />
      <PromotionalBanners />
      <Testimonials />
      <SocialGallery />
      {/* <Newsletter /> */}
    </div>
  );
}

import React from "react";
import AnnouncementBar from "../common/AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F3] text-[#380C19]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "13px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      {/* <AnnouncementBar /> */}
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

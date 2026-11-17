import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import { User, Package, MapPin, ShieldCheck, LogIn } from "lucide-react";
import { buildCustomerAuthUrl, isCustomerAuthenticated, logoutCustomer } from "../services/shopify/customer";
import toast from "react-hot-toast";

export default function Account() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isCustomerAuthenticated());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Customer Portal | Harini Sarees";
  }, []);

  const handleShopifyLogin = async () => {
    try {
      setLoading(true);
      // In production, pass customer account API client ID from env
      const clientId = import.meta.env.VITE_SHOPIFY_CUSTOMER_CLIENT_ID || "customer-account-client-id";
      const authUrl = await buildCustomerAuthUrl(clientId);
      window.location.href = authUrl;
    } catch {
      toast.error("Connecting to Shopify Customer Accounts...");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutCustomer();
    setIsAuthenticated(false);
    toast.success("Signed out successfully");
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Customer Portal" }]} />

        <div className="border-b border-[#EADBCE] pb-6 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19]">
            Customer Account & Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7B78] mt-1">
            Manage your profiles, delivery addresses, and track real-time saree shipments.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white rounded-xl border border-[#EADBCE] p-8 sm:p-10 shadow-sm mb-8">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mx-auto">
              <User className="w-7 h-7" />
            </div>

            <h2 className="font-serif text-2xl font-medium text-[#380C19]">
              {isAuthenticated ? "Welcome Back" : "Passwordless Shopify Login"}
            </h2>

            <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed">
              {isAuthenticated
                ? "You are signed in to your Harini Sarees account. Manage your past purchases and track your orders."
                : "Sign in with your email to receive a secure single-use verification code directly to your inbox. No passwords required."}
            </p>

            <div className="pt-2">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={handleShopifyLogin}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={LogIn}
                >
                  Sign In with Shopify
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A7B78] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Secured with OAuth 2.0 PKCE & Shopify Customer Accounts</span>
            </div>
          </div>
        </div>

        {/* Future Architecture Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#EADBCE]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A]">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#380C19]">
                Order Tracking
              </h3>
            </div>
            <p className="text-xs text-[#8A7B78] leading-relaxed">
              Once logged in with Shopify Customer Account API, your complete order history, courier waybills (DTDC, Blue Dart, DHL Express), and invoices will sync here in real time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EADBCE]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A]">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#380C19]">
                Saved Addresses
              </h3>
            </div>
            <p className="text-xs text-[#8A7B78] leading-relaxed">
              Save your residential and wedding delivery addresses to enjoy one-click checkout across all future handcrafted saree purchases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import { User, Package, MapPin, ShieldCheck, LogIn } from "lucide-react";
import {
  loginWithShopify,
  isCustomerAuthenticated,
  logoutCustomer,
} from "../services/shopify/customer";
import {
  getCustomerProfile,
  getCustomerOrders,
  getCustomerAddresses,
} from "../services/shopify/customerApi";
import CustomerProfile from "../components/account/CustomerProfile";
import CustomerOrders from "../components/account/CustomerOrders";
import CustomerAddresses from "../components/account/CustomerAddresses";
import toast from "react-hot-toast";

export default function Account() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isCustomerAuthenticated()
  );
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Authenticated Customer Data State
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState(null);

  // Active Tab: "orders" | "addresses"
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Customer Portal | Harini Sarees";
  }, []);

  /**
   * Fetch all customer data concurrently when logged in
   */
  const loadCustomerData = useCallback(async () => {
    if (!isCustomerAuthenticated()) return;

    try {
      setLoadingData(true);
      setDataError(null);

      const [profileRes, ordersRes, addressesRes] = await Promise.allSettled([
        getCustomerProfile(),
        getCustomerOrders(20),
        getCustomerAddresses(),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value) {
        setProfile(profileRes.value);
      }

      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value || []);
      }

      if (addressesRes.status === "fulfilled" && addressesRes.value) {
        setAddresses(addressesRes.value.addresses || []);
        setDefaultAddress(addressesRes.value.defaultAddress || null);
      }

      // If all three failed due to expired session
      if (
        profileRes.status === "rejected" &&
        ordersRes.status === "rejected" &&
        addressesRes.status === "rejected"
      ) {
        throw new Error(
          profileRes.reason?.message || "Customer session expired"
        );
      }
    } catch (err) {
      console.error("[Account Data Load Error]:", err);
      if (!isCustomerAuthenticated()) {
        setIsAuthenticated(false);
        toast.error("Your session has expired. Please sign in again.");
      } else {
        setDataError(err.message || "Failed to load account details.");
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) return;

    // Async fetch inside effect with active guard
    const initLoad = async () => {
      try {
        setLoadingData(true);
        setDataError(null);

        const [profileRes, ordersRes, addressesRes] = await Promise.allSettled([
          getCustomerProfile(),
          getCustomerOrders(20),
          getCustomerAddresses(),
        ]);

        if (!active) return;

        if (profileRes.status === "fulfilled" && profileRes.value) {
          setProfile(profileRes.value);
        }
        if (ordersRes.status === "fulfilled") {
          setOrders(ordersRes.value || []);
        }
        if (addressesRes.status === "fulfilled" && addressesRes.value) {
          setAddresses(addressesRes.value.addresses || []);
          setDefaultAddress(addressesRes.value.defaultAddress || null);
        }
      } catch (err) {
        if (!active) return;
        if (!isCustomerAuthenticated()) {
          setIsAuthenticated(false);
        } else {
          setDataError(err.message || "Failed to load account details.");
        }
      } finally {
        if (active) setLoadingData(false);
      }
    };

    initLoad();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const handleShopifyLogin = async () => {
    try {
      setLoggingIn(true);
      await loginWithShopify();
    } catch (err) {
      toast.error(err?.message || "Failed to connect to Shopify Accounts.");
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutCustomer();
      setIsAuthenticated(false);
      setProfile(null);
      setOrders([]);
      setAddresses([]);
      toast.success("Signed out successfully");
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8F3] min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Customer Portal" }]} />

        {/* Page Title */}
        <div className="border-b border-[#EADBCE] pb-6 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19]">
            Customer Account & Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7B78] mt-1">
            {isAuthenticated
              ? "Manage your delivery addresses and track live handcrafted saree shipments."
              : "Sign in to track real-time shipments, invoices, and saved delivery addresses."}
          </p>
        </div>

        {/* LOGGED IN VIEW */}
        {isAuthenticated ? (
          <div>
            {/* Customer Profile Card */}
            <CustomerProfile
              profile={
                profile || {
                  displayName: "Harini Patron",
                  email: "Connecting...",
                  phone: "",
                }
              }
              onLogout={handleLogout}
              loggingOut={loggingOut}
            />

            {/* Account Navigation Tabs */}
            <div className="flex items-center gap-3 border-b border-[#EADBCE] mb-6">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 pb-3.5 px-2 text-sm font-medium transition-all border-b-2 cursor-pointer ${
                  activeTab === "orders"
                    ? "border-[#7B1E3A] text-[#7B1E3A] font-semibold"
                    : "border-transparent text-[#8A7B78] hover:text-[#380C19]"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
                {!loadingData && orders.length > 0 && (
                  <span className="px-2 py-0.2 rounded-full text-[11px] bg-[#F4DCD6] text-[#7B1E3A] font-semibold">
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`flex items-center gap-2 pb-3.5 px-2 text-sm font-medium transition-all border-b-2 cursor-pointer ${
                  activeTab === "addresses"
                    ? "border-[#7B1E3A] text-[#7B1E3A] font-semibold"
                    : "border-transparent text-[#8A7B78] hover:text-[#380C19]"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
                {!loadingData && addresses.length > 0 && (
                  <span className="px-2 py-0.2 rounded-full text-[11px] bg-[#F4DCD6] text-[#7B1E3A] font-semibold">
                    {addresses.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab 1: Orders */}
            {activeTab === "orders" && (
              <CustomerOrders
                orders={orders}
                loading={loadingData}
                error={dataError}
                onRefresh={loadCustomerData}
              />
            )}

            {/* Tab 2: Addresses */}
            {activeTab === "addresses" && (
              <CustomerAddresses
                addresses={addresses}
                defaultAddress={defaultAddress}
                loading={loadingData}
                error={dataError}
                onAddressMutated={loadCustomerData}
              />
            )}
          </div>
        ) : (
          /* LOGGED OUT VIEW - Preserves Exact Design */
          <div>
            {/* Authentication Card */}
            <div className="bg-white rounded-xl border border-[#EADBCE] p-8 sm:p-10 shadow-sm mb-8">
              <div className="max-w-md mx-auto text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mx-auto">
                  <User className="w-7 h-7" />
                </div>

                <h2 className="font-serif text-2xl font-medium text-[#380C19]">
                  Passwordless Shopify Login
                </h2>

                <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed">
                  Sign in with your email to receive a secure single-use verification code directly to your inbox. No passwords required.
                </p>

                <div className="pt-2">
                  <Button
                    onClick={handleShopifyLogin}
                    loading={loggingIn}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={LogIn}
                  >
                    Sign In with Shopify
                  </Button>
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
        )}
      </div>
    </div>
  );
}

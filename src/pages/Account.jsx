import React, { useEffect, useState, useCallback } from "react";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import { User, Package, MapPin, ShieldCheck, LogIn, AlertCircle, RotateCw } from "lucide-react";
import logo from "../assets/logo.png";
import {
  loginWithShopify,
  isCustomerAuthenticated,
  logoutCustomer,
  clearCustomerSession,
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
   * Unified customer data loader. Reused directly by the effect, tab refreshes,
   * and address mutations without duplicated logic.
   */
  const loadCustomerData = useCallback(async () => {
    if (!isCustomerAuthenticated()) {
      clearCustomerSession();
      setIsAuthenticated(false);
      return;
    }

    try {
      setLoadingData(true);
      setDataError(null);

      const [profileRes, ordersRes, addressesRes] = await Promise.allSettled([
        getCustomerProfile(),
        getCustomerOrders(20),
        getCustomerAddresses(20),
      ]);

      // Detect when all three API requests fail
      const allFailed =
        profileRes.status === "rejected" &&
        ordersRes.status === "rejected" &&
        addressesRes.status === "rejected";

      if (allFailed) {
        const failureReason =
          profileRes.reason?.message ||
          ordersRes.reason?.message ||
          addressesRes.reason?.message ||
          "Failed to load customer account details.";

        // Handle expired session or unauthorized tokens
        if (
          !isCustomerAuthenticated() ||
          failureReason.toLowerCase().includes("unauthorized") ||
          failureReason.toLowerCase().includes("sign in") ||
          failureReason.toLowerCase().includes("expired")
        ) {
          clearCustomerSession();
          setIsAuthenticated(false);
          toast.error("Your session has expired. Please sign in again.");
          return;
        }

        setDataError(failureReason);
        return;
      }

      // Populate fulfilled results safely
      if (profileRes.status === "fulfilled" && profileRes.value) {
        setProfile(profileRes.value);
      }

      if (ordersRes.status === "fulfilled") {
        const ordersData = ordersRes.value?.orders || ordersRes.value || [];
        setOrders(ordersData);
      }

      if (addressesRes.status === "fulfilled" && addressesRes.value) {
        setAddresses(addressesRes.value.addresses || []);
        setDefaultAddress(addressesRes.value.defaultAddress || null);
      }
    } catch (err) {
      console.error("[Account Load Error]:", err);
      if (!isCustomerAuthenticated()) {
        clearCustomerSession();
        setIsAuthenticated(false);
        toast.error("Your session has expired. Please sign in again.");
      } else {
        setDataError(err.message || "Failed to load account details.");
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Reuses loadCustomerData on mount and authentication change safely
  useEffect(() => {
    let active = true;
    if (isAuthenticated) {
      const initLoad = async () => {
        await Promise.resolve();
        if (active) {
          loadCustomerData();
        }
      };
      initLoad();
    }
    return () => {
      active = false;
    };
  }, [isAuthenticated, loadCustomerData]);

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

            {/* Error banner when requests fail */}
            {dataError && (
              <div className="mb-6 p-4 rounded-xl bg-[#F4DCD6] border border-[#7B1E3A]/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs text-[#7B1E3A]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Unable to fetch some account data</p>
                    <p className="text-[#8A7B78]">{dataError}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadCustomerData}
                  loading={loadingData}
                  icon={RotateCw}
                  className="border-[#7B1E3A] text-[#7B1E3A] shrink-0"
                >
                  Retry
                </Button>
              </div>
            )}

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
          /* LOGGED OUT VIEW - Premium Luxury Authentication Experience */
          <div className="space-y-8">
            {/* Authentication Card */}
            <div className="bg-white rounded-2xl border border-[#EADBCE] p-8 sm:p-12 shadow-sm relative overflow-hidden text-center">
              {/* Subtle Luxury Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

              <div className="max-w-md mx-auto space-y-6">
                {/* Elegant Brand Monogram / Account Emblem */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFF8F3] border-2 border-[#C5A059]/40 flex items-center justify-center p-3 shadow-inner hover:scale-105 transition-transform duration-300">
                      <img
                        src={logo}
                        alt="Harini Sarees"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#7B1E3A] text-white flex items-center justify-center shadow-sm border-2 border-white">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    </div>
                  </div>
                </div>

                {/* Heading & Supporting Text */}
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#380C19] tracking-tight">
                    Welcome to Harini
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed max-w-sm mx-auto">
                    Sign in to access your personal profile, track your handcrafted saree shipments in real time, and manage saved delivery addresses.
                  </p>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-2">
                  <Button
                    onClick={handleShopifyLogin}
                    loading={loggingIn}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto min-w-[280px] py-3.5 px-8 text-sm sm:text-base font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-[#63172E] active:scale-[0.99] transition-all duration-300 cursor-pointer"
                    icon={LogIn}
                  >
                    Continue with Shopify
                  </Button>
                </div>

                {/* Security Indicator */}
                <div className="flex items-center justify-center gap-2 text-xs text-[#8A7B78] pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Secure authentication powered by Shopify</span>
                </div>
              </div>
            </div>

            {/* Customer Benefits / Portal Overview (Profile, Orders, Addresses) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Feature 1: Profile */}
              <div className="bg-white p-6 rounded-xl border border-[#EADBCE] shadow-2xs hover:border-[#C5A059]/60 hover:shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A]">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#380C19]">
                    Personal Profile
                  </h3>
                </div>
                <p className="text-xs text-[#8A7B78] leading-relaxed">
                  Access your verified customer credentials, contact details, and account preferences across the Harini boutique.
                </p>
              </div>

              {/* Feature 2: Orders */}
              <div className="bg-white p-6 rounded-xl border border-[#EADBCE] shadow-2xs hover:border-[#C5A059]/60 hover:shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A]">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#380C19]">
                    Order Tracking
                  </h3>
                </div>
                <p className="text-xs text-[#8A7B78] leading-relaxed">
                  Follow real-time courier fulfillment (DTDC, Blue Dart, DHL Express), view order summaries, and download GST tax invoices.
                </p>
              </div>

              {/* Feature 3: Saved Addresses */}
              <div className="bg-white p-6 rounded-xl border border-[#EADBCE] shadow-2xs hover:border-[#C5A059]/60 hover:shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#380C19]">
                    Saved Addresses
                  </h3>
                </div>
                <p className="text-xs text-[#8A7B78] leading-relaxed">
                  Store and manage home and celebration delivery destinations to enjoy smooth, one-touch checkouts on future orders.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

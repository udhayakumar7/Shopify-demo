import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { completeCustomerLogin } from "../services/shopify/customer";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { AlertCircle, ArrowLeft, RotateCw, ShieldCheck } from "lucide-react";

export default function AccountCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const hasStartedExchange = useRef(false);

  useEffect(() => {
    // Prevent duplicate authorization-code exchanges in React Strict Mode
    if (hasStartedExchange.current) return;
    hasStartedExchange.current = true;

    let active = true;

    async function finishLogin() {
      try {
        await completeCustomerLogin();

        // Clean up OAuth query parameters from the address bar
        window.history.replaceState(
          {},
          document.title,
          "/account/callback"
        );

        if (active) {
          toast.success("Signed in successfully!");
          navigate("/account", { replace: true });
        }
      } catch (err) {
        if (active) {
          console.error("[AccountCallback Error]:", err);

          let friendlyMessage =
            err.message ||
            "Unable to complete sign in. Please verify your details and try again.";

          // Provide friendly user explanations for known OAuth response conditions
          const lowerMsg = friendlyMessage.toLowerCase();
          if (lowerMsg.includes("access_denied")) {
            friendlyMessage =
              "Sign-in was canceled. Please try again whenever you are ready.";
          } else if (
            lowerMsg.includes("expired") ||
            lowerMsg.includes("login_required") ||
            lowerMsg.includes("invalid authentication state")
          ) {
            friendlyMessage =
              "Your sign-in session has expired. Please initiate a new login.";
          } else if (lowerMsg.includes("missing authorization code")) {
            friendlyMessage =
              "No authorization code was received from Shopify. Please try signing in again.";
          }

          setError(friendlyMessage);
        }
      }
    }

    finishLogin();

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FFF8F3] px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#EADBCE] p-8 sm:p-10 text-center shadow-sm relative overflow-hidden">
        {/* Subtle Luxury Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

        {/* Brand Monogram / Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFF8F3] border-2 border-[#C5A059]/40 flex items-center justify-center p-3 shadow-inner">
            <img
              src={logo}
              alt="Harini Sarees"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl font-medium text-[#380C19]">
              Authentication Failed
            </h2>

            <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed">
              {error}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/account")}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#7B1E3A] text-white text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#63172e] transition-colors shadow-sm cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#EADBCE] text-[#380C19] text-xs sm:text-sm font-medium hover:bg-[#FFF8F3] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Store Home</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Elegant double-ring loading animation */}
            <div className="relative w-12 h-12 mx-auto my-2">
              <div className="absolute inset-0 rounded-full border-3 border-[#F4DCD6]" />
              <div className="absolute inset-0 rounded-full border-3 border-[#7B1E3A] border-t-transparent animate-spin" />
              <div className="absolute inset-1.5 rounded-full border-2 border-[#C5A059] border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
            </div>

            <h2 className="font-serif text-2xl font-medium text-[#380C19]">
              Securing your account...
            </h2>

            <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed">
              Please wait while we securely connect your account.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#8A7B78]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Verifying credentials with Shopify</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

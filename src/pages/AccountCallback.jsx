import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeCustomerLogin } from "../services/shopify/customer";
import toast from "react-hot-toast";
import { AlertCircle, ArrowLeft, RotateCw } from "lucide-react";

export default function AccountCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
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
          setError(
            err.message ||
              "Unable to complete sign in. Please verify your details and try again."
          );
        }
      }
    }

    finishLogin();

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FFF8F3] px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#EADBCE] p-8 sm:p-10 text-center shadow-sm">
        {error ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F4DCD6] text-[#7B1E3A] flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
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
            <div className="w-12 h-12 rounded-full border-3 border-[#7B1E3A] border-t-transparent animate-spin mx-auto" />

            <h2 className="font-serif text-2xl font-medium text-[#380C19]">
              Authenticating With Shopify
            </h2>

            <p className="text-xs sm:text-sm text-[#8A7B78] leading-relaxed">
              Please wait a moment while we verify your credentials and connect your account...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

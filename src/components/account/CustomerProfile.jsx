import React from "react";
import { Mail, Phone, ShieldCheck, Sparkles, LogOut } from "lucide-react";
import Button from "../common/Button";

export default function CustomerProfile({ profile, onLogout, loggingOut = false }) {
  if (!profile) return null;

  const initials =
    [profile.firstName?.[0], profile.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || profile.displayName?.[0]?.toUpperCase() || "H";

  return (
    <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 sm:p-8 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EADBCE]">
        {/* Patron Info Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F4DCD6] border-2 border-[#C5A059]/40 text-[#7B1E3A] flex items-center justify-center font-serif text-2xl font-bold shrink-0 shadow-sm">
            {initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-medium text-[#380C19]">
                {profile.displayName || `${profile.firstName} ${profile.lastName}`.trim()}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#A4813E] text-[10px] font-semibold tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                Heritage Patron
              </span>
            </div>
            <p className="text-xs text-[#8A7B78] mt-0.5">
              Shopify Customer Account ID: {profile.id?.split("/").pop() || profile.id}
            </p>
          </div>
        </div>

        {/* Sign Out CTA */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            loading={loggingOut}
            icon={LogOut}
            className="border-[#EADBCE] text-[#7B1E3A] hover:bg-[#F4DCD6]/40 hover:border-[#7B1E3A]"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Customer Contact Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
        {/* Email Address */}
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FFF8F3] border border-[#EADBCE]/70">
          <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A] shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78]">
              Registered Email
            </p>
            <p className="text-sm font-medium text-[#380C19] truncate mt-0.5">
              {profile.email || "No email on file"}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#2E7D32] mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified via Shopify</span>
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FFF8F3] border border-[#EADBCE]/70">
          <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A] shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78]">
              Primary Contact Phone
            </p>
            <p className="text-sm font-medium text-[#380C19] truncate mt-0.5">
              {profile.phone || "No phone added yet"}
            </p>
            <p className="text-[11px] text-[#8A7B78] mt-1">
              Used for courier delivery alerts & OTP updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

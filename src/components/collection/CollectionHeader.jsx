import React from "react";
import Breadcrumb from "../common/Breadcrumb";
import { Sparkles } from "lucide-react";

/**
 * Minimalist, luxury collection header.
 * Displays breadcrumb trail, collection title, optional description, and product count.
 */
export default function CollectionHeader({
  title = "Collection",
  description = "",
  totalCount = 0,
  loading = false,
}) {
  return (
    <div className="border-b border-[#EADBCE] pb-6 mb-8">
      {/* Breadcrumb Trail */}
      <Breadcrumb
        items={[
          { label: "Collections", path: "/products" },
          { label: title },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#C5A059] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harini Luxury Edit</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#380C19] tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="text-xs sm:text-sm text-[#8A7B78] mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Product Count */}
        <div className="text-xs text-[#8A7B78] shrink-0 self-start sm:self-end">
          {loading ? (
            <span className="inline-block h-4 w-16 bg-[#F4DCD6]/60 animate-pulse rounded" />
          ) : (
            <span>
              Showing <strong className="text-[#7B1E3A] font-semibold">{totalCount}</strong>{" "}
              {totalCount === 1 ? "design" : "designs"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

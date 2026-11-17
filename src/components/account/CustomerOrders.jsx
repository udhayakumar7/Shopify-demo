import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  Truck,
  RotateCw,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "../../utils/currency";
import { PRODUCT_FALLBACK_IMAGE } from "../../config/banners";
import { Skeleton } from "../common/Skeleton";
import Button from "../common/Button";

function FinancialStatusBadge({ status }) {
  const normalized = status?.toUpperCase() || "PENDING";
  if (normalized === "PAID") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Paid
      </span>
    );
  }
  if (normalized === "REFUNDED") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
      {status}
    </span>
  );
}

function FulfillmentStatusBadge({ status }) {
  const normalized = status?.toUpperCase() || "UNFULFILLED";
  if (normalized === "FULFILLED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <Truck className="w-3 h-3 text-emerald-700" />
        Delivered
      </span>
    );
  }
  if (normalized === "IN_TRANSIT") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
        <Truck className="w-3 h-3 text-blue-700" />
        In Transit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F4DCD6] text-[#7B1E3A] border border-[#7B1E3A]/20">
      Processing Weave
    </span>
  );
}

export default function CustomerOrders({
  orders = [],
  loading = false,
  error = null,
  onRefresh,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 sm:p-8 shadow-sm mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#EADBCE]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#380C19]">
                Order History & Shipments
              </h2>
              {!loading && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFF8F3] border border-[#EADBCE] text-[11px] font-semibold text-[#7B1E3A]">
                  {orders.length}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8A7B78] mt-0.5">
              Live updates on artisan handcrafting, dispatch waybills, and invoices.
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-[#8A7B78] hover:text-[#7B1E3A] transition-colors rounded-lg hover:bg-[#FFF8F3] cursor-pointer"
            title="Refresh Orders"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 pt-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-[#EADBCE] space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-20 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 text-center text-xs text-[#7B1E3A] bg-[#F4DCD6] rounded-xl my-6">
          <p className="font-medium">Unable to fetch orders from Shopify</p>
          <p className="mt-1 text-[#8A7B78]">{error}</p>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="mt-3 border-[#7B1E3A]"
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="py-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FFF8F3] border border-[#EADBCE] text-[#C5A059] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-[#380C19]">
              No Orders Placed Yet
            </h3>
            <p className="text-xs text-[#8A7B78] mt-1 leading-relaxed">
              When you purchase our handcrafted pure silk sarees, your complete shipment tracking, invoices, and waybills will appear here in real time.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/products">
              <Button variant="primary" size="md">
                Explore Saree Catalogue
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6 pt-6">
          {orders.map((order) => {
            const dateFormatted = order.processedAt
              ? new Date(order.processedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recent";

            return (
              <div
                key={order.id}
                className="rounded-xl border border-[#EADBCE] bg-[#FFF8F3]/40 overflow-hidden shadow-xs hover:border-[#C5A059]/60 transition-all"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-white border-b border-[#EADBCE] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7B78] block">
                        Order
                      </span>
                      <span className="font-serif text-base font-semibold text-[#380C19]">
                        {order.name || `#${order.orderNumber}`}
                      </span>
                    </div>

                    <div className="h-8 w-[1px] bg-[#EADBCE] hidden sm:block" />

                    <div className="hidden sm:block">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7B78] block">
                        Date Placed
                      </span>
                      <span className="text-xs font-medium text-[#380C19] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#C5A059]" />
                        {dateFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FinancialStatusBadge status={order.financialStatus} />
                    <FulfillmentStatusBadge status={order.fulfillmentStatus} />
                    <div className="text-right pl-2 border-l border-[#EADBCE]">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7B78] block">
                        Total
                      </span>
                      <span className="font-serif text-sm font-bold text-[#7B1E3A]">
                        {formatPrice(
                          order.totalPrice?.amount,
                          order.totalPrice?.currencyCode
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="p-4 sm:p-5 divide-y divide-[#EADBCE]/50">
                  {order.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={item.image || PRODUCT_FALLBACK_IMAGE}
                          alt={item.title}
                          className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-lg border border-[#EADBCE] shrink-0 bg-white"
                          onError={(e) => {
                            e.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-[#380C19] truncate">
                            {item.title}
                          </h4>
                          {item.variantTitle && (
                            <p className="text-[11px] text-[#8A7B78] mt-0.5">
                              {item.variantTitle}
                            </p>
                          )}
                          <p className="text-[11px] text-[#8A7B78] mt-1">
                            Qty: <span className="font-medium text-[#380C19]">{item.quantity}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-medium text-[#380C19]">
                          {formatPrice(
                            item.price?.amount,
                            item.price?.currencyCode
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

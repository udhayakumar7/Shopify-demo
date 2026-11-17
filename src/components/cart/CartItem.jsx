import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import { PRODUCT_FALLBACK_IMAGE } from "../../config/banners";

export default function CartItem({
  item,
  isUpdating = false,
  onUpdateQuantity,
  onRemove,
  onItemClick,
}) {
  const merchandise = item?.merchandise;
  const product = merchandise?.product;
  const variantTitle = merchandise?.title !== "Default Title" ? merchandise?.title : null;
  const imageUrl = product?.featuredImage?.url || PRODUCT_FALLBACK_IMAGE;
  const altText = product?.featuredImage?.altText || product?.title || "Saree";

  const unitPrice = merchandise?.price?.amount || "0";
  const currencyCode = merchandise?.price?.currencyCode || "INR";
  const lineTotal = item?.cost?.totalAmount?.amount || (Number(unitPrice) * item.quantity).toString();

  return (
    <div className="flex gap-4 py-4 border-b border-[#EADBCE] group">
      {/* Thumbnail */}
      <Link
        to={`/products/${product?.handle}`}
        onClick={onItemClick}
        className="shrink-0 w-20 h-24 sm:w-24 sm:h-28 rounded-md overflow-hidden bg-[#F4DCD6]/30 border border-[#EADBCE]"
      >
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/products/${product?.handle}`}
              onClick={onItemClick}
              className="text-sm font-medium text-[#380C19] hover:text-[#7B1E3A] transition-colors line-clamp-1"
            >
              {product?.title || "Handcrafted Saree"}
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              disabled={isUpdating}
              className="text-[#8A7B78] hover:text-[#7B1E3A] p-1 -mr-1 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {variantTitle && (
            <p className="text-xs text-[#8A7B78] mt-0.5">
              Variant: <span className="font-medium text-[#521225]">{variantTitle}</span>
            </p>
          )}

          <p className="text-xs text-[#8A7B78] mt-1">
            {formatPrice(unitPrice, currencyCode)} each
          </p>
        </div>

        {/* Stepper & Line Total */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center border border-[#EADBCE] rounded bg-white">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="p-1 sm:p-1.5 text-[#521225] hover:bg-[#F4DCD6]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-medium text-[#380C19]">
              {isUpdating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isUpdating}
              className="p-1 sm:p-1.5 text-[#521225] hover:bg-[#F4DCD6]/50 disabled:opacity-30 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-sm font-semibold text-[#7B1E3A]">
            {formatPrice(lineTotal, currencyCode)}
          </span>
        </div>
      </div>
    </div>
  );
}

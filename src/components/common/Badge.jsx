import React from "react";
import clsx from "clsx";

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) {
  const base = "inline-flex items-center font-medium uppercase tracking-wider rounded-full";

  const sizeStyles = {
    xs: "text-[10px] px-2 py-0.5",
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
  };

  const variantStyles = {
    default: "bg-[#F4DCD6] text-[#7B1E3A] border border-[#EADBCE]",
    primary: "bg-[#7B1E3A] text-[#FFF8F3]",
    gold: "bg-[#C5A059] text-white",
    goldOutline: "border border-[#C5A059] text-[#7B1E3A] bg-[#FFF8F3]/80",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    soldOut: "bg-stone-200 text-stone-700",
    sale: "bg-[#7B1E3A] text-white",
  };

  return (
    <span
      className={clsx(
        base,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

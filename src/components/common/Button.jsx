import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

/**
 * Premium branded button component adhering to design tokens.
 * Variants: primary (#7B1E3A), secondary (#C5A059), outline, ghost, goldOutline
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wide";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5",
    xl: "text-lg px-8 py-4 gap-3",
  };

  const variantStyles = {
    primary:
      "bg-[#7B1E3A] hover:bg-[#63172E] text-[#FFF8F3] shadow-sm hover:shadow-md focus:ring-[#7B1E3A]",
    secondary:
      "bg-[#C5A059] hover:bg-[#A4813E] text-white shadow-sm hover:shadow-md focus:ring-[#C5A059]",
    outline:
      "border border-[#7B1E3A] text-[#7B1E3A] hover:bg-[#7B1E3A] hover:text-[#FFF8F3] focus:ring-[#7B1E3A]",
    goldOutline:
      "border border-[#C5A059] text-[#7B1E3A] hover:bg-[#C5A059] hover:text-white focus:ring-[#C5A059]",
    ghost:
      "text-[#7B1E3A] hover:bg-[#F4DCD6]/50 focus:ring-[#7B1E3A]",
    dark:
      "bg-[#380C19] hover:bg-[#20050D] text-[#FFF8F3] shadow-sm focus:ring-[#380C19]",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}

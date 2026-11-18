import React from "react";
import Button from "../common/Button";
import { RotateCw, AlertCircle } from "lucide-react";

/**
 * Cursor-based pagination Load More button with loading indicator,
 * truthful count label, and API error retry option.
 */
export default function LoadMoreButton({
  hasNextPage = false,
  loading = false,
  onLoadMore,
  currentCount = 0,
  error = "",
  onRetry,
}) {
  if (!hasNextPage && !error) return null;

  return (
    <div className="pt-10 sm:pt-14 pb-8 text-center flex flex-col items-center justify-center">
      {currentCount > 0 && (
        <p className="text-xs text-[#8A7B78] mb-3">
          Showing <span className="font-semibold text-[#380C19]">{currentCount}</span> designs loaded
        </p>
      )}

      {error ? (
        <div className="flex flex-col items-center gap-2.5 p-3 rounded-lg bg-red-50/70 border border-red-200 max-w-sm">
          <div className="flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry || onLoadMore}
            icon={RotateCw}
            className="text-xs border-red-300 text-red-800 hover:bg-red-100"
          >
            Retry Loading
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="md"
          loading={loading}
          disabled={loading}
          onClick={onLoadMore}
          icon={RotateCw}
          className="min-w-[200px] border-[#7B1E3A] text-[#7B1E3A] hover:bg-[#7B1E3A] hover:text-white transition-all shadow-2xs"
        >
          {loading ? "Loading More Pieces..." : "Load More Designs"}
        </Button>
      )}
    </div>
  );
}

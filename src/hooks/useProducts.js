import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/shopify/products";

export function useProducts(initialOptions = {}) {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts({ ...initialOptions, ...options });
      setProducts(data.products);
      setPageInfo(data.pageInfo);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || loadingMore) return;

    try {
      setLoadingMore(true);
      const data = await getProducts({
        ...initialOptions,
        after: pageInfo.endCursor,
      });

      setProducts((prev) => [...prev, ...data.products]);
      setPageInfo(data.pageInfo);
    } catch (err) {
      console.error("[useProducts] Failed to load more:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [pageInfo, loadingMore, initialOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pageInfo,
    loading,
    loadingMore,
    error,
    refresh: fetchProducts,
    loadMore,
  };
}

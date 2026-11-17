import { useState, useEffect } from "react";
import { getCollections } from "../services/shopify/collections";

export function useCollections(limit = 20) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getCollections(limit);
        if (mounted) setCollections(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load collections");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [limit]);

  return { collections, loading, error };
}

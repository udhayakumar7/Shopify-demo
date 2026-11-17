
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../search";

function SearchBar() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            const keyword = searchTerm.trim();
            if (keyword.length < 2) {
                setSuggestions([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const results = await searchProducts(keyword);
                setSuggestions(results.slice(0, 5));
            } catch (error) {
                console.error("Search suggestions failed:", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    function handleSearch(e) {
        e.preventDefault();

        const keyword = searchTerm.trim();
        if (!keyword) return;

        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
    }

    function openProduct(handle) {
        setShowSuggestions(false);
        setSearchTerm("");
        navigate(`/products/${handle}`);
    }

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
            <form
                onSubmit={handleSearch}
                style={{ display: "flex", gap: "8px" }}
            >
                <input
                    type="search"
                    placeholder="Search sarees, products..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    style={{
                        flex: 1,
                        padding: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                    }}
                />

                <button type="submit" style={{ padding: "12px 20px" }}>
                    Search
                </button>
            </form>

            {showSuggestions && searchTerm.trim().length >= 2 && (
                <div
                    style={{
                        position: "absolute",
                        top: "48px",
                        left: 0,
                        right: 0,
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        zIndex: 100,
                        boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
                        overflow: "hidden",
                    }}
                >
                    {loading && <p style={{ padding: "12px" }}>Searching...</p>}

                    {!loading && suggestions.length === 0 && (
                        <p style={{ padding: "12px" }}>No matching products found.</p>
                    )}

                    {!loading &&
                        suggestions.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => openProduct(product.handle)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    width: "100%",
                                    padding: "10px",
                                    border: "none",
                                    borderBottom: "1px solid #eee",
                                    background: "white",
                                    textAlign: "left",
                                    cursor: "pointer",
                                }}
                            >
                                {product.featuredImage?.url && (
                                    <img
                                        src={product.featuredImage.url}
                                        alt=""
                                        style={{
                                            width: "50px",
                                            height: "55px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}

                                <span>{product.title}</span>
                            </button>
                        ))}

                    {!loading && suggestions.length > 0 && (
                        <button
                            type="button"
                            onClick={handleSearch}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "#f5f5f5",
                                cursor: "pointer",
                            }}
                        >
                            View all search results
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;

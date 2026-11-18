import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Home is kept eager for immediate LCP paint
import Home from "./pages/Home";
import AccountCallback from "./pages/AccountCallback";

// Lazy-loaded routes for performance & code splitting
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const CollectionProducts = lazy(() => import("./pages/CollectionProducts"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Account = lazy(() => import("./pages/Account"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4 text-center">
      <div className="w-10 h-10 rounded-full border-3 border-[#7B1E3A] border-t-transparent animate-spin mx-auto mb-3" />
      <p className="font-serif text-sm text-[#380C19]">Weaving Experience...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:handle" element={<ProductDetails />} />
                <Route path="/collections/:handle" element={<CollectionProducts />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/account" element={<Account />} />
                <Route
                  path="/account/callback"
                  element={<AccountCallback />}
                />
                <Route path="/about" element={<PolicyPage defaultType="about" />} />
                <Route path="/contact" element={<PolicyPage defaultType="contact" />} />
                <Route path="/faq" element={<PolicyPage defaultType="faq" />} />
                <Route path="/policies/:type" element={<PolicyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;

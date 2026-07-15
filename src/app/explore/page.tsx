"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Star, ShoppingCart, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { Product, ProductsResponse } from "@/types/product";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/contexts/CartContext";

const categories = ["All", "Electronics", "Fashion", "Home & Living", "Sports"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api`;
const ITEMS_PER_PAGE = 8;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card">
      <div className="aspect-square bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 rounded bg-muted" />
          ))}
        </div>
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-9 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem, items: cartItems } = useCart();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (activeCategory !== "All") params.set("category", activeCategory);
        params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", String(ITEMS_PER_PAGE));

        const res = await fetch(`${API_BASE}/products?${params}`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || `Request failed (${res.status})`);
        }
        const json: ProductsResponse = await res.json();
        setProducts(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [debouncedSearch, activeCategory, sort, page]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setPage(1);
  }

  function handleSortChange(value: string) {
    setSort(value);
    setPage(1);
  }

  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAddToCart(product: Product) {
    if (!session?.session?.token) {
      sessionStorage.setItem("pendingCart", JSON.stringify({ productId: product._id, quantity: 1 }));
      router.push("/auth/login");
      return;
    }
    const image = product.images?.[0] || "";
    const price = product.discountPrice ?? product.price;
    addItem(product._id, product.name, price, image, 1);
  }

  function isInCart(productId: string) {
    return cartItems.some((item) => item.productId === productId);
  }

  return (
    <div>
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Explore Products</h1>
          <p className="mt-2 text-lg text-white/80">
            Find your next favorite thing
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Sort Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="mt-6 text-sm text-muted-foreground">
          {loading ? "Loading..." : `Showing ${products.length} of ${total} results`}
        </p>

        {/* Error State */}
        {error && (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-destructive">{error}</p>
            <button
              onClick={() => setPage((p) => p)}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !error && (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const currentPrice = product.discountPrice ?? product.price;
                const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;

                return (
                  <div
                    key={product._id}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
                  >
                    {hasDiscount && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        Sale
                      </span>
                    )}
                    <div className="flex aspect-square items-center justify-center bg-muted overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-4xl text-muted-foreground/30">🛍️</span>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <h3 className="text-sm font-semibold text-foreground">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <StarRating rating={product.rating} />
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          ${currentPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {isInCart(product._id) ? (
                        <button
                          onClick={() => router.push("/explore")}
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
                        >
                          <Check size={16} />
                          In Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {products.length === 0 && !loading && (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && !error && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center justify-center rounded-lg border border-input p-2 text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center rounded-lg border border-input p-2 text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

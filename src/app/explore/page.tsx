"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

const allProducts = [
  { id: 1, name: "Wireless Headphones", price: 79.99, originalPrice: 129.99, rating: 4.5, reviews: 234, category: "Electronics", badge: "Sale" },
  { id: 2, name: "Minimalist Watch", price: 149.99, originalPrice: null, rating: 4.8, reviews: 189, category: "Fashion", badge: "Best Seller" },
  { id: 3, name: "Leather Backpack", price: 89.99, originalPrice: 119.99, rating: 4.3, reviews: 312, category: "Fashion", badge: "Sale" },
  { id: 4, name: "Smart Speaker", price: 199.99, originalPrice: null, rating: 4.6, reviews: 456, category: "Electronics", badge: "New" },
  { id: 5, name: "Running Shoes", price: 129.99, originalPrice: 159.99, rating: 4.7, reviews: 521, category: "Sports", badge: "Best Seller" },
  { id: 6, name: "Cotton T-Shirt", price: 29.99, originalPrice: null, rating: 4.2, reviews: 678, category: "Fashion", badge: null },
  { id: 7, name: "Blender Pro", price: 69.99, originalPrice: 99.99, rating: 4.4, reviews: 143, category: "Home & Living", badge: "Sale" },
  { id: 8, name: "Yoga Mat", price: 39.99, originalPrice: null, rating: 4.1, reviews: 289, category: "Sports", badge: null },
  { id: 9, name: "Mechanical Keyboard", price: 119.99, originalPrice: null, rating: 4.9, reviews: 876, category: "Electronics", badge: "New" },
  { id: 10, name: "Desk Lamp", price: 49.99, originalPrice: 69.99, rating: 4.3, reviews: 198, category: "Home & Living", badge: "Sale" },
  { id: 11, name: "Denim Jacket", price: 89.99, originalPrice: null, rating: 4.5, reviews: 345, category: "Fashion", badge: null },
  { id: 12, name: "Fitness Tracker", price: 59.99, originalPrice: 89.99, rating: 4.6, reviews: 432, category: "Electronics", badge: "Best Seller" },
];

const categories = ["All", "Electronics", "Fashion", "Home & Living", "Sports"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

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

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [search, activeCategory, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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
              onClick={() => { setActiveCategory(cat); setPage(1); }}
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
          Showing {paginated.length} of {filtered.length} results
        </p>

        {/* Product Grid */}
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
            >
              {product.badge && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {product.badge}
                </span>
              )}
              <div className="flex aspect-square items-center justify-center bg-muted">
                <span className="text-4xl text-muted-foreground/30">🛍️</span>
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <h3 className="text-sm font-semibold text-foreground">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>
                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-foreground">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
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

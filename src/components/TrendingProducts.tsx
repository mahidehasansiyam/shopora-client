import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 234,
    badge: "Sale",
    image: null,
  },
  {
    id: 2,
    name: "Minimalist Watch",
    price: 149.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 189,
    badge: "Best Seller",
    image: null,
  },
  {
    id: 3,
    name: "Leather Backpack",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.3,
    reviews: 312,
    badge: "Sale",
    image: null,
  },
  {
    id: 4,
    name: "Smart Speaker",
    price: 199.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 456,
    badge: "New",
    image: null,
  },
];

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

export default function TrendingProducts() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Trending Products
          </h2>
          <p className="mt-2 text-muted-foreground">
            Most popular picks right now
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
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
                <span className="text-4xl text-muted-foreground/30">
                  🛍️
                </span>
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
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
        <div className="mt-10 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
          >
            View All Products
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

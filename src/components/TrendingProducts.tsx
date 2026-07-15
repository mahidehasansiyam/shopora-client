"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api`;

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
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem, items: cartItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const params = new URLSearchParams({ sort: "newest", limit: "4", page: "1" });
        const res = await fetch(`${API_BASE}/products?${params}`);
        if (res.ok) {
          const json = await res.json();
          setProducts(json.data || []);
        }
      } catch {
        // silently fail
      }
    }
    fetchTrending();
  }, []);

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

  if (products.length === 0) return null;

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
                    <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
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

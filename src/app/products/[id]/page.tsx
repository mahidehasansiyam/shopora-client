"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Check,
  ArrowLeft,
  Minus,
  Plus,
  Package,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/contexts/CartContext";
import type { Product, SingleProductResponse } from "@/types/product";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api`;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem, items: cartItems } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/products/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found");
          throw new Error("Failed to load product");
        }
        const json: SingleProductResponse = await res.json();
        setProduct(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  function handleAddToCart() {
    if (!product) return;
    if (!session?.session?.token) {
      sessionStorage.setItem("pendingCart", JSON.stringify({ productId: product._id, quantity }));
      router.push("/auth/login");
      return;
    }
    const image = product.images?.[0] || "";
    const price = product.discountPrice ?? product.price;
    addItem(product._id, product.name, price, image, quantity);
  }

  function isInCart(productId: string) {
    return cartItems.some((item) => item.productId === productId);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-lg font-medium text-destructive">{error || "Product not found"}</p>
        <Link href="/explore" className="mt-4 text-sm text-primary hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const currentPrice = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const inStock = product.status === "active" && product.stock > 0;
  const images = product.images.length > 0 ? product.images : [""];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Explore
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl text-muted-foreground/30">🛍️</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-colors ${
                    i === selectedImage ? "border-primary" : "border-border hover:border-muted-foreground/40"
                  }`}
                >
                  {img ? (
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xl text-muted-foreground/30">🛍️</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
            {product.brand && (
              <p className="mt-1 text-sm text-muted-foreground">by {product.brand}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">${currentPrice.toFixed(2)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-600"}`}>
              {inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </span>
          </div>

          <hr className="border-border" />

          {/* Quantity Selector */}
          {inStock && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center rounded-lg border border-input">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>
                <span className="flex h-9 w-12 items-center justify-center text-sm font-medium text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          {isInCart(product._id) ? (
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90 sm:w-auto sm:px-8">
              <Check size={18} />
              In Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
            >
              <ShoppingCart size={18} />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">SSL encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

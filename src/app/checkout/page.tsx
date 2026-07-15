"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/lib/auth-client";
import { createOrder } from "@/lib/order-api";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalItems, totalPrice, isLoading, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  if (!session?.session?.token) {
    router.push("/auth/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <ShoppingBag size={48} className="text-muted-foreground/30" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-1 text-muted-foreground">Add some items before checking out</p>
        <Link
          href="/explore"
          className="mt-6 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const shippingAddress = {
        fullName: formData.get("fullName") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zipCode") as string,
        phone: formData.get("phone") as string,
      };

      const res = await createOrder(session.session.token, shippingAddress);
      await clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-foreground">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-foreground">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="city" className="text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="state" className="text-sm font-medium text-foreground">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="text-sm font-medium text-foreground">
                  ZIP Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Placing Order..." : `Place Order — $${totalPrice.toFixed(2)}`}
          </button>
        </form>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
            <p className="text-sm text-muted-foreground">{totalItems} items</p>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-muted overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl text-muted-foreground/30">🛍️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <hr className="my-4 border-border" />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

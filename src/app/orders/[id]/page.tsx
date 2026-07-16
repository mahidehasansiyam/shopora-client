"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, CreditCard } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { fetchOrder } from "@/lib/order-api";
import { toast } from "react-toastify";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api`;

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
}

const paymentLabels: Record<string, { label: string; color: string }> = {
  unpaid: { label: "Pending Payment", color: "text-amber-600 bg-amber-50" },
  paid: { label: "Paid", color: "text-green-600 bg-green-50" },
  failed: { label: "Payment Failed", color: "text-red-600 bg-red-50" },
};

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const justPaid = searchParams.has("session_id");

  useEffect(() => {
    if (isPending) return;
    if (!session?.session?.token) {
      router.push("/auth/login");
      return;
    }
    const tkn = session.session.token;
    async function load() {
      try {
        const res = await fetchOrder(tkn, params.id as string);
        setOrder(res.data);
      } catch {
        setError("Order not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session, params.id, router, isPending]);

  useEffect(() => {
    if (!justPaid || !order || order.paymentStatus !== "unpaid" || !session?.session?.token) return;
    const tkn = session.session.token;
    const sessionId = searchParams.get("session_id");
    async function verify() {
      try {
        const res = await fetch(`${API_BASE}/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${tkn}` },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) return;
        const orderRes = await fetchOrder(tkn, params.id as string);
        setOrder(orderRes.data);
      } catch {
        toast.error("Failed to verify payment");
      }
    }
    verify();
  }, [justPaid, order, session, searchParams, params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-lg font-medium text-destructive">{error || "Order not found"}</p>
        <Link href="/explore" className="mt-4 text-sm text-primary hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const createdDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      {justPaid && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <CreditCard size={24} className="mx-auto text-green-600" />
          <p className="mt-1 text-sm font-semibold text-green-700">Payment successful!</p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle size={48} className="mx-auto text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Order Placed!</h1>
        <p className="mt-1 text-muted-foreground">Thank you for your purchase</p>
        <div className="mt-2 inline-block rounded-full bg-muted px-4 py-1 text-sm text-muted-foreground">
          Order #{order._id.slice(-8).toUpperCase()}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Placed on {createdDate}</p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Items</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl text-muted-foreground/30">🛍️</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Order Info</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize text-foreground">{order.status}</span>
            </div>
            {order.paymentStatus && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${paymentLabels[order.paymentStatus]?.color || "bg-muted text-muted-foreground"}`}>
                  {paymentLabels[order.paymentStatus]?.label || order.paymentStatus}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between text-base">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-foreground">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

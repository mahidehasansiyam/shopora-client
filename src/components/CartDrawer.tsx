"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, isLoading, updateQty, removeItem } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100%-140px)] flex-col overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingBag size={48} className="text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-foreground">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add some items to get started</p>
              <Link
                href="/explore"
                onClick={onClose}
                className="mt-6 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-muted overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-muted-foreground/30">🛍️</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-foreground line-clamp-1">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-foreground">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="mt-3 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

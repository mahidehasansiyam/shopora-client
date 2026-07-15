"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import * as cartApi from "@/lib/cart-api";
import { toast } from "react-toastify";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addItem: (productId: string, name: string, price: number, image: string, quantity?: number) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const token = session?.session?.token;
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const prevTokenRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (token === prevTokenRef.current) return;
    prevTokenRef.current = token;

    let cancelled = false;

    if (!token) {
      Promise.resolve().then(() => setItems([]));
      return;
    }

    Promise.resolve().then(() => setIsLoading(true));

    cartApi.fetchCart(token)
      .then((res) => {
        if (!cancelled) setItems(res.data?.items || []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [token]);

  const addItem = useCallback(async (productId: string, name: string, price: number, image: string, quantity = 1) => {
    if (!token) return;
    try {
      const res = await cartApi.addToCart(token, productId, quantity);
      setItems(res.data.items);
      toast.success(`${name} added to cart!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    }
  }, [token]);

  const updateQty = useCallback(async (productId: string, quantity: number) => {
    if (!token) return;
    try {
      const res = await cartApi.updateCartItem(token, productId, quantity);
      setItems(res.data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update quantity");
    }
  }, [token]);

  const removeItem = useCallback(async (productId: string) => {
    if (!token) return;
    try {
      const res = await cartApi.removeCartItem(token, productId);
      setItems(res.data.items);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove item");
    }
  }, [token]);

  const clearCart = useCallback(async () => {
    if (!token) return;
    try {
      await cartApi.clearCart(token);
      setItems([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to clear cart");
    }
  }, [token]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, isLoading, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api`;

function headers(token?: string): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export async function fetchCart(token: string) {
  const res = await fetch(`${API_BASE}/cart`, { headers: headers(token) });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(token: string, productId: string, quantity: number) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add to cart");
  return data;
}

export async function updateCartItem(token: string, productId: string, quantity: number) {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update item");
  return data;
}

export async function removeCartItem(token: string, productId: string) {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) throw new Error("Failed to remove item");
  return res.json();
}

export async function clearCart(token: string) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
}

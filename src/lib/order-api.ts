const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api`;

function headers(token?: string): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export async function createOrder(token: string, shippingAddress: {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ shippingAddress }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create order");
  return data;
}

export async function fetchOrders(token: string) {
  const res = await fetch(`${API_BASE}/orders`, { headers: headers(token) });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function fetchOrder(token: string, id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}`, { headers: headers(token) });
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

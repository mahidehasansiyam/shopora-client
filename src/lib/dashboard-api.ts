const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api`;

function headers(token?: string): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export interface DashboardStats {
  totalRevenue: number;
  revenuePrevPeriod: number;
  totalOrders: number;
  ordersPrevPeriod: number;
  totalProducts: number;
  totalUsers: number;
  usersPrevPeriod: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface OrderPoint {
  date: string;
  count: number;
}

export interface OrderStatusBucket {
  status: string;
  count: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface RecentOrder {
  _id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  images: string[];
}

export interface DashboardData {
  stats: DashboardStats;
  revenueOverTime: RevenuePoint[];
  ordersOverTime: OrderPoint[];
  ordersByStatus: OrderStatusBucket[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

export async function fetchDashboard(token: string): Promise<DashboardData> {
  const res = await fetch(`${API_BASE}/dashboard`, { headers: headers(token) });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  const json = await res.json();
  return json.data;
}

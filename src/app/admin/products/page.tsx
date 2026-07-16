"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Loader2, Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import type { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/products?status=all&limit=10&page=${page}`);
        const json = await res.json();
        if (cancelled) return;
        if (json.success) {
          setProducts(json.data);
          setTotalPages(json.pagination.totalPages);
        } else {
          toast.error(json.message || "Failed to load products");
        }
      } catch {
        if (!cancelled) toast.error("Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [page]);

  async function handleDelete(productId: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(productId);
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        toast.error(json.message || "Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
      "out of stock": "bg-red-100 text-red-800",
    };
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product inventory.
          </p>
        </div>
        <Link
          href="/admin/post-product"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle size={48} className="text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">No products found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding your first product.
          </p>
          <Link
            href="/admin/post-product"
            className="mt-6 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{product.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      ${product.discountPrice ?? product.price}
                      {product.discountPrice && (
                        <span className="ml-1 text-xs text-muted-foreground line-through">
                          ${product.price}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      <span className={product.stock === 0 ? "text-destructive font-medium" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(product.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          aria-label="Edit product"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Delete product"
                        >
                          {deletingId === product._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

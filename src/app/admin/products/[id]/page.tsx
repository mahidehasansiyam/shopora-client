"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, ImagePlus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export default function AdminEditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API_BASE}/api/products/${productId}`);
        const json = await res.json();
        if (json.success) {
          const p: Product = json.data;
          setName(p.name);
          setSlug(p.slug);
          setDescription(p.description);
          setCategory(p.category);
          setBrand(p.brand || "");
          setPrice(String(p.price));
          setDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
          setStock(String(p.stock));
          setRating(p.rating ? String(p.rating) : "");
          setStatus(p.status);
          setImageUrls(p.images.length > 0 ? p.images : [""]);
        } else {
          toast.error("Product not found");
          router.replace("/admin/products");
        }
      } catch {
        toast.error("Failed to load product");
        router.replace("/admin/products");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId, router]);

  function addImageInput() {
    setImageUrls([...imageUrls, ""]);
  }

  function removeImageInput(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  }

  function updateImageUrl(index: number, value: string) {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !description || !category || !price || !stock || !status) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const payload: Record<string, unknown> = {
        name,
        slug,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        status,
        images: imageUrls.filter(Boolean),
      };

      if (brand) payload.brand = brand;
      if (discountPrice) payload.discountPrice = Number(discountPrice);
      if (rating) payload.rating = Number(rating);

      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
  const labelClass = "text-sm font-medium text-foreground";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update product details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className={labelClass}>
                Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slug" className={labelClass}>
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={inputClass}
                placeholder="product-slug"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="price" className={labelClass}>
                Price <span className="text-destructive">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="discountPrice" className={labelClass}>
                Discount Price
              </label>
              <input
                id="discountPrice"
                type="number"
                step="0.01"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="stock" className={labelClass}>
                Stock <span className="text-destructive">*</span>
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="rating" className={labelClass}>
                Rating
              </label>
              <input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="0.0"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="category" className={labelClass}>
                Category <span className="text-destructive">*</span>
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Electronics"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="brand" className={labelClass}>
                Brand
              </label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="status" className={labelClass}>
                Status <span className="text-destructive">*</span>
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
                required
              >
                <option value="" disabled>Select status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="out of stock">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                className={inputClass + " resize-y"}
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className={labelClass}>Images</label>
              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={inputClass}
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageInput(index)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageInput}
                  className="flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                >
                  <ImagePlus size={16} />
                  Add Image URL
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-6">
            <Link
              href="/admin/products"
              className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

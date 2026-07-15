"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, ImagePlus, Trash2 } from "lucide-react";

export default function AdminPostProduct() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const [loading, setLoading] = useState(false);

  function generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const slug = generateSlug(name);

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

    const formData = new FormData(e.currentTarget);

    const nameVal = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const status = formData.get("status") as string;

    if (!nameVal || !description || !category || !price || !stock || !status) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: nameVal,
        slug,
        description,
        category,
        brand: (formData.get("brand") as string) || undefined,
        price: Number(price),
        discountPrice: formData.get("discountPrice")
          ? Number(formData.get("discountPrice"))
          : undefined,
        stock: Number(stock),
        rating: formData.get("rating")
          ? Number(formData.get("rating"))
          : undefined,
        status,
        images: imageUrls.filter(Boolean),
      };

      console.log("Product details:", payload);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
      const res = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create product");
      }

      toast.success("Product posted successfully!");
      router.push("/admin/products");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
  const labelClass = "text-sm font-medium text-foreground";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Post Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new product to your inventory.
        </p>
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
                name="name"
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
                name="slug"
                type="text"
                value={slug}
                className={inputClass}
                disabled
                placeholder="auto-generated"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="price" className={labelClass}>
                Price <span className="text-destructive">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
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
                name="discountPrice"
                type="number"
                step="0.01"
                min="0"
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
                name="stock"
                type="number"
                min="0"
                step="1"
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
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
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
                name="category"
                type="text"
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
                name="brand"
                type="text"
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
                name="status"
                className={inputClass}
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select status
                </option>
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
                name="description"
                rows={4}
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

          <div className="mt-6 border-t border-border pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Posting..." : "Post Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

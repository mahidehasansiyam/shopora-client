export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  status: "active" | "draft" | "archived" | "out of stock";
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SingleProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

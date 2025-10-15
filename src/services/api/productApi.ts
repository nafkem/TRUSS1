// ~/FRONTEND/Truss_Main/Frontend/src/services/api/productApi.ts
export interface ProductData {
  id: string;
  title: string;
  description: string;
  price: string;
  seller: string;
  expectedDeliveryTime: number;
  image: string;
  sellerId: string;
  waranteeDuration: string;
  productId: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: string;
  seller: string;
  expectedDeliveryTime: number;
  sellerId: string;
  waranteeDuration: string;
  productId: string;
}

// Use environment variable with fallback
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json();
}

export const productApi = {
  // Fetch all products
  async getAllProducts(): Promise<ProductData[]> {
    const res = await fetch(`${API_BASE}/products`);
    return handleResponse(res);
  },

  // Fetch single product
  async getProductById(id: string): Promise<ProductData> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  // Create new product
  async createProduct(data: CreateProductRequest): Promise<ProductData> {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Upload product image
  async uploadProductImage(
    productId: string,
    imageFile: File
  ): Promise<{ imagePath: string }> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${API_BASE}/products/${productId}/image`, {
      method: "POST",
      body: formData,
    });

    return handleResponse(res);
  },

  // Helper to construct image URL
  getProductImageUrl(productId: string): string {
    return `${API_BASE}/products/${productId}/image`;
  },
};

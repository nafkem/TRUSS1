// src/contracts/product/service.ts
import { getProductContract } from "./contract";

export const productService = {
  /** Seller lists a product */
  async listProduct(title: string, unitPrice: number, warrantyDuration: number, expectedDeliveryTime: number) {
    const contract = await getProductContract();
    const tx = await contract.listProduct(unitPrice, title, warrantyDuration, expectedDeliveryTime);
    return { tx };
  },

  /** Update price of a product */
  async updateProductPrice(productId: number, newPrice: number) {
    const contract = await getProductContract();
    const tx = await contract.updateProductPrice(productId, newPrice);
    return { tx };
  },

  /** Get product details by ID */
  async getProductData(productId: number) {
    const contract = await getProductContract();
    return await contract.getProductData(productId);
  },

  /** Get paginated products list */
  async getProducts(start: number, end: number) {
    const contract = await getProductContract();
    return await contract.getProducts(start, end);
  },
};

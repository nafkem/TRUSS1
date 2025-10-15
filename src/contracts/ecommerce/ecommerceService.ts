// src/contracts/ecommerce/service.ts
import { getEcommerceContract } from "./contract";

export const ecommerceService = {
  /** Add product to buyer cart */
  async addProductToCart(productId: number, qty: number) {
    const contract = await getEcommerceContract();
    const tx = await contract.addProductToCart(productId, qty);
    return { tx };
  },

  /** Checkout using ETH */
  async checkOutWithNative(payToken: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.checkOutWithNative(payToken);
    return { tx };
  },

  /** Checkout using USD stable token */
  async checkOutWithUSD(payToken: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.checkOutWithUSD(payToken);
    return { tx };
  },

  /** Get buyer cart details */
  async getCart(userId: number) {
    const contract = await getEcommerceContract();
    return await contract.getCart(userId);
  },
};

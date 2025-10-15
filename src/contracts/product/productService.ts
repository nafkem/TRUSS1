// ~/FRONTEND/Truss_Main/Frontend/src/contracts/product/productService.ts
import { ethers, BigNumberish } from "ethers";
import {
  getProductContract,
  getProductContractReadOnly,
  getCurrentAccountAddress,
} from "./contract";

// ✅ Interface matching your current contract structure
export interface NormalizedProduct {
  productId: string;
  sellerId: string;
  title: string;
  price: string; // Human readable price
  unitPrice: bigint; // Raw contract value
  waranteeDuration: string;
  expectedDeliveryTime: string;
  whenToExpectDelivery: bigint; // Raw timestamp
}

// ✅ Enhanced normalizer that works with your current contract ABI
function normalizeProduct(raw: any): NormalizedProduct {
  // Your contract returns: (productId, sellerId, unitPrice, waranteeDuration, title, whenToExpectDelivery)
  return {
    productId: raw.productId?.toString() || '0',
    sellerId: raw.sellerId?.toString() || '0',
    title: raw.title || '',
    price: ethers.formatUnits(raw.unitPrice || 0, 8), // convert from 1e8 → readable
    unitPrice: raw.unitPrice || BigInt(0),
    waranteeDuration: raw.waranteeDuration?.toString() || '0',
    expectedDeliveryTime: raw.whenToExpectDelivery?.toString() || '0',
    whenToExpectDelivery: raw.whenToExpectDelivery || BigInt(0),
  };
}

export const productService = {
  async listProduct(
    price: BigNumberish,
    title: string,
    waranteeDuration: BigNumberish,
    expectedDeliveryTime: BigNumberish
  ) {
    const contract = await getProductContract();
    
    // Frontend validation since we can't modify contract
    if (!title || title.trim().length === 0) {
      throw new Error('Product title is required');
    }
    if (Number(price) <= 0) {
      throw new Error('Price must be greater than 0');
    }
    
    const priceInWei = ethers.parseUnits(price.toString(), 8);
    
    return contract.listProduct(
      priceInWei,
      title.trim(),
      waranteeDuration,
      expectedDeliveryTime
    );
  },

  async updateProductPrice(productId: BigNumberish, newPrice: BigNumberish) {
    const contract = await getProductContract();
    const signerAddress = await getCurrentAccountAddress();
    const priceInWei = ethers.parseUnits(newPrice.toString(), 8);
    
    return contract.updateProductPrice(signerAddress, productId, priceInWei);
  },

  async getProductData(productId: BigNumberish): Promise<NormalizedProduct> {
    const contract = await getProductContractReadOnly();
    
    if (!productId || productId.toString() === '0') {
      throw new Error('Valid product ID is required');
    }
    
    const raw = await contract.getProductData(productId);
    return normalizeProduct(raw);
  },

  async getProducts(start: BigNumberish, end: BigNumberish): Promise<NormalizedProduct[]> {
    const contract = await getProductContractReadOnly();

    let s = Number(start);
    let e = Number(end);

    if (isNaN(s) || isNaN(e) || s < 0) {
      throw new Error("Invalid start/end indexes");
    }
    if (e < s) return [];

    const MAX_ATTEMPTS = 1000;
    let attempts = 0;

    while (e >= s && attempts < MAX_ATTEMPTS) {
      try {
        const raws = await contract.getProducts(s, e);
        return raws.map(normalizeProduct);
      } catch (err: any) {
        const reason = err?.reason || (err?.error && err.error.message) || err?.message || "";

        if (!String(reason).toLowerCase().includes("end index out of bounds")) {
          console.error("getProducts failed with non-bounds error:", err);
          throw err;
        }

        e = e - 1;
        attempts++;
      }
    }

    return [];
  },

  async getAllProducts(): Promise<NormalizedProduct[]> {
    // Since we don't have getProductsCount in contract, we'll use batch fetching
    const BATCH_SIZE = 20;
    let allProducts: NormalizedProduct[] = [];
    let start = 0;
    let hasMore = true;
    const MAX_PRODUCTS = 500; // Safety limit

    while (hasMore && allProducts.length < MAX_PRODUCTS) {
      try {
        const batch = await this.getProducts(start, start + BATCH_SIZE - 1);
        if (batch.length === 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...batch];
          start += BATCH_SIZE;
        }
      } catch (error) {
        console.error("Error fetching products batch:", error);
        hasMore = false;
      }
    }

    return allProducts;
  },

  async getProductCreatedEvents(fromBlock?: number) {
    const contract = await getProductContract();
    const filter = contract.filters.ResgisteredAProduct();
    return contract.queryFilter(filter, fromBlock);
  },

  // ✅ CRITICAL: This method extracts product ID from transaction receipt
  async extractProductIdFromReceipt(receipt: ethers.ContractTransactionReceipt): Promise<string | null> {
    try {
      const eventInterface = new ethers.Interface([
        "event ResgisteredAProduct(uint256 indexed _productId, uint256 indexed _sellerId)"
      ]);
      
      for (const log of receipt.logs) {
        try {
          const parsedLog = eventInterface.parseLog(log);
          if (parsedLog?.name === "ResgisteredAProduct") {
            return parsedLog.args._productId.toString();
          }
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.error("Error extracting product ID from receipt:", error);
    }
    
    return null;
  },

  // ✅ Helper to estimate product count (since contract doesn't have this function)
  async estimateProductsCount(): Promise<number> {
    try {
      const products = await this.getAllProducts();
      return products.length;
    } catch (error) {
      console.error('Error estimating products count:', error);
      return 0;
    }
  },

  // ✅ Helper to get latest product (useful for finding newly created products)
  async getLatestProduct(): Promise<NormalizedProduct | null> {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.length > 0 ? allProducts[allProducts.length - 1] : null;
    } catch (error) {
      console.error('Error getting latest product:', error);
      return null;
    }
  }
};
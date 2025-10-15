// src/component/fetchProducts.ts
import { ethers } from "ethers"; // ethers v6
import { toast } from "sonner";

/**
 * Fetch all products safely.
 *
 * Strategy:
 * 1. Preferred: read on-chain events (getProductCreatedEvents).
 *    Events give exact productIds.
 * 2. Fallback: call getProducts in small batches (safe if ids are sequential).
 */
export const fetchAllProducts = async (productService: any) => {
  const result: any[] = [];

  // 1) Events-first approach
  if (productService && typeof productService.getProductCreatedEvents === "function") {
    try {
      const events = await productService.getProductCreatedEvents();

      for (const event of events) {
        if ("args" in event && event.args) {
          const {
            productId,
            title,
            description,
            price,
            seller,
            expectedDeliveryTime,
            image,
          } = event.args;

          result.push({
            id: Number(productId), // bigint -> number
            title: String(title),
            description: String(description),
            price: ethers.formatUnits(price, 8), // bigint -> string (8 decimals if contract uses 1e8)
            seller: String(seller),
            expectedDeliveryTime: Number(expectedDeliveryTime),
            image: String(image || ""), // fallback empty if not provided
          });
        }
      }

      return result;
    } catch (err) {
      console.warn("⚠️ Failed to fetch events; falling back to batch fetching.", err);
    }
  }

  // 2) Fallback: batch getProducts with shrinking-end strategy
  if (productService && typeof productService.getProducts === "function") {
    const all: any[] = [];
    let start = 0;
    const batchSize = 20;

    while (true) {
      const end = start + batchSize - 1;
      try {
        const batch = await productService.getProducts(start, end);

        if (!batch || batch.length === 0) break;

        const formatted = batch.map((p: any, idx: number) => ({
          id: Number(p.id ?? start + idx),
          title: String(p.title),
          description: String(p.description),
          price: ethers.formatUnits(p.price, 8),
          seller: String(p.seller),
          expectedDeliveryTime: Number(p.expectedDeliveryTime),
          image: String(p.image || ""),
        }));

        all.push(...formatted);
        if (batch.length < batchSize) break;
        start += batchSize;
      } catch (err) {
        let succeeded = false;
        for (let e = end - 1; e >= start; e--) {
          try {
            const smaller = await productService.getProducts(start, e);
            if (smaller && smaller.length > 0) {
              all.push(
                ...smaller.map((p: any, idx: number) => ({
                  id: Number(p.id ?? start + idx),
                  title: String(p.title),
                  description: String(p.description),
                  price: ethers.formatUnits(p.price, 8),
                  seller: String(p.seller),
                  expectedDeliveryTime: Number(p.expectedDeliveryTime),
                  image: String(p.image || ""),
                }))
              );
            }
            start = e + 1;
            succeeded = true;
            break;
          } catch {
            continue;
          }
        }
        if (!succeeded) break;
      }
    }

    return all;
  }

  toast.error("Unable to fetch products (no supported contract methods found).");
  return result;
};

/**
 * Buy helper:
 * - product: raw product object returned from fetchAllProducts
 *
 * NOTE:
 * - Assumes product.price is stored with 8 decimals (see contract).
 * - Replace native ETH transfer with ERC20 approve/transfer if needed.
 */
export const handleBuy = async (
  productService: any,
  product: any,
  account?: string | null
) => {
  try {
    if (!account) {
      toast.error("⚠️ Connect your wallet to buy.");
      return;
    }

    if (!product?.price) {
      toast.error("Product has no price.");
      return;
    }

    // Convert price string back into bigint
    // NOTE: replace "ether" with the actual decimals if it's 8 decimals (e.g., parseUnits(price, 8))
    const value = ethers.parseUnits(product.price.toString(), 8);

    if (typeof productService.buyProduct === "function") {
      const tx = await productService.buyProduct(BigInt(product.id), {
        value, // already bigint
      });
      await tx.wait();
      toast.success("✅ Purchase successful!");
    } else {
      toast.error("Buy method not available on productService.");
    }
  } catch (err: any) {
    console.error("Buy failed", err);
    toast.error(err?.reason || err?.message || "Purchase failed");
  }
};

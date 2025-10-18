import { ethers, BigNumberish } from "ethers";
import {
  getEcommerceContract,
  getEcommerceContractReadOnly,
  getCurrentAccountAddress,
} from "./contract";

export interface CartItem {
  sellerId: string;
  productId: string;
  qty: number;
  unitPrice: string;
  orderStatus: number;
  _proposedDeliveryTime: string;
}

export const ecommerceService = {
  /** Get user's cart items */
  async getCart(userId: BigNumberish): Promise<CartItem[]> {
    try {
      const contract = await getEcommerceContractReadOnly();
      const rawCart = await contract.getCart(userId);
      return rawCart.map((item: any) => ({
        sellerId: item.sellerId?.toString() || "",
        productId: item.productId?.toString() || "",
        qty: Number(item.qty || 0),
        unitPrice: item.unitPrice?.toString() || "0",
        orderStatus: Number(item.orderStatus || 0),
        _proposedDeliveryTime: item._proposedDeliveryTime?.toString() || "",
      }));
    } catch (error) {
      console.error("❌ Error getting cart:", error);
      return [];
    }
  },

  async removeProductFromCart(productId: BigNumberish) {
    try {
      const contract = await getEcommerceContract();
      const tx = await contract.removeProductFromCart(productId);
      const receipt = await tx.wait();
      return { tx, receipt };
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const contract = await getEcommerceContract();
      const tx = await contract.clearCart();
      const receipt = await tx.wait();
      return { tx, receipt };
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      throw error;
    }
  },

  async getUpgradeInterfaceVersion(): Promise<string> {
    const contract = await getEcommerceContractReadOnly();
    return contract.UPGRADE_INTERFACE_VERSION();
  },

  async getOwner(): Promise<string> {
    const contract = await getEcommerceContractReadOnly();
    return contract.owner();
  },

  async getProxiableUUID(): Promise<string> {
    const contract = await getEcommerceContractReadOnly();
    return contract.proxiableUUID();
  },

  /** Add product to cart */
  async addProductToCart(productId: BigNumberish, qty: BigNumberish) {
    const contract = await getEcommerceContract();
    const tx = await contract.addProductToCart(productId, qty);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  /** Checkout with native ETH */
  async checkOutWithNative(payToken: string, value: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.checkOutWithNative(payToken, {
      value: ethers.parseEther(value),
    });
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  /** Checkout with USD token */
  async checkOutWithUSD(payToken: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.checkOutWithUSD(payToken);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async initialize(
    escrowAddress: string,
    userContract: string,
    productContract: string,
    initialOwner: string
  ) {
    const contract = await getEcommerceContract();
    const tx = await contract.initialize(
      escrowAddress,
      userContract,
      productContract,
      initialOwner
    );
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async renounceOwnership() {
    const contract = await getEcommerceContract();
    const tx = await contract.renounceOwnership();
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async transferOwnership(newOwner: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.transferOwnership(newOwner);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async upgradeToAndCall(newImplementation: string, data: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.upgradeToAndCall(newImplementation, data);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  /** Event queries */
  async getEvents(eventName: string, fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = (contract.filters as any)[eventName]();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Extract payment reference */
  async extractPaymentRefFromReceipt(receipt: ethers.ContractTransactionReceipt) {
    try {
      const eventInterface = new ethers.Interface([
        "event SuccessfulCheckout(uint256 indexed _userId, uint256 indexed _paymentReference, string _currency, uint256 _amountPaid)",
      ]);
      for (const log of receipt.logs) {
        try {
          const parsed = eventInterface.parseLog(log);
          if (parsed?.name === "SuccessfulCheckout") {
            return parsed.args._paymentReference.toString();
          }
        } catch {}
      }
    } catch (error) {
      console.error("Error extracting payment reference:", error);
    }
    return null;
  },

  async extractProductIdFromReceipt(receipt: ethers.ContractTransactionReceipt) {
    try {
      const eventInterface = new ethers.Interface([
        "event RegisteredAProduct(uint256 indexed _productId, uint256 indexed _sellerId)",
      ]);
      for (const log of receipt.logs) {
        try {
          const parsed = eventInterface.parseLog(log);
          if (parsed?.name === "RegisteredAProduct") {
            return parsed.args._productId.toString();
          }
        } catch {}
      }
    } catch (error) {
      console.error("Error extracting product ID:", error);
    }
    return null;
  },

  async isCurrentUserOwner(): Promise<boolean> {
    try {
      const owner = await this.getOwner();
      const currentAddress = await getCurrentAccountAddress();
      return owner.toLowerCase() === currentAddress.toLowerCase();
    } catch {
      return false;
    }
  },
};

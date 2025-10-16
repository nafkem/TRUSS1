// src/contracts/ecommerce/ecommerceService.ts
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
  // ========== GETTER FUNCTIONS (VIEW) ==========
  
  /** Get user's cart items */
  async getCart(userId: BigNumberish): Promise<CartItem[]> {
    const contract = await getEcommerceContractReadOnly();
    const rawCart = await contract.getCart(userId);
    return rawCart.map((item: any) => ({
      sellerId: item.sellerId.toString(),
      productId: item.productId.toString(),
      qty: Number(item.qty),
      unitPrice: item.unitPrice.toString(),
      orderStatus: Number(item.orderStatus),
      _proposedDeliveryTime: item._proposedDeliveryTime.toString()
    }));
  },

  /** Get UPGRADE_INTERFACE_VERSION */
  async getUpgradeInterfaceVersion(): Promise<string> {
    const contract = await getEcommerceContractReadOnly();
    return await contract.UPGRADE_INTERFACE_VERSION();
  },

  /** Get contract owner */
  async getOwner(): Promise<string> {
    const contract = await getEcommerceContractReadOnly();
    return await contract.owner();
  },

  /** Get proxiable UUID */
  async getProxiableUUID(): Promise<string> {
    const contract = await getEcommerceContractReadOnly();
    return await contract.proxiableUUID();
  },

  // ========== SETTER FUNCTIONS (WRITE) ==========

  /** Add product to cart */
  async addProductToCart(productId: BigNumberish, qty: BigNumberish) {
    const contract = await getEcommerceContract();
    const tx = await contract.addProductToCart(productId, qty);
    return { tx };
  },

  /** Checkout with native ETH */
  async checkOutWithNative(payToken: string, value: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.checkOutWithNative(payToken, { 
      value: ethers.parseEther(value) 
    });
    return { tx };
  },

  /** Checkout with USD token */
  async checkOutWithUSD(payToken: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.checkOutWithUSD(payToken);
    return { tx };
  },

  /** Initialize contract (owner only) */
  async initialize(
    escrowAddress: string, 
    userContract: string, 
    productContract: string, 
    initialOwner: string
  ) {
    const contract = await getEcommerceContract();
    const tx = await contract.initialize(escrowAddress, userContract, productContract, initialOwner);
    return { tx };
  },

  /** Renounce ownership */
  async renounceOwnership() {
    const contract = await getEcommerceContract();
    const tx = await contract.renounceOwnership();
    return { tx };
  },

  /** Transfer ownership */
  async transferOwnership(newOwner: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.transferOwnership(newOwner);
    return { tx };
  },

  /** Upgrade contract implementation */
  async upgradeToAndCall(newImplementation: string, data: string) {
    const contract = await getEcommerceContract();
    const tx = await contract.upgradeToAndCall(newImplementation, data, { 
      value: ethers.parseEther("0") // Adjust value if needed
    });
    return { tx };
  },

  // ========== EVENT QUERY FUNCTIONS ==========

  /** Query AccountOwnershipChanged events */
  async getAccountOwnershipChangedEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.AccountOwnershipChanged();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query CanceledDelivery events */
  async getCanceledDeliveryEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.CanceledDelivery();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query ProductOrderStatusUpdated events */
  async getProductOrderStatusUpdatedEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.ProductOrderStatusUpdated();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query ProductpriceUpdate events */
  async getProductPriceUpdateEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.ProductpriceUpdate();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query ResgisteredAProduct events */
  async getProductRegisteredEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.ResgisteredAProduct();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query ResgisteredAuser events */
  async getUserRegisteredEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.ResgisteredAuser();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query SuccessfulCheckout events */
  async getSuccessfulCheckoutEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.SuccessfulCheckout();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query VerifiedAuser events */
  async getUserVerifiedEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.VerifiedAuser();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query WithdrawSuccess events */
  async getWithdrawSuccessEvents(fromBlock?: number) {
    const contract = await getEcommerceContract();
    const filter = contract.filters.WithdrawSuccess();
    return contract.queryFilter(filter, fromBlock);
  },

  // ========== UTILITY FUNCTIONS ==========

  /** Extract payment reference from SuccessfulCheckout event */
  async extractPaymentRefFromReceipt(receipt: ethers.ContractTransactionReceipt): Promise<string | null> {
    try {
      const eventInterface = new ethers.Interface([
        "event SuccessfulCheckout(uint256 indexed _userId, uint256 indexed _paymentRefence, string _currency, uint256 _amountPaid)"
      ]);
      
      for (const log of receipt.logs) {
        try {
          const parsedLog = eventInterface.parseLog(log);
          if (parsedLog?.name === "SuccessfulCheckout") {
            return parsedLog.args._paymentRefence.toString();
          }
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.error("Error extracting payment reference:", error);
    }
    return null;
  },

  /** Extract product ID from ResgisteredAProduct event */
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
      console.error("Error extracting product ID:", error);
    }
    return null;
  },

  /** Check if current user is owner */
  async isCurrentUserOwner(): Promise<boolean> {
    try {
      const owner = await this.getOwner();
      const currentAddress = await getCurrentAccountAddress();
      return owner.toLowerCase() === currentAddress.toLowerCase();
    } catch (error) {
      console.error("Error checking ownership:", error);
      return false;
    }
  }
};
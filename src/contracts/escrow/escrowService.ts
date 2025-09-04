// src/contracts/escrow/service.ts
import { getEscrowContract } from "./contract";

export const escrowService = {
  /** Buyer pays for items with ETH (escrowed) */
  async payForItemsWithETH(userId: number, bill: number, payRef: string) {
    const contract = await getEscrowContract();
    const tx = await contract.payForItemsWithETH(userId, bill, payRef);
    return { tx };
  },

  /** Update delivery status (seller/admin) */
  async updateDeliveryStatus(payRef: string, productId: number, isDelivered: boolean) {
    const contract = await getEscrowContract();
    const tx = await contract.updateDeliveryStatus(payRef, productId, isDelivered);
    return { tx };
  },

  /** Withdraw funds (seller/platform) */
  async withdrawFunds(payRef: string, amount: number) {
    const contract = await getEscrowContract();
    const tx = await contract.withdrawFunds(payRef, amount);
    return { tx };
  },

  /** Seller cancels delivery */
  async sellerCancelDelivery(payRef: string, productId: number) {
    const contract = await getEscrowContract();
    const tx = await contract.sellerCancelDelivery(payRef, productId);
    return { tx };
  },

  /** Check user withdrawable balance */
  async getWithdrawableBalance(userId: number, ref: string) {
    const contract = await getEscrowContract();
    return await contract.getWithdrawableBalance(userId, ref);
  },
};

// src/contracts/escrow/escrowService.ts
import { ethers, BigNumberish } from "ethers";
import { getEscrowContract, getEscrowContractReadOnly } from "./contract";

export interface TokenDetails {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimal: number;
  isActive: boolean;
}

export const escrowService = {
  // ========== GETTER FUNCTIONS (VIEW) ==========

  /** Check if token is accepted */
  async isAccepted(tokenSymbol: string): Promise<boolean> {
    try {
      const contract = await getEscrowContractReadOnly();
      return await contract.isAccepted(tokenSymbol);
    } catch (error) {
      console.error("❌ Error checking token acceptance:", error);
      return false;
    }
  },

  /** Get token details */
  async getTokenDetails(tokenSymbol: string): Promise<TokenDetails | null> {
    try {
      const contract = await getEscrowContractReadOnly();
      const details = await contract.tokenSymbolToDetails(tokenSymbol);
      return {
        tokenAddress: details.tokenAddress,
        tokenSymbol: details.tokenSymbol,
        tokenDecimal: Number(details.tokenDecimal),
        isActive: details.isActive
      };
    } catch (error) {
      console.error("❌ Error getting token details:", error);
      return null;
    }
  },

  /** Check user withdrawable balance */
  async getWithdrawableBalance(userId: BigNumberish, ref: BigNumberish): Promise<string> {
    try {
      const contract = await getEscrowContractReadOnly();
      const balance = await contract.getWithdrawableBalance(userId, ref);
      return balance.toString();
    } catch (error) {
      console.error("❌ Error getting withdrawable balance:", error);
      return "0";
    }
  },

  /** Get wallet balance */
  async getWalletBalance(userId: BigNumberish, payRef: BigNumberish): Promise<string> {
    try {
      const contract = await getEscrowContractReadOnly();
      const balance = await contract.getWalletBalance(userId, payRef);
      return balance.toString();
    } catch (error) {
      console.error("❌ Error getting wallet balance:", error);
      return "0";
    }
  },

  /** Get total locked amount in escrow */
  async getTotalLockedAmount(): Promise<string> {
    try {
      const contract = await getEscrowContractReadOnly();
      const total = await contract.getTotalLockedAmount();
      return total.toString();
    } catch (error) {
      console.error("❌ Error getting total locked amount:", error);
      return "0";
    }
  },

  /** Get escrow status for a payment reference */
  async getEscrowStatus(payRef: BigNumberish): Promise<number> {
    try {
      const contract = await getEscrowContractReadOnly();
      const status = await contract.getEscrowStatus(payRef);
      return Number(status);
    } catch (error) {
      console.error("❌ Error getting escrow status:", error);
      return 0;
    }
  },

  /** Get escrow details */
  async getEscrowDetails(payRef: BigNumberish): Promise<any> {
    try {
      const contract = await getEscrowContractReadOnly();
      return await contract.getEscrowDetails(payRef);
    } catch (error) {
      console.error("❌ Error getting escrow details:", error);
      return null;
    }
  },

  /** Check if delivery is confirmed */
  async isDeliveryConfirmed(payRef: BigNumberish, productId: BigNumberish): Promise<boolean> {
    try {
      const contract = await getEscrowContractReadOnly();
      return await contract.isDeliveryConfirmed(payRef, productId);
    } catch (error) {
      console.error("❌ Error checking delivery confirmation:", error);
      return false;
    }
  },

  /** Get all accepted tokens */
  async getAcceptedTokens(): Promise<string[]> {
    try {
      const contract = await getEscrowContractReadOnly();
      return await contract.getAcceptedTokens();
    } catch (error) {
      console.error("❌ Error getting accepted tokens:", error);
      return [];
    }
  },

  // ========== SETTER FUNCTIONS (WRITE) ==========

  /** Buyer pays for items with ETH (escrowed) */
  async payForItemsWithETH(
    userId: BigNumberish, 
    bill: BigNumberish, 
    feedData: string, 
    payRef: BigNumberish, 
    value: string
  ) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.payForItemsWithETH(
        userId, 
        bill, 
        feedData, 
        payRef, 
        { value: ethers.parseEther(value) }
      );
      return { tx };
    } catch (error) {
      console.error("❌ Error paying with ETH:", error);
      throw error;
    }
  },

  /** Buyer pays for items with ERC20 token */
  async payForItemsWithToken(
    userId: BigNumberish,
    bill: BigNumberish,
    feedData: string,
    payRef: BigNumberish,
    tokenSymbol: string
  ) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.payForItemsWithToken(
        userId,
        bill,
        feedData,
        payRef,
        tokenSymbol
      );
      return { tx };
    } catch (error) {
      console.error("❌ Error paying with token:", error);
      throw error;
    }
  },

  /** Update delivery status */
  async updateDeliveryStatus(payRef: BigNumberish, productId: BigNumberish, isDelivered: boolean) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.updateDeliveryStatus(payRef, productId, isDelivered);
      return { tx };
    } catch (error) {
      console.error("❌ Error updating delivery status:", error);
      throw error;
    }
  },

  /** Withdraw funds */
  async withdrawFunds(payRef: BigNumberish, amount: BigNumberish) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.withdrawFunds(payRef, amount);
      return { tx };
    } catch (error) {
      console.error("❌ Error withdrawing funds:", error);
      throw error;
    }
  },

  /** Seller cancels delivery */
  async sellerCancelDelivery(payRef: BigNumberish, productId: BigNumberish) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.sellerCancelDelivery(payRef, productId);
      return { tx };
    } catch (error) {
      console.error("❌ Error canceling delivery:", error);
      throw error;
    }
  },

  /** Admin: Add accepted token */
  async addAcceptedToken(
    tokenAddress: string, 
    tokenSymbol: string, 
    tokenDecimal: BigNumberish
  ) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.addAcceptedToken(tokenAddress, tokenSymbol, tokenDecimal);
      return { tx };
    } catch (error) {
      console.error("❌ Error adding accepted token:", error);
      throw error;
    }
  },

  /** Admin: Remove accepted token */
  async removeAcceptedToken(tokenSymbol: string) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.removeAcceptedToken(tokenSymbol);
      return { tx };
    } catch (error) {
      console.error("❌ Error removing accepted token:", error);
      throw error;
    }
  },

  /** Admin: Toggle token activation */
  async toggleTokenActivation(tokenSymbol: string, isActive: boolean) {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.toggleTokenActivation(tokenSymbol, isActive);
      return { tx };
    } catch (error) {
      console.error("❌ Error toggling token activation:", error);
      throw error;
    }
  },

  // ========== EVENT QUERY FUNCTIONS ==========

  /** Query PaymentReceived events */
  async getPaymentReceivedEvents(fromBlock?: number) {
    const contract = await getEscrowContract();
    const filter = contract.filters.PaymentReceived();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query FundsReleased events */
  async getFundsReleasedEvents(fromBlock?: number) {
    const contract = await getEscrowContract();
    const filter = contract.filters.FundsReleased();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query FundsRefunded events */
  async getFundsRefundedEvents(fromBlock?: number) {
    const contract = await getEscrowContract();
    const filter = contract.filters.FundsRefunded();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query DeliveryStatusUpdated events */
  async getDeliveryStatusUpdatedEvents(fromBlock?: number) {
    const contract = await getEscrowContract();
    const filter = contract.filters.DeliveryStatusUpdated();
    return contract.queryFilter(filter, fromBlock);
  },

  /** Query TokenAdded events */
  async getTokenAddedEvents(fromBlock?: number) {
    const contract = await getEscrowContract();
    const filter = contract.filters.TokenAdded();
    return contract.queryFilter(filter, fromBlock);
  },

  // ========== UTILITY FUNCTIONS ==========

  /** Format balance to readable format */
  formatBalance(balance: string, decimals: number = 18): string {
    return ethers.formatUnits(balance, decimals);
  },

  /** Parse amount to wei/units */
  parseAmount(amount: string, decimals: number = 18): bigint {
    return ethers.parseUnits(amount, decimals);
  },

  /** Check if user can withdraw funds */
  async canWithdrawFunds(userId: BigNumberish, payRef: BigNumberish): Promise<boolean> {
    try {
      const balance = await this.getWithdrawableBalance(userId, payRef);
      return BigInt(balance) > BigInt(0);
    } catch (error) {
      console.error("❌ Error checking withdrawal eligibility:", error);
      return false;
    }
  },

  /** Get total balance across all payment references */
  async getTotalUserBalance(userId: BigNumberish): Promise<string> {
    try {
      // This would require iterating through user's payment references
      // Implementation depends on your contract structure
      const contract = await getEscrowContractReadOnly();
      // Assuming a function like getUserTotalBalance exists
      const total = await contract.getUserTotalBalance(userId);
      return total.toString();
    } catch (error) {
      console.error("❌ Error getting total user balance:", error);
      return "0";
    }
  }
};
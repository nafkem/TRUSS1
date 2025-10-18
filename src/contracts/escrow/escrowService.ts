import { ethers, BigNumberish } from "ethers";
import { getEscrowContract, getEscrowContractReadOnly } from "./contract";

export interface TokenDetails {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimal: number;
  isActive: boolean;
}

export const escrowService = {
  async isAccepted(symbol: string): Promise<boolean> {
    try {
      const contract = await getEscrowContractReadOnly();
      return contract.isAccepted(symbol);
    } catch (e) {
      console.error("❌ Error checking token:", e);
      return false;
    }
  },

  async getTokenDetails(symbol: string): Promise<TokenDetails | null> {
    try {
      const contract = await getEscrowContractReadOnly();
      const details = await contract.tokenSymbolToDetails(symbol);
      return {
        tokenAddress: details.tokenAddress,
        tokenSymbol: details.tokenSymbol,
        tokenDecimal: Number(details.tokenDecimal),
        isActive: details.isActive,
      };
    } catch (e) {
      console.error("❌ Error fetching token:", e);
      return null;
    }
  },

  async getWithdrawableBalance(userId: BigNumberish, ref: BigNumberish) {
    try {
      const c = await getEscrowContractReadOnly();
      return (await c.getWithdrawableBalance(userId, ref)).toString();
    } catch {
      return "0";
    }
  },

  async getWalletBalance(userId: BigNumberish, payRef: BigNumberish) {
    try {
      const c = await getEscrowContractReadOnly();
      return (await c.getWalletBalance(userId, payRef)).toString();
    } catch {
      return "0";
    }
  },

  async getTotalLockedAmount() {
    try {
      const c = await getEscrowContractReadOnly();
      return (await c.getTotalLockedAmount()).toString();
    } catch {
      return "0";
    }
  },

  async getEscrowStatus(ref: BigNumberish) {
    try {
      const c = await getEscrowContractReadOnly();
      return Number(await c.getEscrowStatus(ref));
    } catch {
      return 0;
    }
  },

  async getEscrowDetails(ref: BigNumberish) {
    try {
      const c = await getEscrowContractReadOnly();
      return c.getEscrowDetails(ref);
    } catch {
      return null;
    }
  },

  async isDeliveryConfirmed(ref: BigNumberish, productId: BigNumberish) {
    try {
      const c = await getEscrowContractReadOnly();
      return c.isDeliveryConfirmed(ref, productId);
    } catch {
      return false;
    }
  },

  async getAcceptedTokens() {
    try {
      const c = await getEscrowContractReadOnly();
      return c.getAcceptedTokens();
    } catch {
      return [];
    }
  },

  /** Buyer pays with ETH */
  async payForItemsWithETH(
    userId: BigNumberish,
    bill: BigNumberish,
    feedData: string,
    payRef: BigNumberish,
    value: string
  ) {
    const c = await getEscrowContract();
    const tx = await c.payForItemsWithETH(userId, bill, feedData, payRef, {
      value: ethers.parseEther(value),
    });
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async payForItemsWithToken(
    userId: BigNumberish,
    bill: BigNumberish,
    feedData: string,
    payRef: BigNumberish,
    tokenSymbol: string
  ) {
    const c = await getEscrowContract();
    const tx = await c.payForItemsWithToken(userId, bill, feedData, payRef, tokenSymbol);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async updateDeliveryStatus(ref: BigNumberish, productId: BigNumberish, delivered: boolean) {
    const c = await getEscrowContract();
    const tx = await c.updateDeliveryStatus(ref, productId, delivered);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async withdrawFunds(ref: BigNumberish, amount: BigNumberish) {
    const c = await getEscrowContract();
    const tx = await c.withdrawFunds(ref, amount);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async sellerCancelDelivery(ref: BigNumberish, productId: BigNumberish) {
    const c = await getEscrowContract();
    const tx = await c.sellerCancelDelivery(ref, productId);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async addAcceptedToken(address: string, symbol: string, decimals: BigNumberish) {
    const c = await getEscrowContract();
    const tx = await c.addAcceptedToken(address, symbol, decimals);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async removeAcceptedToken(symbol: string) {
    const c = await getEscrowContract();
    const tx = await c.removeAcceptedToken(symbol);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  async toggleTokenActivation(symbol: string, isActive: boolean) {
    const c = await getEscrowContract();
    const tx = await c.toggleTokenActivation(symbol, isActive);
    const receipt = await tx.wait();
    return { tx, receipt };
  },

  /** Events */
  async getEvents(eventName: string, fromBlock?: number) {
    const c = await getEscrowContract();
    const filter = (c.filters as any)[eventName]();
    return c.queryFilter(filter, fromBlock);
  },

  formatBalance(balance: string, decimals = 18) {
    return ethers.formatUnits(balance, decimals);
  },

  parseAmount(amount: string, decimals = 18) {
    return ethers.parseUnits(amount, decimals);
  },

  async canWithdrawFunds(userId: BigNumberish, payRef: BigNumberish) {
    const bal = await this.getWithdrawableBalance(userId, payRef);
    return BigInt(bal) > 0n;
  },

  async getTotalUserBalance(userId: BigNumberish) {
    try {
      const c = await getEscrowContractReadOnly();
      const total = await c.getUserTotalBalance(userId);
      return total.toString();
    } catch {
      return "0";
    }
  },
};

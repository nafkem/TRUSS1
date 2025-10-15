// src/contracts/product/contract.ts
import { Contract, BrowserProvider } from "ethers";
import productAbi from "./productAbi.json";
import { PRODUCT_CONTRACT_ADDRESS } from "./constant"; // Import from constant

export async function getProductContract(): Promise<Contract> {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(PRODUCT_CONTRACT_ADDRESS, productAbi, signer);
}

export function getProductContractReadOnly(): Contract {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  return new Contract(PRODUCT_CONTRACT_ADDRESS, productAbi, provider);
}

export async function getCurrentAccountAddress(): Promise<string> {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

// Export the contract address if needed elsewhere
export { PRODUCT_CONTRACT_ADDRESS };
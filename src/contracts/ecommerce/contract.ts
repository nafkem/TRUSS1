// src/contracts/product/contract.ts
import { Contract, BrowserProvider } from "ethers";
import productAbi from "./ecomAbi.json";
import { ECOMMERCE_CONTRACT_ADDRESS } from "./constant"; // Import from constant

export async function getEcommerceContract(): Promise<Contract> {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(ECOMMERCE_CONTRACT_ADDRESS, productAbi, signer);
}

export function getEcommerceContractReadOnly(): Contract {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  return new Contract(ECOMMERCE_CONTRACT_ADDRESS, productAbi, provider);
}

export async function getCurrentAccountAddress(): Promise<string> {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

// Export the contract address if needed elsewhere
export { ECOMMERCE_CONTRACT_ADDRESS };
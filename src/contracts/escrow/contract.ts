// src/contracts/escrowAbintract.ts
import { Contract, BrowserProvider } from "ethers";
import escrowAbi from "./escAbi.json";
import { ESCROW_CONTRACT_ADDRESS } from "./constant"; // Import from constant

export async function getEscrowContract(): Promise<Contract> {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(ESCROW_CONTRACT_ADDRESS, escrowAbi, signer);
}

export function getEscrowContractReadOnly(): Contract {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  return new Contract(ESCROW_CONTRACT_ADDRESS, escrowAbi, provider);
}

export async function getCurrentAccountAddress(): Promise<string> {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

// Export the contract address if needed elsewhere
export { ESCROW_CONTRACT_ADDRESS };
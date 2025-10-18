import { Contract, BrowserProvider, id } from "ethers";
import ecomAbi from "./ecomAbi.json";
import { ECOMMERCE_CONTRACT_ADDRESS } from "./constant";

function ensureProvider(): BrowserProvider {
  if (typeof window === "undefined" || !window.ethereum)
    throw new Error("No Ethereum provider found");
  return new BrowserProvider(window.ethereum);
}

export async function getEcommerceContract(): Promise<Contract> {
  const provider = ensureProvider();
  const signer = await provider.getSigner();
  const contract = new Contract(ECOMMERCE_CONTRACT_ADDRESS, ecomAbi, signer);

  // ✅ Correct way to compute the sighash in ethers v6
  const sighash = id("checkOutWithNative(string)").slice(0, 10);
  console.log("Function selector for checkOutWithNative(string):", sighash);

  return contract;
}

export function getEcommerceContractReadOnly(): Contract {
  const provider = ensureProvider();
  return new Contract(ECOMMERCE_CONTRACT_ADDRESS, ecomAbi, provider);
}

export async function getCurrentAccountAddress(): Promise<string> {
  const provider = ensureProvider();
  const signer = await provider.getSigner();
  return signer.getAddress();
}

export { ECOMMERCE_CONTRACT_ADDRESS };

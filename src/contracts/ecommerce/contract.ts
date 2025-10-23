import { Contract, BrowserProvider, type JsonFragment } from "ethers";
import ecomAbiJson from "./ecomAbi.json";
import { ECOMMERCE_CONTRACT_ADDRESS } from "./constant";

const ecomAbi = ecomAbiJson as JsonFragment[];

function ensureProvider(): BrowserProvider {
  if (typeof window === "undefined" || !window.ethereum)
    throw new Error("No Ethereum provider found");
  return new BrowserProvider(window.ethereum);
}

export async function getEcommerceContract(): Promise<Contract> {
  const provider = ensureProvider();
  const signer = await provider.getSigner();
  const contract = new Contract(ECOMMERCE_CONTRACT_ADDRESS, ecomAbi, signer);

  console.log("Contract methods:", Object.keys(contract));
  console.log("Contract address:", contract.target);

  // runtime sanity check
  if (typeof contract.checkOutWithNative !== "function") {
    throw new Error(
      "checkOutWithNative is not found on the contract. Check ABI & address"
    );
  }

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

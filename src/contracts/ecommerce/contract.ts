import { Contract } from "ethers";
import ecomAbi from "./ecomAbi.json";
import { ECOMMERCE_CONTRACT_ADDRESS } from "./constant";
import { getBrowserProvider } from "../../shared/providers";

export async function getEcommerceContract(): Promise<Contract> {
  const provider = getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(ECOMMERCE_CONTRACT_ADDRESS, ecomAbi, signer);
}

export async function getEcommerceContractReadOnly(): Promise<Contract> {
  const provider = getBrowserProvider();
  return new Contract(ECOMMERCE_CONTRACT_ADDRESS, ecomAbi, provider);
}
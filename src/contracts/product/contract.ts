import { Contract } from "ethers";
import productAbi from "./productAbi.json";
import { PRODUCT_CONTRACT_ADDRESS } from "./constant";
import { getBrowserProvider } from "../../shared/providers";

export async function getProductContract(): Promise<Contract> {
  const provider = getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(PRODUCT_CONTRACT_ADDRESS, productAbi, signer);
}

export async function getProductContractReadOnly(): Promise<Contract> {
  const provider = getBrowserProvider();
  return new Contract(PRODUCT_CONTRACT_ADDRESS, productAbi, provider);
}
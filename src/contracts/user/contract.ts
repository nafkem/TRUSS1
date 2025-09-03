import { Contract } from "ethers";
import userAbi from "./userAbi.json";
import { USER_CONTRACT_ADDRESS } from "./constant";
import { getBrowserProvider } from "../../shared/providers";

export async function getUserContract(): Promise<Contract> {
  const provider = getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(USER_CONTRACT_ADDRESS, userAbi, signer);
}

export async function getUserContractReadOnly(): Promise<Contract> {
  const provider = getBrowserProvider();
  return new Contract(USER_CONTRACT_ADDRESS, userAbi, provider);
}
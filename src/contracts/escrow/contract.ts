import { Contract } from "ethers";
import escAbi from "./escAbi.json";
import { ESCROW_CONTRACT_ADDRESS } from "./constant";
import { getBrowserProvider } from "../../shared/providers";

export async function getEscrowContract(): Promise<Contract> {
  const provider = getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(ESCROW_CONTRACT_ADDRESS, escAbi, signer);
}

export async function getEscrowContractReadOnly(): Promise<Contract> {
  const provider = getBrowserProvider();
  return new Contract(ESCROW_CONTRACT_ADDRESS, escAbi, provider);
}
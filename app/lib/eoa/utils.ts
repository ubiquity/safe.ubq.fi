import { JsonRpcSigner, Wallet } from "ethers";

export async function getAddress(signer: Wallet | JsonRpcSigner) {
  return (await signer.getAddress()) as `0x${string}`;
}

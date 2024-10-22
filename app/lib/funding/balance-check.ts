import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { toast } from "sonner";
import { FAILED_TO_FUND } from "../utils";

export const provider = new JsonRpcProvider("https://rpc-amoy.polygon.technology");

export async function walletNeedsFunded(signer: Wallet | `0x${string}`) {
  const balance = await provider.getBalance(typeof signer === "string" ? signer : signer.address);
  return balance < ethers.parseEther("0.0009");
}

export async function fundWalletFromFaucet(signer: Wallet | `0x${string}`) {
  const address = typeof signer === "string" ? signer : signer.address;
  const workerUrl = "https://ubq-gas-faucet.keyrxng7749.workers.dev/?address=" + address;
  toast.info("Funding wallet from faucet, please wait...");
  try {
    let res: Response | null = null;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      res = await fetch(workerUrl, options);
    } catch { }

    if (!res || !res.ok) {
      toast.error(FAILED_TO_FUND);
      return null;
    }

    const response = await res.json();

    if (response.txHash) {
      const tx = await provider.getTransaction(response.txHash);
      if (tx) {
        await tx.wait();
      }
      toast.success("Wallet funded from faucet");
      return response.txHash;
    } else {
      toast.error(FAILED_TO_FUND);
      return response;
    }
  } catch (e) {
    console.error(e);
    toast.error(FAILED_TO_FUND);
    return null;
  }
}
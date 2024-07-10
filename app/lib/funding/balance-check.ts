import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { toast } from "sonner";

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
    } catch (e) {
      res = await retryWrapper(() => fetch(workerUrl, options));
    }

    if (!res || !res.ok) {
      toast.error("Failed to fund wallet from faucet");
      return null;
    }

    const response = await res.json();

    if (response.txHash) {
      console.log(response.txHash)
      const tx = await provider.getTransaction(response.txHash);
      if (tx) {
        await tx.wait();
      }
      toast.success("Wallet funded from faucet");
      return response.txHash;
    } else {
      console.log(response)
      toast.error("Failed to fund wallet from faucet");
      return response;
    }
  } catch (e) {
    console.error(e);
    toast.error("Failed to fund wallet from faucet");
    return null;
  }

}

async function retryWrapper(fn: () => Promise<Response>, retries = 3): Promise<Response | null> {
  let res: Response | null = null;
  const backoff = 7500;
  for (let i = 0; i < retries; i++) {
    try {
      res = await fn();
      break;
    } catch (e) {
      console.error(e);
    }
    await new Promise((resolve) => setTimeout(resolve, backoff * (i + 1)));
  }
  return res;
}

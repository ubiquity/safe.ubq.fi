import { ethers, JsonRpcProvider, Wallet } from "ethers";

export const provider = new JsonRpcProvider("https://rpc-amoy.polygon.technology");

export async function walletNeedsFunded(signer: Wallet) {
  const balance = await provider.getBalance(signer.address);
  return balance < ethers.parseEther("0.0009");
}

export async function fundWalletFromFaucet(signer: Wallet) {
  const workerUrl = "https://ubq-gas-faucet.keyrxng7749.workers.dev/?address=" + signer.address;
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

    if (!res || !res.ok) {
      throw new Error("Faucet work has likely exceeded limits, try again shortly.");
    }
  }

  if (!res || !res.ok) {
    return null;
  }

  return res.json();
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

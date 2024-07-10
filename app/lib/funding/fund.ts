import { Wallet } from "ethers";
import { walletNeedsFunded, fundWalletFromFaucet, provider } from "./balance-check";
import { toastNotification } from "../utils/notification";

export async function handleFunding(wallet: Wallet) {
  if (await walletNeedsFunded(wallet)) {
    toastNotification("Funding wallet from faucet...", 5000);
    const res = await fundWalletFromFaucet(wallet);
    if (!res || !res?.txHash) {
      toastNotification("Failed to fund wallet from faucet", 5000);
      return;
    }

    const waitingToBeMinedKillSwitch = toastNotification("Waiting for transaction to be mined...");
    await provider.waitForTransaction(res.txHash);
    const receipt = await provider.getTransaction(res.txHash);
    waitingToBeMinedKillSwitch();

    if (!receipt) {
      toastNotification("Failed to fund wallet from faucet", 5000);
    } else {
      toastNotification("Wallet successfully funded", 5000);
    }
  } else {
    toastNotification("Wallet already funded");
  }
}

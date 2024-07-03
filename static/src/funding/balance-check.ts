import { ethers, JsonRpcProvider, Wallet } from "ethers";

export const provider = new JsonRpcProvider("https://rpc-amoy.polygon.technology");

export async function walletNeedsFunded(signer: Wallet) {
    const balance = await provider.getBalance(signer.address);
    return balance < ethers.parseEther("0.0009")
}

export async function fundWalletFromFaucet(signer: Wallet) {
    const workerUrl = "https://ubq-gas-faucet.keyrxng7749.workers.dev"

    try {
        const response = await fetch(workerUrl + "/?address=" + signer.address, {
            method: "POST",
        });

        if (response.status === 200) {
            await response.json();
        } else {
            throw new Error("Failed to fund wallet");
        }


    } catch (e) {
        console.error(e)
        throw new Error("Failed to fund wallet");
    }
}
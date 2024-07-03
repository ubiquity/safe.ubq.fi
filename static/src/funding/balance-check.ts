import { ethers, JsonRpcProvider, Wallet } from "ethers";

export const provider = new JsonRpcProvider("https://rpc-amoy.polygon.technology");

export async function walletNeedsFunded(signer: Wallet) {
    const balance = await provider.getBalance(signer.address);
    return balance < ethers.parseEther("0.0009")
}

export async function fundWalletFromFaucet(signer: Wallet) {
    const workerUrl = "https://ubq-gas-faucet.keyrxng7749.workers.dev/?address=" + signer.address;
    let res: Response | null = null;
    try {
        res = await fetch(workerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status !== 200) {
            throw new Error("Failed to fund wallet from faucet");
        }

    } catch (e) {
        console.error(e);
    }

    if (res) {
        return res.json();
    }
}
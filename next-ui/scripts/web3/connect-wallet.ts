import { getButtonController } from "@/components/toaster";
import { JsonRpcSigner, BrowserProvider } from "ethers";

export async function connectWallet(): Promise<JsonRpcSigner | null> {
    try {
        const wallet = new BrowserProvider((window as any).ethereum);

        await wallet.send("eth_requestAccounts", []);

        const signer = await wallet.getSigner();

        const address = await signer.getAddress()

        if (!address) {
            getButtonController().hideAll();
            console.error("Wallet not connected");
            return null;
        }

        return signer;
    } catch (error: unknown) {
        console.error("Error connecting wallet", error);
        return null;
    }
}
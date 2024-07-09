import { AppState } from "@/app/(screens)/claim/components/app-state";
import { handleIfOnCorrectNetwork } from "./handle-if-on-correct-network";
import { notOnCorrectNetwork } from "./not-on-correct-network";
import { Web3Provider } from "@ethersproject/providers";

// verifyCurrentNetwork checks if the user is on the correct network and displays an error if not
export async function verifyCurrentNetwork(app: AppState) {
    if (!(window as any).ethereum) {
        return;
    }

    const web3provider = new Web3Provider((window as any).ethereum);

    const network = await web3provider.getNetwork();
    const currentNetworkId = network.chainId;
    const desiredNetworkId = app.reward.networkId;

    // watch for network changes
    (window as any).ethereum.on("chainChanged", <T>(newNetworkId: T | string) => handleIfOnCorrectNetwork(parseInt(newNetworkId as string, 16), desiredNetworkId));

    // if its not on ethereum mainnet, gnosis, or goerli, display error
    notOnCorrectNetwork(currentNetworkId, desiredNetworkId, web3provider);
}
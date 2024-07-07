// @ts-expect-error - no types
import { getNetworkName } from "@ubiquity-dao/rpc-handler";
import { switchNetwork } from "./switch-network";
import { Web3Provider } from "@ethersproject/providers";
import { getButtonController, toaster } from "@/components/toaster";

export function notOnCorrectNetwork(currentNetworkId: number, desiredNetworkId: number, web3provider: Web3Provider) {
    if (currentNetworkId !== desiredNetworkId) {
        const networkName = getNetworkName(desiredNetworkId);
        if (!networkName) {
            toaster.create("error", `This dApp currently does not support payouts for network ID ${desiredNetworkId}`);
        }
        switchNetwork(web3provider, desiredNetworkId).catch((error) => {
            console.error(error);
            toaster.create("error", `Please switch to the ${networkName} network to claim this reward.`);
            getButtonController().hideAll();
        });
    }
}
import { getButtonController } from "@/components/toaster";

export function handleIfOnCorrectNetwork(currentNetworkId: number, desiredNetworkId: number) {
    if (desiredNetworkId === currentNetworkId) {
        getButtonController().showMakeClaim();
    } else {
        getButtonController().hideMakeClaim();
    }
}
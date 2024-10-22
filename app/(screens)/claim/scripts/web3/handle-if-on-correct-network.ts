import { getButtonController } from "../../components/button-controller";

export function handleIfOnCorrectNetwork(currentNetworkId: number, desiredNetworkId: number) {
  if (desiredNetworkId === currentNetworkId) {
    getButtonController().showMakeClaim();
  } else {
    getButtonController().hideMakeClaim();
  }
}

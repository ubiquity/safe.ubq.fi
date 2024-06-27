import { keccak256 } from "ethers";
import { strToUint8Array } from "../utils/strings";

// Function to derive a deterministic Ethereum private key
export function deriveEthereumPrivateKey(challenge: string): string {
    const dataToHash = strToUint8Array(challenge);
    const pad32 = new Uint8Array(32);
    dataToHash.set(pad32, dataToHash.length - pad32.length);
    const pk = keccak256(dataToHash)
    return pk;
}
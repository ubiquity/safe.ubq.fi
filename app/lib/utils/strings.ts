export const PUBLIC_KEY = "public-key";
export const NO_USER_FOUND = "No user found";
export const FAILED_TO_FUND = "Failed to fund wallet from faucet";

export const CHALLENGE = `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`;

export function strToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

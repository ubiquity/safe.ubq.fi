export const PUBLIC_KEY = "public-key";
export const CHALLENGE = `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

export function strToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}
export const PUBLIC_KEY = "public-key";

export function strToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}
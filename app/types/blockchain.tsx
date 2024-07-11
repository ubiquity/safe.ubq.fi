import { Address } from "viem";

export const TOKENS = {
  gnosis: {
    eth: "native",
    dai: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d".toLowerCase() as Address, // `0x${string}` is a type assertion
    weth: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1".toLowerCase() as Address,
  },
  ethereum: {
    eth: "native",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase() as Address,
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase() as Address,
  },
  amoy: {
    eth: "native",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase() as Address,
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase() as Address,
  },
} as const;
export type Networks = keyof typeof TOKENS;

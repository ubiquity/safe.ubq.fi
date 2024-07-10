import { Contract, ethers } from "ethers";
import { formatEther, formatUnits } from "viem";
// @ts-expect-error - no types
import { RPCHandler } from "@ubiquity-dao/rpc-handler";
import { provider } from "../funding/balance-check";

export const TOKENS = {
  gnosis: {
    dai: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
    weth: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
  },
  ethereum: {
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
} as const;

/**
 * Tokens will not be hardcoded in production but instead we will be able to load
 * balances by using stored permits. The expectation is then that smart accounts would
 * only hold task rewards/airdrop/other org-issued tokens and that the "wallet" would not used for the likes of
 * trading etc. Any tokens received that are not attributable to a stored permit would
 * not be included in such balance checks. This avoids balance checking spam tokens as well
 * as keeps things simple for both the user and the app.
 *
 * Unless as part of 'total abstraction' we simply merge all held tokens into a singular
 * fiat balance while we handle any tokens swaps etc under the hood.
 *
 * These are just helper function for now to beef up the demo.
 */

export async function getProvider(network: keyof typeof TOKENS) {
  return await useRpcHandler(network === "gnosis" ? 100 : 1);
}

export async function getNativeBalance(network: keyof typeof TOKENS, address: `0x${string}`) {
  const balance = await provider?.getBalance(address);

  if (!balance) {
    return "0.00";
  }

  return formatEther(balance);
}

export async function getDaiBalance(network: keyof typeof TOKENS, address: `0x${string}`) {
  return getTokenBalance(TOKENS[network].dai, address, network);
}

export async function getWethBalance(network: keyof typeof TOKENS, address: `0x${string}`) {
  return getTokenBalance(TOKENS[network].weth, address, network);
}

export async function getTokenFromGeckoTerminal(network: keyof typeof TOKENS, token: keyof (typeof TOKENS)[keyof typeof TOKENS]) {
  return fetchGecko("token", { network, token });
}

export async function getTokenPoolFromGeckoTerminal(network: keyof typeof TOKENS, pool: keyof (typeof TOKENS)[keyof typeof TOKENS]) {
  return fetchGecko("pool", { network, pool });
}

export async function getTokenBalance(token: `0x${string}`, address: `0x${string}`, network: keyof typeof TOKENS) {
  const provider = await getProvider(network);
  const contract = new Contract(token, ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"], provider);

  const balance = await contract.balanceOf(address);
  const decimals = await contract.decimals();

  console.log("Balance: ", balance);
  return formatUnits(balance, Number(decimals));
}

const geckoMethods = {
  token: `/networks/{network}/tokens/{token}`,
  pool: `/networks/{network}/pools/{pool}`,
};

async function fetchGecko(method: keyof typeof geckoMethods, args: Record<string, string>) {
  const baseUrl = "https://api.geckoterminal.com/api/v2/";
  const url = getUrl(method, args);
  const res = await fetch(baseUrl + url);

  if (!res.ok) {
    throw new Error("Failed to fetch data from Gecko Terminal");
  }

  return res.json();
}

function getUrl(method: keyof typeof geckoMethods, args: Record<string, string>) {
  const url = geckoMethods[method];
  // eslint-disable-next-line no-unused-vars
  return url.replace(/{(.*?)}/g, (u, match) => args[match]);
}

export async function useHandler(networkId: number) {
  const config = {
    networkId: networkId,
    autoStorage: true,
    cacheRefreshCycles: 5,
    rpcTimeout: 1500,
    networkName: null,
    runtimeRpcs: null,
    networkRpcs: null,
  };

  return new RPCHandler(config);
}

export async function useRpcHandler(networkId: number) {
  if (!networkId) {
    throw new Error("Network ID not set");
  }

  const handler = await useHandler(networkId);
  const provider = await handler.getFastestRpcProvider();

  const url = provider.connection.url;
  if (!url) {
    throw new Error("Provider URL not set");
  }

  return new ethers.JsonRpcProvider(url);
}

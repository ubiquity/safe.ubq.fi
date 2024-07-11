import { Contract, ethers, JsonRpcProvider } from "ethers";
import { Address, formatEther, formatUnits } from "viem";
// @ts-expect-error - no types
import { RPCHandler } from "@ubiquity-dao/rpc-handler";
import { provider } from "../funding/balance-check";
import { Networks, TOKENS } from "@/app/types/blockchain";



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

type CaptializeFirstLetter<T> = T extends string ? `${Uppercase<T[0]>}${T extends `${infer _}${infer Rest}` ? Rest : ""}` : T;

export async function getProvider(network: Networks | CaptializeFirstLetter<Networks>) {
  return new JsonRpcProvider("https://rpc-amoy.polygon.technology");

  if ("gnosis" || "Gnosis") {
    return await useRpcHandler(100);
  }
  if ("ethereum" || "Ethereum") {
    return await useRpcHandler(1);
  }
  if ("amoy" || "Amoy") {
    return new JsonRpcProvider("https://rpc-amoy.polygon.technology");
  }
}

export async function getNativeBalance(network: Networks, address: Address) {
  const balance = await provider?.getBalance(address);

  if (!balance) {
    return "0.00";
  }

  return formatEther(balance, "wei");
}

export async function getDaiBalance(network: Networks, address: Address) {
  return getTokenBalance(TOKENS[network].dai, address, network);
}

export async function getWethBalance(network: Networks, address: Address) {
  return getTokenBalance(TOKENS[network].weth, address, network);
}

export async function getTokenFromGeckoTerminal(network: Networks, token: Address) {
  return fetchGecko("token", { network, token });
}

export async function getTokenPoolFromGeckoTerminal(network: Networks, pool: Address) {
  return fetchGecko("pool", { network, pool });
}

export async function getTokenBalance(token: Address, address: Address, network: Networks) {
  try {
    const provider = await getProvider(network);
    const contract = new Contract(token, ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"], provider);

    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();

    return formatUnits(balance, Number(decimals));
  } catch (e) {
    console.log(e)
  }

  return "0.00";
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

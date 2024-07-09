import { AppState } from "@/lib/app-state";
// @ts-expect-error - no types
import getHandler from "@ubiquity-dao/rpc-handler";

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

    const handler = await getHandler();
    return new handler(config);
}

export async function useRpcHandler(app: AppState) {
    const networkId = app.networkId;
    if (!networkId) {
        throw new Error("Network ID not set");
    }

    const handler = await useHandler(networkId);
    const provider = await handler.getFastestRpcProvider();
    const url = provider.connection.url;
    if (!url) {
        throw new Error("Provider URL not set");
    }
    return provider;
}

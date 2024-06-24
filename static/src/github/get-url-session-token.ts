import { OAuthToken } from "../types/auth";
import { getLocalStore } from "../utils/local-storage";
declare const SUPABASE_STORAGE_KEY: string; // @DEV: passed in at build time check build/esbuild-build.ts

export async function getNewSessionToken(): Promise<string | null> {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // remove the '#' and parse
    const providerToken = params.get("provider_token");
    if (!providerToken) {
        const error = params.get("error_description");
        // supabase auth provider has failed for some reason
        console.error(`GitHub login provider: ${error}`);
    }
    return providerToken || null;
}

export async function getSessionToken(): Promise<string | null> {
    const cachedSessionToken = getLocalStore(`sb-${SUPABASE_STORAGE_KEY}-auth-token`) as OAuthToken | null;
    if (cachedSessionToken) {
        return cachedSessionToken.provider_token;
    }
    const newSessionToken = await getNewSessionToken();
    if (newSessionToken) {
        return newSessionToken;
    }
    return null;
}
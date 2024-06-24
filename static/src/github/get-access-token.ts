import { checkSupabaseSession } from "../supabase/session";

declare const SUPABASE_STORAGE_KEY: string; // @DEV: passed in at build time check build/esbuild-build.ts

export async function getGitHubAccessToken(): Promise<string | null> {
    // better to use official function, looking up localstorage has flaws
    const oauthToken = await checkSupabaseSession();

    if (!oauthToken) {
        return null;
    } else if (typeof oauthToken === "string") {
        // it's the access token
        return oauthToken;
    }

    const expiresAt = oauthToken?.expires_at;
    if (expiresAt) {
        if (expiresAt < Date.now() / 1000) {
            localStorage.removeItem(`sb-${SUPABASE_STORAGE_KEY}-auth-token`);
            return null;
        }
    }

    const accessToken = oauthToken?.provider_token;
    if (accessToken) {
        return accessToken;
    }

    return null;
}

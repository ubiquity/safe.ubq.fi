import { createClient } from "@supabase/supabase-js";
import { getLocalStore } from "../utils/local-storage";
import { OAuthToken } from "../types/auth";

const SUPABASE_URL = "https://wfzpewmlyiozupulbuur.supabase.co" // @DEV: passed in at build time check build/esbuild-build.ts
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmenBld21seWlvenVwdWxidXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzQzMzksImV4cCI6MjAxMTI1MDMzOX0.SKIL3Q0NOBaMehH0ekFspwgcu3afp3Dl9EDzPqs1nKs" // @DEV: passed in at build time check build/esbuild-build.ts
export const SUPABASE_STORAGE_KEY = generateSupabaseStorageKey(SUPABASE_URL) // @DEV: passed in at build time check build/esbuild-build.ts

function generateSupabaseStorageKey(url: string): string | null {
    const urlParts = url.split(".");
    if (urlParts.length === 0) {
        console.error("Invalid SUPABASE_URL environment variable");
        return null;
    }

    const domain = urlParts[0];
    const lastSlashIndex = domain.lastIndexOf("/");
    if (lastSlashIndex === -1) {
        console.error("Invalid SUPABASE_URL format");
        return null;
    }

    return domain.substring(lastSlashIndex + 1);
}

export function getSupabase() {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export async function getUser() {
    const { data: { user }, error } = await getSupabase().auth.getUser();
    if (error) {
        throw new Error(error.message);
    }

    if (user) {

        if (!user.identities) {
            throw new Error("No identities found for user");
        }
        return {
            id: user.id,
            iid: user.identities[0].identity_id || "",
            ca: user.created_at,
        }
    }

    return null;
}

export async function checkSupabaseSession() {
    const oauthToken = getLocalStore(`sb-${SUPABASE_STORAGE_KEY}-auth-token`) as OAuthToken | null;
    if (!oauthToken) {
        const sessionToken = await getNewSessionToken();
        if (sessionToken) {
            return sessionToken;
        }
    }
    return oauthToken;
}

async function getNewSessionToken(): Promise<string | null> {
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
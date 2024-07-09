import { createClient } from "@/lib/supabase/server";
import { Octokit } from "@octokit/rest";

export async function getSupabase() {
    return createClient();
}

export async function getOctokit() {
    const supabase = createClient();
    const providerToken = (await supabase.auth.getSession()).data.session?.provider_token;
    if (!providerToken) throw new Error("No auth token found");
    return new Octokit({ auth: providerToken });
}


/**
 * Server-side only
 */
export async function getUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    return user;
}


/**
 * Returns only previously registered credentials for the user
 * which is used for allow/exclude operations during both registration
 * and authentication ceremonies.
 */
export async function getUserExistingCreds() {
    const user = await getUser();
    if (user) {
        return user.app_metadata?.credentials || [];
    }
}

/**
 * Returns what is needed in order to call createAndUseWallet()
 * for both registration and authentication ceremonies.
 */
export async function getAuthedUser() {
    const user = await getUser();

    if (user) {
        if (!user.identities) {
            throw new Error("No identities found for user");
        }
        return {
            id: user.id,
            iid: user.identities[0].identity_id || "",
            ca: user.created_at,
            existing: user.app_metadata?.credentials || [],
        }
    }
}
import { createClient } from "@/utils/supabase/server";

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

export function getCookieAccessToken(req) {
    // NEXT_PUBLIC_SUPABASE_URL="https://wymwvjfvzbhkfkkpmfdo.supabase.co"
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) throw new Error("No Supabase URL found in environment variables")
    const ref = url.split("https://")[1].split(".")[0]
    return req.cookies[`sb-${ref}-auth-token`];
}
import { getSupabase } from "./session";

export function getUser() {
    return getSupabase().auth.getUser();
}

/**
 * Returns only previously registered credentials for the user
 * which is used for allow/exclude operations during both registration
 * and authentication ceremonies.
 */
export async function getUserExistingCreds() {
    const { data: { user }, error } = await getSupabase().auth.getUser();
    if (error) {
        throw new Error(error.message);
    }

    if (user) {
        return user.app_metadata?.credentials || [];
    }

    return null;
}

/**
 * Returns what is needed in order to call createAndUseWallet()
 * for both registration and authentication ceremonies.
 */
export async function getAuthedUser() {
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
            existing: user.app_metadata?.credentials || [],
        }
    }

    return null;
}

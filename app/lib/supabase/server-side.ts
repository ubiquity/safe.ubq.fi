import { Octokit } from "@octokit/rest";
import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const createClient = () => {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export async function getSupabase() {
    return createClient()
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
export async function getUser(sb?: SupabaseClient) {
    const supabase = sb ?? createClient();
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
        // how does one have more than one identity?
        return {
            id: user.id,
            iid: user.identities[0].identity_id || "",
            ca: user.created_at,
            devices: user.app_metadata?.credentials || [],
        }
    }
}
import { Octokit } from "@octokit/rest";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getSupabase() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!key || !url) throw new Error("Missing Supabase credentials");
  return createBrowserClient(url, key);
}

export async function getOctokit(sb?: SupabaseClient) {
  const supabase = sb ?? (await getSupabase());
  const providerToken = (await supabase.auth.getSession()).data.session?.provider_token;
  if (!providerToken) throw new Error("No auth token found");
  return new Octokit({ auth: providerToken });
}

/**
 * Server-side only
 */
export async function getUser(sb?: SupabaseClient) {
  const supabase = sb ?? (await getSupabase());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns only previously registered credentials for the user
 * which is used for allow/exclude operations during both registration
 * and authentication ceremonies.
 */
export async function getUserExistingCreds(sb?: SupabaseClient) {
  const user = await getUser(sb);
  if (user) {
    return user.app_metadata?.credentials || [];
  }
}

/**
 * Returns what is needed in order to call createAndUseWallet()
 * for both registration and authentication ceremonies.
 */
export async function getAuthedUser(sb?: SupabaseClient) {
  const user = await getUser(sb);

  if (user) {
    if (!user.identities) {
      throw new Error("No identities found for user");
    }
    return {
      id: user.id,
      iid: user.identities[0].identity_id || "",
      ca: user.created_at,
      existing: user.app_metadata?.credentials || [],
    };
  }
}

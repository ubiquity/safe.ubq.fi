import { Octokit } from "@octokit/rest";
import { getSupabase } from "../supabase/client-side";

export async function getClientOctokit() {
    const supabase = await getSupabase();
    const provider_token = (await supabase.auth.getSession()).data.session?.provider_token;
    if (!provider_token) throw new Error("No auth token found");
    return new Octokit({ auth: provider_token });
}

export async function getGitHubUser(octo?: Octokit) {
    const octokit = octo ?? await getClientOctokit();
    return (await octokit.users.getAuthenticated()).data;
}

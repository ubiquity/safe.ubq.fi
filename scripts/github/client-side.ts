import { createClient } from "@/app/lib/supabase/client";
import { Octokit } from "@octokit/rest";

export async function getClientOctokit() {
    const supabase = createClient();
    const provider_token = (await supabase.auth.getSession()).data.session?.provider_token;
    if (!provider_token) throw new Error("No auth token found");
    return new Octokit({ auth: provider_token });
}

export async function getGitHubUser(octo?: Octokit) {
    const octokit = octo ?? await getClientOctokit();
    return (await octokit.users.getAuthenticated()).data;
}

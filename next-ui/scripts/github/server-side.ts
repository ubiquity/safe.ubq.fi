import { createClient } from "@/utils/supabase/server";
import { Octokit } from "@octokit/rest";

export async function getOctokit() {
    const supabase = createClient();
    const authToken = (await supabase.auth.getSession()).data.session?.access_token;
    if (!authToken) throw new Error("No auth token found");
    return new Octokit({ auth: authToken });
}

export async function getGitHubUser(octo?: Octokit) {
    const octokit = octo ?? await getOctokit();
    return octokit.users.getAuthenticated();
}
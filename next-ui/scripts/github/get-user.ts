import { Octokit } from "@octokit/rest";
import { getSessionToken } from "../supabase/session";
import { GitHubUser, GitHubUserResponse } from "../types/github";
import { getLocalStore } from "../utils/local-storage";
import { OAuthToken } from "../types/auth";
declare const SUPABASE_STORAGE_KEY: string; // @DEV: passed in at build time check build/esbuild-build.ts

export async function getGitHubUser(): Promise<GitHubUser | null> {
    const activeSessionToken = await getSessionToken();
    return getNewGitHubUser(activeSessionToken);
}

async function getNewGitHubUser(providerToken: string | null): Promise<GitHubUser | null> {
    const octokit = new Octokit({ auth: providerToken });
    try {
        const response = (await octokit.request("GET /user")) as GitHubUserResponse;
        return response.data;
    } catch (error) {
        if (!!error && typeof error === "object" && "status" in error && error.status === 403) {
            console.error("GitHub API error", error);
        }
        console.warn("You have been logged out. Please login again.", error);
    }
    return null;
}

export function getGitHubUserName(): string | null {
    const oauthToken = getLocalStore(`sb-${SUPABASE_STORAGE_KEY}-auth-token`) as OAuthToken | null;

    const username = oauthToken?.user?.user_metadata?.user_name;
    if (username) {
        return username;
    }

    return null;
}
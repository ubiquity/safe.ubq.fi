import { getGitHubAccessToken } from "../github/get-access-token";
import { getGitHubUser } from "../github/get-user";
import { GitHubUser } from "../types/github";
import { renderGitHubLoginButton, renderUserInfo } from "./rendering";

export async function authentication() {
    const accessToken = await getGitHubAccessToken();
    if (!accessToken) {
        renderGitHubLoginButton();
    }

    const gitHubUser: null | GitHubUser = await getGitHubUser();
    if (gitHubUser) {
        renderUserInfo(gitHubUser);
    }
}



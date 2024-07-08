import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type GitHubUserResponse = RestEndpointMethodTypes["users"]["getByUsername"]["response"];
export type GitHubUser = GitHubUserResponse["data"];
export type AuthenticatedGitHubUser = RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"]

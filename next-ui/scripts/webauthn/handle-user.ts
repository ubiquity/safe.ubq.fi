import { createAndUseWallet } from "@keyrxng/webauthn-evm-signe";
import { JsonRpcProvider, keccak256 } from "ethers";
import { AuthenticatedGitHubUser, GitHubUser } from "../types/github";
import { UserAuth } from "../types/auth";

declare const SALT: string;

class AbortControlHandler extends AbortController {
    constructor() {
        super();
    }

    async abort() {
        this.abort();
    }

    async onabort() {
        return this.onabort;
    }
}

// creates a 20-byte user ID from the authed user ID and the GitHub node_id
export function computeUserID(authedUserID: string, ghUserID: string): string {
    return keccak256(
        new TextEncoder().encode(authedUserID + ghUserID)
    ).slice(2, 42);
}

export async function handleUser(
    ghUser: AuthenticatedGitHubUser,
    authUser: UserAuth,
    provider: JsonRpcProvider,
    challenge?: string,
    isRegistering?: boolean
) {

    return await createAndUseWallet(
        {
            id: computeUserID(authUser.id, ghUser.node_id),
            displayName: ghUser.name ?? ghUser.login,
            name: ghUser.login,
        },
        authUser,
        SALT,
        provider,
        new AbortControlHandler,
        challenge,
        isRegistering
    );
}
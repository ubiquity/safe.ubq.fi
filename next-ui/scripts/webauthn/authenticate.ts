import { provider } from "../funding/balance-check";
import { GitHubUser } from "../types/github";
import { computeUserID, handleUser } from "./handle-user";
import { UserAuth } from "../types/auth";

export async function authenticating(
    ghUser: GitHubUser,
    user: UserAuth,
    challenge: string,
) {
    const account = await handleUser(ghUser, user, provider, challenge, false);
    const { wallet, auth: { credential, publicKey } } = account;
    const userId = new TextDecoder().decode(new Uint8Array((credential.response as unknown as { userHandle: Uint8Array }).userHandle));

    if (!user) throw new Error("No user found")
    if (userId !== computeUserID(user.id, ghUser.node_id)) throw new Error("User mismatch")
    if (!publicKey) throw new Error("No public key found")

    const credPubKey = Object.keys(user?.existing || {}).find(k => k === publicKey);

    if (!credPubKey) throw new Error("No public key found")
    if (credPubKey !== publicKey) throw new Error("Public key mismatch")

    return wallet;
}
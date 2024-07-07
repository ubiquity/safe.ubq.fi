import { provider } from "../funding/balance-check";
import { getSupabase } from "../supabase/session";
import { GitHubUser } from "../types/github";
import { computeUserID, handleUser } from "./handle-user";

export async function authenticating(
    ghUser: GitHubUser,
    authUser: any,
    challenge: string,
) {
    const account = await handleUser(ghUser, authUser, provider, challenge, false);
    const { wallet, auth: { credential, publicKey } } = account;
    const { data: { user } } = await getSupabase().auth.getUser()
    const userId = new TextDecoder().decode(new Uint8Array((credential.response as unknown as { userHandle: Uint8Array }).userHandle));

    if (!user) throw new Error("No user found")
    if (userId !== computeUserID(authUser.id, ghUser.node_id)) throw new Error("User mismatch")

    const credPubKey = user.user_metadata.credentials.find((c: any) => c.attest.id === credential.id)?.publicKey;

    if (!credPubKey) throw new Error("No public key found")
    if (credPubKey !== publicKey) throw new Error("Public key mismatch")

    return wallet;
}
import { RegistrationCredential } from "@keyrxng/webauthn-evm-signer";
import { provider } from "../funding/balance-check";
import { getSupabase } from "../supabase/session";
import { GitHubUser } from "../types/github";
import { handleUser } from "./handle-user";
import { ExistingCredentials, UserAuth } from "../types/auth";
import { getUserExistingCreds } from "../supabase/server-side";

export async function registering(ghUser: GitHubUser, oauthUser: UserAuth) {
    const account = await handleUser(ghUser, oauthUser, provider, undefined, true)
    if (!account) throw new Error("Account not found")
    const { wallet, auth } = account;
    const registering = auth as RegistrationCredential;
    const { credential, publicKey, transports } = registering

    const newCredential: ExistingCredentials = {
        // these are required in order to perform allow/exclude operations
        [publicKey]: {
            id: credential.id, // base64url encoded
            type: credential.type as PublicKeyCredentialType,
            transports,
            algorithm: registering.algorithm,
        }
    }

    const newCredentials = [...await getUserExistingCreds(), newCredential];

    await getSupabase().auth.updateUser({
        data: {
            credentials: newCredentials
        }
    });

    return wallet;
}

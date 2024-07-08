import { Wallet } from "ethers";
import { GitHubUser } from "../types/github";
import { isWebAuthnSupported } from "./rendering";
import { toastNotification } from "../utils/notification";
import { handleFunding } from "../funding/fund";
import { registering } from "./register";
import { authenticating } from "./authenticate";
import { CHALLENGE } from "../utils/strings";
import { getAuthedUser } from "../supabase/server-side";

export async function webAuthn(ghUser: GitHubUser, isRegistering: boolean) {
    try {
        const wallet = await getWebAuthnWallet(ghUser, isRegistering);
        await handleFunding(wallet);
        return wallet;
    } catch (error) {
        if (error instanceof Error) {
            toastNotification(`WebAuthn error: ${error.message}`, 5000);
            console.error("WebAuthn error", error)
        } else {
            console.error("WebAuthn error", error);
        }
    }
}

async function getWebAuthnWallet(ghUser: GitHubUser, isRegistering: boolean, challenge?: string): Promise<Wallet> {
    await isWebAuthnSupported();
    const authedUser = await getAuthedUser();
    if (!authedUser) throw new Error("User not found");

    if (isRegistering) {
        // no challenge for registration otherwise it's a double sign-in
        return registering(ghUser, authedUser);
    } else {
        return authenticating(ghUser, authedUser, challenge ?? CHALLENGE);
    }
}

import { ethers } from "ethers";
import { GitHubUser } from "../types/github";
import { isWebAuthnSupported } from "./rendering";
import { getUser } from "../supabase/session";
import { createAndUseWallet } from "@ubiquity/webauthn-evm-signer";
import { User, UserAuth } from "../types/auth";

const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // @todo: pull from rpc-handler

declare const SALT: string;

export async function webAuthn(ghUser?: GitHubUser | null) {
    await isWebAuthnSupported(); // backout if not supported

    if (!ghUser) {
        throw new Error("GitHub user not found");
    }

    const userAuth = await getUser(); // get our UUIDs and CA

    if (!userAuth) {
        throw new Error("User not found");
    }

    const user = {
        id: userAuth.id, // TODO: I think this could be better
        displayName: ghUser.name ?? ghUser.login,
        name: ghUser.login,
    }

    return await handleUser(user, userAuth, provider);
}

function abortControlHandler() {
    // TODO: implement this
    return new AbortController();
}


async function handleUser(
    user: User,
    userAuth: UserAuth,
    provider: ethers.JsonRpcProvider
) {
    const authedUser = await getUser();
    if (!authedUser) {
        throw new Error("User not found");
    }

    return await createAndUseWallet(user, userAuth, SALT, provider, abortControlHandler());
}
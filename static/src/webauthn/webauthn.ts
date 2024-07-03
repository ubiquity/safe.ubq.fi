import { ethers } from "ethers";
import { GitHubUser } from "../types/github";
import { isWebAuthnSupported } from "./rendering";
import { getUser } from "../supabase/session";
import { createAndUseWallet } from "@ubiquity/webauthn-evm-signer";
import { User, UserAuth } from "../types/auth";
import { walletNeedsFunded, fundWalletFromFaucet } from "../funding/balance-check";

const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology"); // @todo: pull from rpc-handler

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

    const signer = await handleUser(user, userAuth, provider);

    if (await walletNeedsFunded(signer)) {
        const killToast = toastNotification("Funding wallet from faucet...");
        const res = await fundWalletFromFaucet(signer);
        console.log("res", res); // @todo: handle this better
        killToast();
    } else {
        toastNotification("Wallet already funded");
    }

    return signer;
}

function toastNotification(message: string) {
    const toast = document.createElement("div");
    toast.textContent = message;

    const style = `
        position: fixed;
        bottom: 0;
        right: 0;
        background-color: #333;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        `
    toast.style.cssText = style;

    document.body.appendChild(toast);

    return () => {
        document.body.removeChild(toast);
    }
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
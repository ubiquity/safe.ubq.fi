import { ethers, randomBytes } from "ethers";
import { Wallet } from "ethers";
import { createCredentialOptions } from "./create";
import { createSalt } from "../keygen/salts";
import { deriveEthereumPrivateKey } from "../keygen/derive";
import { generateMnemonic } from "../keygen/words";
import { GitHubUser } from "../types/github";
import { strToUint8Array } from "../utils/strings";
import { isWebAuthnSupported } from "./rendering";
import { SmartAccount } from "../types/auth";

const PUBLIC_KEY = "public-key";

const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // @todo: pull from rpc-handler

export async function webAuthn(abortController: AbortController, ghUser?: GitHubUser | null) {
    await isWebAuthnSupported();

    const userCache = localStorage.getItem("ubqfi_acc");
    const user = userCache ? JSON.parse(userCache) : null;

    let signer: Wallet | null = null;
    let account: SmartAccount | null = null;

    if (user) {
        const handled = await handleUser(user, provider);
        signer = handled.signer;
        account = handled.account;
    } else {
        const acc = await createPasskeyHandler(abortController, ghUser);
        signer = acc.signer;
        account = acc.account;
    }

    return {
        signer,
        account,
    };
}

async function handleUser(
    user: PublicKeyCredentialUserEntity,
    provider: ethers.JsonRpcProvider
) {
    const challenge = createSalt(user)
    const pk = deriveEthereumPrivateKey(challenge)
    if (!pk) {
        throw new Error("Failed to derive private key")
    }

    const signer = new ethers.Wallet(pk, provider);
    const account = {
        privateKey: pk,
        publicKey: signer.address,
        mnemonic: generateMnemonic(pk)?.phrase || "Failed to generate mnemonic",
    };

    return {
        account, signer
    }
}

export async function createPasskeyHandler(abortController: AbortController, ghUser?: GitHubUser | null) {
    const username = ghUser?.login || prompt("Enter a username");

    if (!username) {
        throw new Error("Username is required");
    }

    const credOpts = createCredentialOptions({
        name: username,
        displayName: username,
        id: randomBytes(64),
    })

    const userCache = localStorage.getItem("ubqfi_acc");
    const user = userCache ? JSON.parse(userCache) : null;
    let cred: Credential | null = null;

    if (user) {
        if (!credOpts.publicKey) {
            throw new Error("Public key is required");
        }

        // this prevents duplicate key creation
        credOpts.publicKey.excludeCredentials = [
            {
                id: user.id,
                type: PUBLIC_KEY,
            },
        ];
    }

    try {
        cred = await navigator.credentials.create({
            publicKey: credOpts.publicKey,
            signal: abortController.signal,
        });
    } catch {
        // autofill request needs aborted
        if (!abortController.signal.aborted) {
            abortController.abort();
            cred = await navigator.credentials.create({
                publicKey: credOpts.publicKey,
            });
        }

    }


    if (cred) {
        const credUser = {
            name: username,
            displayName: username,
            id: strToUint8Array(cred.id),
        }
        localStorage.setItem("ubqfi_acc", JSON.stringify({ id: cred.id, name: username, ghId: ghUser?.id }));
        return handleUser(credUser, provider);
    } else {
        throw new Error("Failed to create credential");
    }
}

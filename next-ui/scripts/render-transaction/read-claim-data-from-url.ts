import { createClient } from "@supabase/supabase-js";
import { decodePermits } from "@ubiquibot/permit-generation/dist/handlers";
import { PermitReward } from "@ubiquibot/permit-generation/dist/types";
import { connectWallet } from "../web3/connect-wallet";
import { checkRenderInvalidatePermitAdminControl, checkRenderMakeClaimControl } from "../web3/erc20-permit";
import { verifyCurrentNetwork } from "../web3/verify-current-network";
import { claimRewardsPagination } from "./claim-rewards-pagination";
import { AppState, app } from "@/utils/app-state";
import { toaster } from "@/components/toaster";
import { renderTransaction } from "./render-transaction";
import { setClaimMessage } from "./set-claim-message";
import { useRpcHandler } from "../web3/use-rpc-handler";

const key = process.env.SUPABASE_ANON_KEY;
const url = process.env.SUPABASE_URL;

export async function getSupabase() {
    return createClient(url as string, key as string);
}

export async function readClaimDataFromUrl(app: AppState, permits?: string) {
    const base64encodedTxData = permits;
    const table = document.getElementsByTagName(`table`)[0];

    if (!base64encodedTxData) {
        // No claim data found
        setClaimMessage({ type: "Notice", message: `No claim data found.` });
        table.setAttribute(`data-make-claim`, "error");
        return;
    }

    app.claims = decodeClaimData(base64encodedTxData);
    app.claimTxs = await getClaimedTxs(app);
    try {
        app.provider = await useRpcHandler(app);
    } catch (e) {
        toaster.create("error", `${e}`);
    }

    if ((window as any).ethereum) {
        app.signer = await connectWallet();
        (window as any).ethereum.on("accountsChanged", () => {
            checkRenderMakeClaimControl(app).catch(console.error);
            checkRenderInvalidatePermitAdminControl(app).catch(console.error);
        });
    }

    displayRewardDetails();
    displayRewardPagination();

    await renderTransaction();
    if (app.networkId !== null) {
        await verifyCurrentNetwork(app);
    } else {
        throw new Error("Network ID is null");
    }
}

async function getClaimedTxs(app: AppState): Promise<Record<string, string>> {
    const txs: Record<string, string> = Object.create(null);
    const supabase = await getSupabase();
    for (const claim of app.claims) {
        // @ts-expect-error - no generic
        const { data } = supabase.from("permits").select("transaction").eq("nonce", claim.nonce.toString());

        if (data?.length == 1 && data[0].transaction !== null) {
            txs[claim.nonce.toString()] = data[0].transaction as string;
        }
    }
    return txs;
}

function decodeClaimData(base64encodedTxData: string): PermitReward[] {
    let permit;
    const table = document.getElementsByTagName(`table`)[0];

    try {
        permit = decodePermits(base64encodedTxData);
        return permit;
    } catch (error) {
        console.error(error);
        setClaimMessage({ type: "Error", message: `Invalid claim data passed in URL` });
        table.setAttribute(`data-make-claim`, "error");
        throw error;
    }
}

function displayRewardPagination() {
    const rewardsCount = document.getElementById("rewardsCount");
    if (rewardsCount) {
        if (!app.claims || app.claims.length <= 1) {
            // already hidden
        } else {
            claimRewardsPagination(rewardsCount);
        }
    }
}

function displayRewardDetails() {
    let isDetailsVisible = false;
    const table = document.getElementsByTagName(`table`)[0];
    table.setAttribute(`data-details-visible`, isDetailsVisible.toString());
    const additionalDetails = document.getElementById(`additionalDetails`) as HTMLElement;
    additionalDetails.addEventListener("click", () => {
        isDetailsVisible = !isDetailsVisible;
        table.setAttribute(`data-details-visible`, isDetailsVisible.toString());
    });
}
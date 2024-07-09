import { getMakeClaimButton } from "@/components/toaster";
import { removeAllEventListeners } from "./utils";
import { renderTransaction } from "./render-transaction";
import { app } from "@/utils/app-state";

export function claimRewardsPagination(rewardsCount: HTMLElement) {
    const nextTxButton = document.getElementById("nextTx");
    const prevTxButton = document.getElementById("prevTx");
    rewardsCount.innerHTML = `${app.rewardIndex + 1}/${app.claims.length} reward`;
    if (nextTxButton) nextTxButton.addEventListener("click", () => transactionHandler("next"));
    if (prevTxButton) prevTxButton.addEventListener("click", () => transactionHandler("previous"));
}

function transactionHandler(direction: "next" | "previous") {
    const table = document.querySelector(`table`) as HTMLTableElement;
    removeAllEventListeners(getMakeClaimButton()) as HTMLButtonElement;
    direction === "next" ? app.nextPermit() : app.previousPermit();
    table.setAttribute(`data-make-claim`, "error");
    renderTransaction().catch(console.error);
}
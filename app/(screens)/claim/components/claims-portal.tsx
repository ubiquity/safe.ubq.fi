"use client";
import React from "react";
import { CommitHashDisplay } from "./commit-hash";
import { readClaimDataFromUrl } from "@/app/(screens)/claim/scripts/render-transaction/read-claim-data-from-url";
import { claimErc20PermitHandlerWrapper } from "@/app/(screens)/claim/scripts/web3/erc20-permit";
import { viewClaimHandler } from "@/app/(screens)/claim/scripts/render-transaction/render-transaction";
import { app } from "@/lib/app-state";
import { Icon } from "@/components/icons";

async function setup(permits?: string) {
  await readClaimDataFromUrl(app, permits);
}

export default function ClaimsPortal({ permits }: { permits?: string }) {
  React.useEffect(() => {
    setup(permits);
  }, [permits]);
  return (
    <>
      <main>
        <div>
          <table data-details-visible="false" data-make-claim-rendered="false" data-contract-loaded="false" data-make-claim="error">
            <thead>
              <tr>
                <th>
                  <div>Notice</div>
                </th>
                <td>
                  <div className="loading-message">Loading</div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr id="Amount">
                <th>
                  <div>Amount</div>
                </th>
                <td id="rewardAmount">
                  <div className="loading-message">Loading</div>
                </td>
              </tr>
              <tr id="Token">
                <th>
                  <div>Token</div>
                </th>
                <td id="rewardToken">
                  <span className="full">
                    <div></div>
                  </span>
                  <span className="short">
                    <div className="loading-message">Loading</div>
                  </span>
                </td>
              </tr>
              <tr id="To">
                <th>
                  <div>For</div>
                </th>
                <td id="rewardRecipient">
                  <span className="full">
                    <div></div>
                  </span>
                  <span className="short">
                    <div className="loading-message">Loading</div>
                  </span>
                  <span className="ens">
                    <div></div>
                  </span>
                </td>
              </tr>
              <tr id="additional-details-border">
                <th>
                  <div>
                    <button id="additionalDetails">
                      <div>Details</div>
                      <Icon name="closer" className="closer" />
                      <Icon name="opener" className="opener" />
                    </button>
                  </div>
                </th>
                <td>
                  <div id="controls" data-loader="false" data-make-claim="false" data-view-claim="false" data-github-sign-in="false">
                    <button id="claim-loader">
                      <Icon name="claimLoader" />
                      <div id="claiming-message">Claiming</div>
                    </button>
                    <button id="make-claim" onClick={() => claimErc20PermitHandlerWrapper(app)}>
                      <div className="claim-title">Collect</div>
                      <Icon name="makeClaim" className="claim-title" />
                    </button>

                    <button id="view-claim" onClick={() => viewClaimHandler(app)}>
                      <div className="claim-title">View Claim</div>
                      <Icon name="viewClaim" />
                    </button>

                    <button id="invalidator">
                      <div>Void</div>
                      <Icon name="invalidator" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody id="additionalDetailsTable"></tbody>
          </table>
        </div>
        <footer>
          <figure id="carousel">
            <div id="prevTx"></div>
            <div id="rewardsCount"></div>
            <div id="nextTx"></div>
          </figure>
          <CommitHashDisplay />
        </footer>
      </main>
      <ul className="notifications"></ul>
    </>
  );
}

import { permit2Abi } from "@/app/(screens)/claim/scripts/abis";
import { PERMIT2_ADDRESS } from "@/app/(screens)/claim/scripts/generate-erc20-permit-url";
import { getSigner } from "@/app/lib/eoa/get-signer";
import { provider } from "@/app/lib/funding/balance-check";
import { PermitReward } from "@ubiquibot/permit-generation/dist/types";
import { Contract } from "ethers";
import { parseUnits, toHex } from "viem";


export async function claimPermit(reward: PermitReward) {
    const signer = await getSigner("amoy");

    if (!signer || !reward || !PERMIT2_ADDRESS || !permit2Abi) {
        throw new Error("Invalid request");
    }

    const permit2Contract = new Contract(
        PERMIT2_ADDRESS,
        permit2Abi,
        signer.connect(provider)
    );

    const tx = await permit2Contract.connect(signer).getFunction("permitTransferFrom").call([
        {
            requestedAmount: toHex(reward.transferDetails.requestedAmount),
            to: reward.transferDetails.to,
        }, {
            permitted: {
                token: reward.permit.permitted.token,
                amount: toHex(reward.permit.permitted.amount),
            },
            nonce: reward.permit.nonce,
            deadline: reward.permit.deadline,
        },

        reward.owner,
        reward.signature]
    );


    console.log("Claimed permit", tx);

    await tx.wait();

    return tx;
}
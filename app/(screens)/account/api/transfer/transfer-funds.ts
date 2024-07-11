import { getSigner } from "@/app/lib/eoa/get-signer";
import { Networks } from "@/app/types/blockchain";
import { Contract } from "ethers";
import { parseUnits } from "viem";

export async function transferNative(amount: number, to: `0x${string}`, network: Networks) {
    const value = parseUnits(amount.toString(), 18);
    if (!value || value === BigInt(0)) return;
    try {
        const signer = await getSigner(network);
        if (!signer) {
            return "Signer not found";
        }
        const tx = await signer?.sendTransaction({
            to,
            value: value
        });

        await tx.wait();

        return tx.hash;
    } catch (error) {
        return error;
    }

}

export async function transferErc20(amount: number, to: `0x${string}`, token: `0x${string}`, network: Networks) {
    const value = parseUnits(amount.toString(), 18);
    if (!value || value === BigInt(0)) return;

    try {
        const signer = await getSigner(network);
        const contract = new Contract(token, ["function transfer(address, uint256)"], signer);

        const tx = await contract.transfer(to, value);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        return error;
    }
}

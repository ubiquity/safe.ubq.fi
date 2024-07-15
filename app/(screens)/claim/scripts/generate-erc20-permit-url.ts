import { provider } from "@/app/lib/funding/balance-check";
import { MaxUint256, PermitTransferFrom, SignatureTransfer } from "@uniswap/permit2-sdk";
import { randomBytes } from "crypto";
import { Contract, parseUnits, Wallet } from "ethers";
import { toHex } from "viem";

export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; // same on all chains

function createProviderAndWallet() {
  const myWallet = new Wallet(process.env.VANITY_ETH_PRIVATE_KEY as string, provider);
  return { provider, myWallet };
}

async function createPermitTransferFromData(token: string, amount: string, address: string) {
  const { provider } = createProviderAndWallet();
  const erc20Abi = ["function decimals() public view returns (uint8)"];
  if (!token) {
    throw new Error("Token address is required");
  }

  const tokenContract = new Contract(token, erc20Abi, provider);
  const tokenDecimals = await tokenContract.decimals();

  return {
    permitted: {
      token: token || "",
      amount: parseUnits(amount || "", tokenDecimals),
    },
    spender: address,
    nonce: "0x" + randomBytes(32).toString("hex"),
    deadline: toHex(MaxUint256.toBigInt()),
  };
}

async function signTypedData(myWallet: Wallet, permitTransferFromData: PermitTransferFrom) {
  const { domain, types, values } = SignatureTransfer.getPermitData(
    permitTransferFromData,
    PERMIT2_ADDRESS,
    80002
  );
  return await myWallet.signTypedData(domain, types, values);
}

function createTxData(myWallet: Wallet, permitTransferFromData: PermitTransferFrom, signature: string) {
  return {
    type: "erc20-permit",
    permit: {
      permitted: {
        token: permitTransferFromData.permitted.token,
        amount: permitTransferFromData.permitted.amount.toString(),
      },
      nonce: permitTransferFromData.nonce.toString(),
      deadline: permitTransferFromData.deadline.toString(),
    },
    transferDetails: {
      to: permitTransferFromData.spender,
      requestedAmount: permitTransferFromData.permitted.amount.toString(),
    },
    owner: myWallet.address,
    signature: signature,
    networkId: 80002,
  };
}

export async function generateERC20Permit(token: string, address: string) {
  const { myWallet } = createProviderAndWallet();

  const permitTransferFromData = await createPermitTransferFromData(token, "50", address);
  const signature = await signTypedData(myWallet, permitTransferFromData);

  const permitTransferFromData2 = await createPermitTransferFromData(token, "25", address);
  const sig = await signTypedData(myWallet, permitTransferFromData);

  const txData = [createTxData(myWallet, permitTransferFromData, signature), createTxData(myWallet, permitTransferFromData2, sig)];

  const base64encodedTxData = Buffer.from(JSON.stringify(txData)).toString("base64");
  return `/claim?txData=${base64encodedTxData}`;
}
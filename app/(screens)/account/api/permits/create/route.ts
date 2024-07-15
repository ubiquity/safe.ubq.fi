import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSigner } from "@/app/lib/eoa/get-signer";
import { Networks } from "@/app/types/blockchain";
import { Contract } from "ethers";
import { parseUnits } from "viem";
import { generateERC20Permit } from "@/app/(screens)/claim/scripts/generate-erc20-permit-url";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!key || !url) {
      throw new Error("Missing Supabase credentials");
    }
    createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    });

    const body = await request.json();

    if (!body || "error" in body) {
      return NextResponse.json({ error: body?.error || "Invalid request" });
    }

    let claimUrlSuffix;
    const { network } = body;

    if (network === "amoy") {
      claimUrlSuffix = await generateERC20Permit(body.token, body.address);
    }

    if (!claimUrlSuffix) {
      return NextResponse.json({ error: "Transaction failed" });
    }

    console.log("Permit added", claimUrlSuffix);

    return NextResponse.json({ claimUrlSuffix });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    } else {
      return NextResponse.error();
    }
  }
}


// makes the demo a bit more workable
export async function mintWxdai(network: Networks) {
  if (network !== "amoy") return "Invalid network";

  try {
    const signer = await getSigner(network);
    const contract = new Contract("0x54Dca79D5f88E19261F06A647566DeF7765D1fce", [
      "function transfer(address, uint256)",
      "function mint()",
      "function approve(address, uint256)",
    ], signer);

    const tx = await contract.mint();
    await tx.wait();
    await contract.approve("0x000000000022D473030F116dDEE9F6B43aC78BA3", parseUnits("100000000", 18));
    await tx.wait();
    return tx.hash;
  } catch (error) {
    return error;
  }
}

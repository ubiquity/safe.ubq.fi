import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifyAuthentication } from "@keyrxng/webauthn-evm-signer";
import { getUser } from "@/app/lib/supabase/server-side";
import { createUser } from "@/app/lib/utils";
import { getCurrentSession, updateCurrentSession } from "@/app/lib/kv/simple-kv";
import { redirect } from "next/navigation";
import { useRpcHandler } from "@/app/lib/eoa/balance";

/**
 * Used for creating the options needs to authenticate with WebAuthn.
 */
export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key || !url) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    });

    // this should have been store when we created the options
    const { data: session } = await getCurrentSession();
    if (!session) throw new Error("No session found");

    const challenge = session.currentChallenge;
    if (!challenge) throw new Error("No challenge found for the current session.")

    const user = await getUser(supabase);
    const { data, error } = await supabase.auth.getSession();
    if (!data.session || !user || error) throw new Error("No user found");

    const provider = await useRpcHandler(100);
    const body = await request.json();
    const orgSalt = process.env.SALT;
    if (!orgSalt) throw new Error("No salts found");

    const signer = await verifyAuthentication({
      data: body,
      orgSalts: orgSalt,
      session: {
        challenge: challenge,
        user: createUser(data.session.user.user_metadata),
      },
      userAuth: {
        ca: user.created_at,
        devices: user.app_metadata?.devices || [],
        id: user.id,
        iid: user.identities?.[0].identity_id || "",
      },

      provider,
      rpId: "localhost",
      type: "signer",
    });

    await updateCurrentSession({ currentChallenge: undefined });

    if (!signer) throw new Error("Verification failed");

    redirect("/account");
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    } else {
      return NextResponse.error();
    }
  }
}

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
  if (!session) {
    console.error("No session found");
    return NextResponse.error();
  }

  const challenge = session.currentChallenge;
  if (!challenge) {
    console.error("No challenge found");
    return NextResponse.error();
  }
  const user = await getUser(supabase);
  const { data, error } = await supabase.auth.getSession();
  if (!data.session || !user || error) {
    console.log(`No session found: ${error?.message} ${data.session} ${user}`);
    return NextResponse.error();
  }
  const provider = await useRpcHandler(100);
  const body = await request.json();
  const orgSalt = process.env.SALT;
  if (!orgSalt) {
    console.error("No salt found");
    return NextResponse.error();
  }
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

  if (!signer) {
    console.error("No signer found");
    return NextResponse.error();
  }
  redirect("/account");
}

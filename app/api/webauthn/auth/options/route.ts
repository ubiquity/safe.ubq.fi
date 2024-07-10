import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createLoginOpts } from "../../create-opts";
import { updateCurrentSession } from "@/app/lib/kv/simple-kv";

/**
 * Used for creating the options needs to authenticate with WebAuthn.
 */
export async function GET() {
  const cookieStore = cookies();
  const opts = await createLoginOpts();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

  await updateCurrentSession({ currentChallenge: opts.challenge });

  return NextResponse.json(opts);
}

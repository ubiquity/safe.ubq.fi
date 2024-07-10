import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createRegOpts } from "../../create-opts";

/**
 * Used for creating the options needs to authenticate with WebAuthn.
 */
export async function GET() {
  const cookieStore = cookies();
  try {
    const opts = await createRegOpts();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key || !url) {
      return NextResponse.error();
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

    return NextResponse.json(opts);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message })
    } else {
      return NextResponse.error();
    }
  }
}

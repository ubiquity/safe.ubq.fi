import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifyReg } from "./verify-registration";

/**
 * Used for creating the options needs to authenticate with WebAuthn.
 */
export async function POST(request: NextRequest) {
  const cookieStore = cookies();

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

  const isVerified = await verifyReg(body);

  if (!isVerified) {
    console.error("Registration failed", isVerified);
    return NextResponse.error();
  }

  return NextResponse.json({ isVerified });
}

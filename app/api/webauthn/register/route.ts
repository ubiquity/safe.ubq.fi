import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { verifyReg } from './verify-registration'

/**
 * Used for creating the options needs to authenticate with WebAuthn.
 */
export async function POST(request: NextRequest) {
    const cookieStore = cookies()

    createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                },
            },
        }
    )
    const body = await request.json()

    const verified = await verifyReg(body)

    if (!verified) {
        console.error("Registration failed", verified)
        return NextResponse.error()
    }

    return NextResponse.json({ verified })
}
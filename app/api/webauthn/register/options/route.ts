import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createLoginOpts, createRegOpts } from '../../create-opts'

/**
 * Used for creating the options needs to authenticate with WebAuthn.
 */
export async function GET(request: NextRequest) {
    const cookieStore = cookies()
    const opts = await createRegOpts()
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

    return NextResponse.json(opts)
}
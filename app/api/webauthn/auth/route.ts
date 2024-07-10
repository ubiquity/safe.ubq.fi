import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { verifyAuthentication } from '@keyrxng/webauthn-evm-signer'
import { getUser } from '@/app/lib/supabase/server-side'
import { createUser } from '@/app/lib/utils'
import { getCurrentSession, updateCurrentSession } from '@/app/lib/kv/simple-kv'

/**
 * Used for creating the options needs to authenticate with WebAuthn.
 */
export async function POST(request: NextRequest) {
    const cookieStore = cookies()

    const supabase = createServerClient(
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

    // this should have been store when we created the options
    const { data: session } = await getCurrentSession()
    if (!session) {
        console.error("No session found")
        return NextResponse.error()
    }

    const challenge = session.currentChallenge
    const user = await getUser(supabase)
    const { data, error } = await supabase.auth.getSession()
    if (!data.session || !user || error) {
        console.log(`No session found: ${error?.message} ${data.session} ${user}`)
        return NextResponse.error()
    }

    const body = await request.json()
    const verified = await verifyAuthentication(body, { user: createUser(user.user_metadata), challenge: challenge! }, "localhost")

    updateCurrentSession({ currentChallenge: undefined })

    return NextResponse.json({ verified })
}
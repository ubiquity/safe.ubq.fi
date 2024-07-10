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
    if (!challenge) {
        console.error("No challenge found")
        return NextResponse.error()
    }
    const user = await getUser(supabase)
    const { data, error } = await supabase.auth.getSession()
    if (!data.session || !user || error) {
        console.log(`No session found: ${error?.message} ${data.session} ${user}`)
        return NextResponse.error()
    }

    const body = await request.json()
    const signer = await verifyAuthentication({
        data: body,
        orgSalts: process.env.SALT!,
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

        provider: undefined,
        rpId: "localhost",
        type: "signer",
    })

    updateCurrentSession({ currentChallenge: undefined })

    const signerMetadata = {
        ...signer
    }

    return NextResponse.json(signerMetadata)
}
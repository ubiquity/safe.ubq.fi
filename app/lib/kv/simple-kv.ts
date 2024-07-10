import { cookies } from 'next/headers'
import { CurrentSession, SessionData } from './types';

/**
 * Ideally we'd use a KV store for this, but for now we'll use cookies.
 * Depending on who we deploy with either Cloudflare Workers or Vercel KV etc.
 */

const sessionPrefix = 'webauthn-aa-demo-session-';

export async function getCurrentSession(): Promise<CurrentSession> {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('session-id');

    if (sessionId?.value) {
        const session = (await getSession(sessionId.value))?.value

        if (session) {
            return { sessionId: sessionId.value, data: JSON.parse(session) };
        }
    }

    const newSessionId = Math.random().toString(36).slice(2);
    const newSession = { currentChallenge: undefined };
    cookieStore.set('session-id', newSessionId);
    await createSession(newSessionId, newSession);
    return { sessionId: newSessionId, data: newSession };
};

export async function updateCurrentSession(data: SessionData): Promise<void> {
    const { sessionId, data: oldData } = await getCurrentSession();
    await createSession(sessionId, { ...oldData, ...data });
};

async function getSession(id: string) {
    const cookieStore = cookies();
    return cookieStore.get(`${sessionPrefix}${id}`);
};

async function createSession(id: string, data: SessionData) {
    const cookieStore = cookies();
    return cookieStore.set(`${sessionPrefix}${id}`, JSON.stringify(data));
};

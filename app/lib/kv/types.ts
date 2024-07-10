import { User } from "@keyrxng/webauthn-evm-signer";

export type SessionData = {
    currentChallenge?: string;
    user?: User;
};
export type CurrentSession = {
    sessionId: string;
    data: SessionData;
}

"use server";
import { updateCurrentSession } from "@/app/lib/kv/simple-kv";
import { getUser } from "@/app/lib/supabase/server-side";
import { createUser } from "@/app/lib/utils";
import { createAuthenticateOptions, createRegisterOptions, User } from "@keyrxng/webauthn-evm-signer";
import { AuthenticatorTransportFuture } from "@simplewebauthn/typescript-types";

export async function createRegOpts(rpId?: string) {
  const user = createUser((await getUser())?.user_metadata);
  const opts = await createRegisterOptions({
    user: {
      displayName: user.displayName,
      name: user.name,
      devices: user.devices,
    },
    excludeCredentials:
      user.devices?.map((device) => {
        return {
          id: device.credentialID,
          transports: device.transports?.map((t) => t as AuthenticatorTransport) || [],
        };
      }) || [],
    rpId: rpId || "localhost",
  });

  await updateCurrentSession({ currentChallenge: opts.challenge, user: user });

  return opts;
}

export async function createLoginOpts(rpId?: string) {
  const user = createUser((await getUser())?.user_metadata);
  const opts = await createAuthenticateOptions({
    allowCredentials:
      user.devices?.map((device) => {
        return {
          id: device.credentialID,
          transports: device.transports?.map((t) => t as AuthenticatorTransportFuture) || [],
        };
      }) || [],
    rpId: rpId || "localhost",
  });

  if (!opts.challenge || !opts.challenge.length) {
    throw new Error("Failed to create login options");
  }

  await updateCurrentSession({ currentChallenge: opts.challenge, user: user });

  return opts;
}

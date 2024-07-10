import { getCurrentSession } from "@/app/lib/kv/simple-kv";
import { getSupabase, getUser } from "@/app/lib/supabase/server-side";
import { createUser } from "@/app/lib/utils";
import { UserDevice, verifyRegistration } from "@keyrxng/webauthn-evm-signer";
import { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";
import { JsonRpcProvider } from "ethers";

export async function verifyReg(credential: RegistrationResponseJSON, rpId?: string) {
  try {
    const supabase = await getSupabase();
    const { data: userData, error } = await supabase.auth.getUser();
    if (error || !userData.user) throw new Error("No user found");

    const user = await getUser(supabase);
    const session = await getCurrentSession();
    const challenge = session.data.currentChallenge;
    const salts = process.env.SALT;

    if (!user) throw new Error("No user found");
    if (!salts) throw new Error("No salts found");
    if (!challenge) throw new Error("No challenge found");

    const verified = await verifyRegistration({
      data: credential,
      orgSalts: salts,
      provider: new JsonRpcProvider("http://localhost:8545"),
      rpId: rpId || "localhost",
      userAuth: {
        ca: user.created_at,
        devices: user.app_metadata?.devices || [],
        id: user.id,
        iid: user.identities?.[0].identity_id || "",
      },
      session: {
        challenge: challenge,
        user: createUser(userData.user.user_metadata),
      },
    });

    if (!verified) throw new Error("Verification failed");
    const { signer, device } = verified;
    await storeDeviceData(device);

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
  /**
   * Only plain objects, and a few built-ins, can be passed to Client
   * Components from Server Components. Classes or null prototypes are not supported
   *
   *
   * return signer;
   */
}

/**
 * Could have a table for storing device data which might
 * be better than using the user_metadata of the auth table.
 *
 * Unsure which is better.
 */
async function storeDeviceData(device: UserDevice) {
  const supabase = await getSupabase();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData) {
    throw new Error("No user found");
  }
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("No user found");
  }

  const devices = user.user_metadata?.devices || [];
  devices.push(device);

  console.log(`Storing device data: ${JSON.stringify(devices)}`);
  await supabase.auth.updateUser({
    data: {
      devices: devices,
    },
  });
}

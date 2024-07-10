import { createAndUseSigner, FullUser, UserDevice } from "@keyrxng/webauthn-evm-signer";
import { getAuthedUser, getSupabase, getUser } from "../supabase/server-side";
import { getCurrentSession } from "../kv/simple-kv";
import { createUser } from "../utils";
import { redirect } from "next/navigation";
import { getDaiBalance, getNativeBalance, getProvider, TOKENS } from "./balance";
import { getAddress } from "./utils";

export type SignerData = {
  address: `0x${string}`;
  gnosisNativeBalance: string;
  ethNativeBalance: string;
  wxdaiBalance: string;
  daiBalance: string;
};

export async function getSigner(network: keyof typeof TOKENS) {
  const supabase = await getSupabase();
  const user = await getUser(supabase);
  const u = await getAuthedUser();
  const authUser = createUser(user?.user_metadata);
  const supabaseSession = supabase.auth.getSession();
  const session = await getCurrentSession();

  if (!user || !u || !authUser || !supabaseSession || !session) {
    redirect("/");
  }

  const fullUser: FullUser = {
    ...authUser,
    ca: user?.created_at || "",
    devices: user?.user_metadata?.devices || [],
    iid: user?.identities?.[0].identity_id || "",
    id: user?.id || "",
  };

  let device: UserDevice | undefined = fullUser.devices[0];
  if (fullUser.devices.length > 1) {
    device = fullUser.devices[1];
  }

  const provider = await getProvider(network);
  const orgSalts = process.env.SALT;
  if (!orgSalts) throw new Error("No salts found");

  const signer = await createAndUseSigner("signer", fullUser, device as UserDevice, orgSalts, provider);

  const address = await getAddress(signer);

  const balancePromise = getBalances(address);

  return {
    address,
    ...(await balancePromise),
  };
}

async function getBalances(address: `0x${string}`) {
  return Promise.all([
    getNativeBalance("gnosis", address),
    getNativeBalance("ethereum", address),
    getDaiBalance("gnosis", address),
    getDaiBalance("ethereum", address),
  ]).then(([gnosisNativeBalance, ethNativeBalance, wxdaiBalance, daiBalance]) => ({
    gnosisNativeBalance,
    ethNativeBalance,
    wxdaiBalance,
    daiBalance,
  }));
}

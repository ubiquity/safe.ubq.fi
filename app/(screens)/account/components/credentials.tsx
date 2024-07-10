import { Card } from "@/components/card";
import { PasskeyCreateButton } from "@/components/client/register-button";
import { UserDevice } from "@keyrxng/webauthn-evm-signer";
import { User } from "@supabase/supabase-js";

/**
 * Used for managing credentials related to the account.
 *
 * Therefor the underlying EOA should be derive without entropy from passkeys,
 * this way we are able to generate the same EOA under any passkey (which is the goal).
 * Although this means that we are far more reliant on OAuth because this is where
 * our entropy must then come from.
 *
 * This is a good thing because it means that we can then use the same EOA across
 * multiple devices and services without having to worry about the entropy of the
 * passkey.
 *
 * My thinking atm is that the OAuth ceremony could be avoided if we had a way
 * to store each public key in a secure way (right now it's via auth, which is bound to the user).
 *
 * If possible, we could then use webauthn to verify login and then confirm the cred with
 * the server and serve authentication this way. But it seems more fragile than OAuth.
 */
export function Credentials({ user, action }: { user: User; action: "create" | "manage" }) {
  const devices = user.user_metadata.devices;

  if (action === "create") {
    /**
     * Isn't fully implemented yet.
     */
    return (
      <div className="flex flex-col gap-4 mt-2 overflow-clip items-center justify-center h-full">
        <p className="text-xl text-gray-500">This likely will not exist like this production.</p>
        <PasskeyCreateButton text="Add Device" />
      </div>
    );
  } else if (action === "manage") {
    return (
      <div className="flex flex-col gap-4 mt-2 overflow-clip items-center justify-center h-full">
        <p className="text-xl text-gray-500">This likely will not exist like this production.</p>
        {devices.map((device: UserDevice, idx: number) => (
          <Card className="bg-[#3333] border-[#333] text-white flex">
            <div key={idx} className="gap-4">
              <p className="text-lg font-semibold">Device {idx + 1}</p>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-md ">CredentialID: {device.credentialID}</p>
                <p className="text-md">PublicKey: {device.credentialPublicKey}</p>
                <ul className="text-md">
                  <p className="text-md">Transports:</p>
                  {device.transports?.map((transport, idx) => <li key={idx}>{transport}</li>)}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  } else {
    return <p className="text-xl text-gray-500">Loading... step: {action}</p>;
  }
}

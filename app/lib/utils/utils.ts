import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User, UserDevice } from "@keyrxng/webauthn-evm-signer";
import { OauthUser } from "../types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * (on desktop) I'm limited to two devices otherwise the registration modal takes
 * on another form and wants me to pick an MFA device.
 */

export function createUser(user?: Partial<OauthUser["user_metadata"]>, manual?: { displayName: string; name: string; devices: UserDevice[] }): User {
  if (manual) return manual;
  if (user) {
    // Do any of these change if a user updates their profile?
    const dn = user.preferred_username ?? user.user_name ?? user.name;
    const n = user.preferred_username ?? user.user_name ?? user.name;

    if (!dn || !n) {
      throw new Error("User data is incomplete");
    }

    return {
      displayName: dn,
      name: n,
      devices: user.devices || ([] as UserDevice[]),
    };
  } else {
    return {
      displayName: "test",
      name: "test",
      devices: [],
    };
  }
}

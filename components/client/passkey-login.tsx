"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { getUser } from "@/app/lib/supabase/client-side";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/server/script/deps";
import { startAuthentication } from "@simplewebauthn/browser";
import { toast } from "sonner";

export function PasskeyLogin() {
  const [isFetching, setIsFetching] = useState(false);

  async function handleLogin() {
    const isSupported = await window.PublicKeyCredential.isConditionalMediationAvailable();
    if (!isSupported) {
      toast.error("WebAuthn is not supported in this browser");
    } else {
      const user = await getUser();
      if (!user) {
        toast.error("You must be logged in to use this feature");
        return;
      }

      if (!isFetching) {
        setIsFetching(true);
        const opts = await fetch("/api/webauthn/auth/options", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data: PublicKeyCredentialRequestOptionsJSON = await opts.json();
        const authData = await startAuthentication(data);
        const verified = await fetch("/api/webauthn/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(authData),
        });

        if (verified.status === 307 || verified.status === 200) {
          toast.success("Successfully logged in");
          window.location.href = "/account";
        } else {
          toast.error("Failed to login");
        }
      } else {
        console.error("Already fetching");
      }
    }
  }

  return (
    <Button onClick={() => handleLogin()} className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">
      Login
    </Button>
  );
}

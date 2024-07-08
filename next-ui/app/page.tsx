"use client";
import { Button } from "@/components/ui/button";
import { getClientGitHubUser } from "@/scripts/github/client-side";
import { AuthenticatedGitHubUser } from "@/scripts/types/github";
import { registering } from "@/scripts/webauthn/register";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [mediating, setMediating] = useState(false);
  const [ghuser, setGhuser] = useState<AuthenticatedGitHubUser | null>(null);

  useEffect(() => {
    async function load(){
      setGhuser(await getClientGitHubUser());
    }
    load();
    isAutofillAvailable().then(() => {
      setMediating(true);
    });
  }, []);

  useEffect(() => {
    if (mediating) {
      toast("Autofill is available");
    }
  }, [mediating]);

  async function isAutofillAvailable() {
    await window.PublicKeyCredential.isConditionalMediationAvailable();
  }

  async function registerWithOauth() {
    if(!ghuser) {
      toast.error("No user found");
      return;
    }


    // register passkey with oauth details
    const red = await registering(ghuser, oauthUser)

  }

  
  return (
    <div className="grid grid-cols-2 items-center justify-center h-screen text-white">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Passkey Creation</h1>
        <p className="text-lg">Create a new passkey to access your account</p>
        <p className="text-sm text-gray-400">*Automated with OAuth or enter details below</p>
        <form className="flex flex-col gap-1 items-center justify-center mt-2 w-96">
          <input type="text" placeholder="(Optional) display name" className="border border-gray-400 p-2 rounded w-80 " />
          <input type="text" placeholder="(Optional) email/name" className="border border-gray-400 p-2 rounded w-80" />
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded left-0">Register</Button>
        </form>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Login With Passkey</h1>
        <p className="text-lg">Already have a passkey? Login to access your account</p>
        <input autoComplete="webauthn" type="text" placeholder="(Optional) display name" className="border mt-2 border-gray-400 p-2 rounded w-80 " />
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-4 px-4 rounded left-0">Login</Button>
      </div>
    </div>
  );
}

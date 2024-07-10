"use client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { startRegistration } from "@simplewebauthn/browser";

export function PasskeyCreateButton() {
  async function handleRegister() {
    const opts = await fetch("/api/webauthn/register/options", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!opts.ok) {
      toast.error("Failed to fetch registration options");
      return;
    }

    const regData = await startRegistration(await opts.json());

    if (!regData) {
      toast.error("Failed to register");
      return;
    }

    const verifyReg = await fetch("/api/webauthn/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regData),
    });

    const result = await verifyReg.json();

    if (result.verified) {
      toast.success("Successfully registered");
    } else {
      toast.error("Failed to register");
    }
  }

  return (
    <Button onClick={() => handleRegister()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded left-0">
      Create
    </Button>
  );
}

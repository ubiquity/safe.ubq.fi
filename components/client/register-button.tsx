"use client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { startRegistration } from "@simplewebauthn/browser";

export function PasskeyCreateButton({ text }: { text: string }) {
  async function handleRegister() {
    const opts = await fetch("/api/webauthn/register/options", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = await opts.json();

    if ("error" in body) {
      toast.error(body.error);
      return;
    }

    const regData = await startRegistration(body);

    if (!regData) {
      toast.error("Failed to start registration");
      return;
    }

    const verifyReg = await fetch("/api/webauthn/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regData),
    });

    if (verifyReg.status === 307 || verifyReg.status === 200) {
      toast.success("Successfully logged in, redirecting...");
      window.location.href = "/account";
    } else {
      const body = await verifyReg.json();
      if ("error" in body) {
        toast.error(body.error);
      } else {
        toast.error("Failed to login");
      }
    }
  }

  return (
    <Button onClick={() => handleRegister()} className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">
      {text}
    </Button>
  );
}

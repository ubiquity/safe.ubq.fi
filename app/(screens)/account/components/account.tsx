"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { LeftHandProfileBox } from "./profile-box";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SignerData } from "@/app/lib/eoa/get-signer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export function Account({ user, signer }: { user: User; signer: SignerData }) {
  const [activeTab, setActiveTab] = useState("accounts");
  const [activeStep, setActiveStep] = useState("create");
  const [signerData, setSignerData] = useState<SignerData | null>(null);

  function handleTabChange(value: string) {
    const tab = value.split("-")[0];
    const step = value.split("-")[1];
    setActiveTab(tab);
    setActiveStep(step);
  }

  return (
    <>
      <div className="col-span-3">
        <LeftHandProfileBox usr={user} handleTabChange={handleTabChange} />
      </div>
      <div className="col-span-9 container">
        <Tabs defaultValue={activeTab} value={activeTab} className="w-[400px]">
          <BreadCrumbs steps={[activeTab, activeStep]} />

          <TabsContent value="accounts">
            <Accounts />
          </TabsContent>
          <TabsContent value="credentials">
            <Credentials />
          </TabsContent>
          <TabsContent value="earnings">
            <Earnings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

/**
 * Not implemented
 *
 * Used for managing aspects relating to a user's smart account
 * (e.g account abstraction implementation, Safe, etc.)
 *
 * configuring deployment settings, adding extensions, additional owners, etc.
 */
function Accounts() {
  return <p></p>;
}

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
function Credentials() {
  return <p></p>;
}

function BreadCrumbs({ steps }: { steps: string[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {steps.slice(0, -1).map((step, idx) => (
          <>
            <BreadcrumbItem key={idx}>
              <BreadcrumbLink href={`/${step}`}>{step}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{steps[steps.length - 1]}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * Used for the management of a user's earnings.
 *
 * This could be used for sending, receiving and withdrawing funds.
 * As well as stats on earnings, etc.
 */
function Earnings() {
  return <p></p>;
}

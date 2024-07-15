"use client";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { LeftHandProfileBox } from "./profile-box";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SignerData } from "@/app/lib/eoa/get-signer";
import { Accounts } from "./accounts";
import { Credentials } from "./credentials";
import { MoveFunds } from "./move-funds";
import { BreadCrumbs } from "@/components/breadcrumbs";

export function Account({ user, signer }: { user: User; signer: SignerData }) {
  const [activeTab, setActiveTab] = useState("accounts");
  const [activeStep, setActiveStep] = useState<"create" | "manage">("create");
  const [signerData, setSignerData] = useState<SignerData | null>(null);

  useEffect(() => {
    async function load() {
      setSignerData(await signer);
    }
    load().catch(console.error);
  }, [signer]);

  function handleTabChange(value: string) {
    const tab = value.split("-")[0];
    const step = value.split("-")[1] as "create" | "manage";
    setActiveTab(tab);
    setActiveStep(step);
  }

  return (
    <>
      <div className="col-span-3">
        <LeftHandProfileBox usr={user} handleTabChange={handleTabChange} />
      </div>
      <div className="col-span-9 container">
        <Tabs defaultValue={activeTab} value={activeTab}>
          <BreadCrumbs steps={[activeTab, activeStep]} />
          <TabsContent value="accounts">
            <Accounts signer={signerData} action={activeStep} />
          </TabsContent>
          <TabsContent value="credentials">
            <Credentials user={user} action={activeStep} />
          </TabsContent>
          <TabsContent value="earnings">
            <MoveFunds signer={signerData} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

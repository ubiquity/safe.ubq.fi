"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { LeftHandProfileBox } from "./profile-box";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SignerData } from "@/app/lib/eoa/get-signer";
import { Accounts } from "./accounts";
import { BreadCrumbs } from "@/components/ui/breadcrumbs";
import { Credentials } from "./credentials";
import { MoveFunds } from "./move-funds";

export function Account({ user, signer }: { user: User; signer: SignerData }) {
  const [activeTab, setActiveTab] = useState("accounts");
  const [activeStep, setActiveStep] = useState<"create" | "manage">("create");
  const [signerData, setSignerData] = useState<SignerData | null>(null);

  useEffect(() => {
    setSignerData(signer);
  }, [signer]);

  function handleTabChange(value: string) {
    const tab = value.split("-")[0];
    const step = value.split("-")[1] as "create" | "manage";
    console.log("tab", tab, "step", step);
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
            <MoveFunds />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

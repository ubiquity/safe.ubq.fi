"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { LeftHandProfileBox } from "./profile-box";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SignerData } from "@/app/lib/eoa/get-signer";

export function Account({ user, signer }: { user: User; signer: SignerData }) {
  const [activeTab, setActiveTab] = useState("accounts");
  const [signerData, setSignerData] = useState<SignerData | null>(null);

  function handleTabChange(value: string) {
    console.log("value", value);
    setActiveTab((prev) => value);
  }

  useEffect(() => {
    console.log("activeTab", activeTab);
    setSignerData(signer);
  }, [activeTab]);

  return (
    <>
      <div className="col-span-3">
        <LeftHandProfileBox usr={user} handleTabChange={handleTabChange} />
      </div>
      <div className="col-span-9 container">
        <Tabs defaultValue={activeTab} value={activeTab} className="w-[400px]">
          <TabsContent value="accounts">
            <p>accounts</p>
          </TabsContent>
          <TabsContent value="credentials">
            <p>credentials</p>
          </TabsContent>
          <TabsContent value="earnings">
            <p>earnings</p>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { LeftHandProfileBox } from "./profile-box";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SignerData } from "@/app/lib/eoa/get-signer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { cn } from "@/app/lib/utils";
import { UserDevice } from "@keyrxng/webauthn-evm-signer";
import { RegisterButton } from "@/components/client/buttons";
import { Button } from "@/components/ui/button";
import { PasskeyCreateButton } from "@/components/client/register-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
function Accounts({ signer, action }: { signer: SignerData | null; action: "create" | "manage" }) {
  if (!signer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  if (action === "create") {
    return (
      <div className="grid grid-flow-row gap-4 mt-2 h-full">
        {/* "Deploy Safe" will redirect to this area as a Safe
             is a smart account which is being created here, not 
             a new credential etc.
         */}
        <div className="flex flex-col gap-4">
          <CreateSafe />
        </div>
      </div>
    );
  } else if (action === "manage") {
    return (
      <div className="grid grid-flow-row gap-4 mt-2 h-full">
        <EOADisplay signer={signer} />
        <div className="grid grid-cols-2 gap-4">
          <SafeDisplay />
          <SafeDisplay />
        </div>
      </div>
    );
  } else {
    return <p className="text-xl text-gray-500">Loading... step: {action}</p>;
  }
}

function CreateSafe() {
  const spoofOptions = {
    owners: ["0x" + Math.floor(Math.random() * 10000).toString(16), "0x" + Math.floor(Math.random() * 10000).toString(16)],
    threshold: 5,
    extensions: ["Recurring Payments", "Automatic Withdrawals", "Auto-DeFi"],
  };

  /**
   * this is a creation component so it'll have selections,
   * inputs, toggles, sliders, etc.
   */
  return (
    <Card className="row-span-1 bg-[#3333] border-[#333] text-white">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold">Create Safe</p>
        <div className="grid grid-cols-2 gap-4">
          <DropDownOptions options={spoofOptions.owners} cat="Trusted Ubiquity Signers" />
          <DropDownOptions options={spoofOptions.threshold} cat="Signature Threshold" />
          <GroupOptionsSelect options={spoofOptions.extensions} cat="Extensions" />
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4 ">
              <h3 className="text-lg">Add Custom Owners</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Address" className="p-2 rounded-md" />
                <input type="text" placeholder="Address" className="p-2 rounded-md" />
              </div>
            </div>
            <Button className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">Create Safe</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function GroupOptionsSelect({ options, cat }: { options: string[]; cat: string }) {
  return (
    <ToggleGroup type="multiple" className="flex flex-col gap-4">
      <h3 className="text-lg">{cat}</h3>
      {options.map((option, idx) => (
        <ToggleGroupItem key={idx} value={option} className="hover:bg-[#000] text-white font-bold px-4 rounded left-0 data-[state=on]:bg-[#000]">
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function DropDownOptions({ options, cat }: { options: string[] | number; cat: string }) {
  const opts = typeof options === "number" ? Array.from({ length: options }, (_, i) => i + 1) : options;
  return (
    <Select>
      <h3 className="text-lg">{cat}</h3>
      <SelectTrigger className="w-[180px] data-[state=open]:bg-[#000] bg-[#333] hover:bg-[#000] text-white font-bold px-4 rounded left-0 data-[state=closed]:bg-[#333] data-[state=open]:text-white data-[state=open]:font-bold data-[state=open]:px-4 data-[state=open]:rounded">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="opacity-100 bg-gray-500">
        {opts.map((option, idx) => (
          <SelectItem key={idx} value={String(option)}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function EOADisplay({ signer }: { signer: SignerData }) {
  const { address, daiBalance, ethNativeBalance, gnosisNativeBalance, wxdaiBalance } = signer;

  return (
    <Card className="row-span-1 bg-[#3333] border-[#333] text-white">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold">Address: {address}</p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg">DAI Balance: {daiBalance}</p>
          <p className="text-lg">ETH Balance: {ethNativeBalance}</p>
          <p className="text-lg">Gnosis Balance: {gnosisNativeBalance}</p>
          <p className="text-lg">WXdai Balance: {wxdaiBalance}</p>
          <Button className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">Deploy Safe</Button>
          <Button className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">Claim Gas Gift</Button>
        </div>
      </div>
    </Card>
  );
}

function SafeDisplay() {
  const spoofSafe = {
    address: "0x" + Math.floor(Math.random() * 10000).toString(16),
    daiBalance: Math.floor(Math.random() * 1000),
    ethNativeBalance: Math.random().toFixed(5),
    gnosisNativeBalance: Math.random().toFixed(2),
    wxdaiBalance: Math.random().toFixed(2),
    owners: ["0x" + Math.floor(Math.random() * 10000).toString(16), "0x" + Math.floor(Math.random() * 10000).toString(16)],
    threshold: Math.floor(Math.random() * 5) + 1,
    extensions: ["RecurringPayments", "AutomaticWithdrawals", "Auto-DeFi"],
    delegateKeys: ["0x" + Math.floor(Math.random() * 10000).toString(16), "0x" + Math.floor(Math.random() * 10000).toString(16)],
  };

  return (
    <Card className="row-span-1 bg-[#3333] border-[#333] text-white">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold">Safe Address: {spoofSafe.address}</p>
        <div className="flex flex-col gap-4">
          <p className="text-lg">DAI Balance: {spoofSafe.daiBalance}</p>
          <p className="text-lg">ETH Balance: {spoofSafe.ethNativeBalance}</p>
          <p className="text-lg">Gnosis Balance: {spoofSafe.gnosisNativeBalance}</p>
          <p className="text-lg">WXdai Balance: {spoofSafe.wxdaiBalance}</p>
          <ul className="text-lg">
            <p>Owners:</p>
            {spoofSafe.owners.map((owner, idx) => (
              <li key={idx}>{owner}</li>
            ))}
          </ul>
          <p className="text-lg">Threshold: {spoofSafe.threshold}</p>
          <ul className="text-lg">
            <p>Extensions:</p>
            {spoofSafe.extensions.map((ext, idx) => (
              <li key={idx}>{ext}</li>
            ))}
          </ul>
          <ul className="text-lg">
            <p>Delegate Keys:</p>
            {spoofSafe.delegateKeys.map((key, idx) => (
              <li key={idx}>{key}</li>
            ))}
          </ul>
          <Button className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">Add Owner</Button>
          <Button className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">Add Extension</Button>
          <Button className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">Add Delegate Key</Button>
        </div>
      </div>
    </Card>
  );
}

function Card({ children, className }: { children: React.ReactNode; className: string }) {
  return <div className={cn(className, "p-6 rounded-xl shadow-lg border")}>{children}</div>;
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
function Credentials({ user, action }: { user: User; action: "create" | "manage" }) {
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

function BreadCrumbs({ steps }: { steps: string[] }) {
  return (
    <Breadcrumb className="text-gray-400">
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
  return (
    <div className="flex flex-row gap-4 mt-2 h-full">
      <Card className="bg-[#3333] border-[#333] text-white">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold self-center">Transfer</p>

          <div className="grid grid-cols-2 gap-4">
            <Select>
              <SelectTrigger className="w-[180px] data-[state=open]:bg-[#000] bg-[#333] hover:bg-[#000] text-white font-bold px-4 rounded left-0 data-[state=closed]:bg-[#333] data-[state=open]:text-white data-[state=open]:font-bold data-[state=open]:px-4 data-[state=open]:rounded">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="opacity-100 bg-gray-500">
                <SelectItem value="DAI">DAI</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="WXdai">WXdai</SelectItem>
              </SelectContent>
            </Select>
            <input type="text" placeholder="Amount" className="p-2 rounded-md bg-[#000]" />
            <input type="text" placeholder="Address" className="p-2 rounded-md bg-[#000]" />
            <Button className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">Send</Button>
          </div>
        </div>
      </Card>
      <Card className="bg-[#3333] border-[#333] text-white">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold">Withdraw</p>
          <div className="grid grid-cols-2 gap-4">
            {/* USD Balance */}
            <p className="text-lg">Balance: $356.76</p>
            <input type="text" placeholder="Amount" className="p-2 rounded-md bg-[#000]" />
            <Button className="bg-[#3333] hover:bg-[#000] col-span-2 text-white font-bold px-4 rounded left-0">Withdraw</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

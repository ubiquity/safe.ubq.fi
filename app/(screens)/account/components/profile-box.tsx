"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

type ProfileBoxParams = {
  usr: User;
};

function UpperBox({ usr, handleTabChange }: ProfileBoxParams & { handleTabChange: (value: string) => void }) {
  const buttons = [
    { label: "Settings", action: () => {} },
    { label: "Logout", action: () => {} },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <Image width={80} height={80} src={usr.user_metadata?.avatar_url} alt="avatar" className="w-20 h-20 rounded-full" />
      <p className="text-lg font-bold text-white">{usr.user_metadata?.preferred_username}</p>
      <p className="text-sm text-gray-400">{usr?.email}</p>
      <Separator className="border-t w-full border-[#333] my-4" />

      <div className="grid grid-cols-2 gap-2 w-full">
        {buttons.map((button) => (
          <Button key={button.label} onClick={button.action} className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded">
            {button.label}
          </Button>
        ))}
      </div>

      <Separator className="border-t w-full border-[#333] my-4" />
      <MainButtons handleTabChange={handleTabChange} />
    </div>
  );
}

function MainButtons({ handleTabChange }: { handleTabChange: (value: string) => void }) {
  function Buttons({ label, action, tooltip }: { label: string; action: () => void; tooltip?: string }) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={action} className="text-md bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded">
              {label}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="opacity-1 bg-[#333] p-2 rounded">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  function ButtonSet({ children, label, tooltip }: { children: React.ReactNode; label: string; tooltip?: string }) {
    return (
      <div className="flex flex-col items-center border border-[#333] w-full justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-md text-gray-400 underline cursor-pointer mt-1">{label}</TooltipTrigger>
            <TooltipContent className="opacity-1 bg-[#333] p-2 rounded">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-row gap-4">{children}</div>
      </div>
    );
  }

  const buttons = [
    {
      set: "Credential Management",
      Tooltip: "Add, remove, and manage your security keys.",
      tab: "credentials",
      buttons: [
        { label: "Create Passkey", action: () => handleTabChange("credentials-create"), tooltip: "Add an additional device to access your account with." },
        { label: "Manage Passkeys", action: () => handleTabChange("credentials-manage"), tooltip: "Remove and inspect your security keys." },
      ],
    },
    {
      set: "Account Management",
      Tooltip: "Create, modify and delete your smart accounts.",
      tab: "accounts",
      buttons: [
        { label: "Create Account", action: () => handleTabChange("accounts-create"), tooltip: "Create a new smart account." },
        { label: "Manage Accounts", action: () => handleTabChange("accounts-manage"), tooltip: "Modify, extend and upgrade your smart account." },
      ],
    },
    {
      set: "Earnings Management",
      Tooltip: "Send, receive and withdraw your earnings.",
      tab: "earnings",
      buttons: [
        { label: "Transfer Funds", action: () => handleTabChange("earnings-transfer"), tooltip: "Create a new earnings account." },
        { label: "Withdraw Funds", action: () => handleTabChange("earnings-withdraw"), tooltip: "Modify, extend and upgrade your earnings account." },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center w-full justify-center mt-4 gap-4">
      {buttons.map((buttonSet) => (
        <ButtonSet key={buttonSet.set} label={buttonSet.set} tooltip={buttonSet.Tooltip}>
          {buttonSet.buttons.map((button) => (
            <Buttons key={button.label} label={button.label} action={button.action} tooltip={button.tooltip} />
          ))}
        </ButtonSet>
      ))}
    </div>
  );
}

function BoxMiddle({ usr }: ProfileBoxParams) {
  const spoofData = {
    earnings: 356.76,
    accounts: 1,
    devices: usr.user_metadata?.devices?.length || 0,
  };
  return (
    <div className="flex flex-col h-full justify-around items-center bg-[#33] mt-4">
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg text-white">Earnings</p>
        <p className="text-2xl text-white font-bold">${spoofData.earnings}</p>
      </div>
      <Separator className="border-t w-full border-[#333] my-4" />
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg text-white">Accounts</p>
        <p className="text-2xl text-white font-bold">{spoofData.accounts}</p>
      </div>
      <Separator className="border-t w-full border-[#333] my-4" />
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg text-white">Devices</p>
        <p className="text-2xl text-white font-bold">{spoofData.devices}</p>
      </div>
    </div>
  );
}

function BoxFooter({ usr }: ProfileBoxParams) {
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <p className="text-sm text-gray-400">Account created on</p>
      <p className="text-sm text-gray-400">{new Date(usr.created_at).toLocaleDateString()}</p>
    </div>
  );
}

export function LeftHandProfileBox({ usr, handleTabChange }: ProfileBoxParams & { handleTabChange: (value: string) => void }) {
  return (
    <div className="flex flex-col bg-[#3333] p-4 rounded-3xl h-full justify-between">
      <UpperBox usr={usr} handleTabChange={handleTabChange} />
      <BoxMiddle usr={usr} />
      <BoxFooter usr={usr} />
    </div>
  );
}

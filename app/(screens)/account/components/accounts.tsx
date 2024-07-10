import { DropDownOptions } from "./drop-down-options";
import { GroupOptionsSelect } from "./group-options-select";
import { Button } from "@/components/ui/button";
import { SignerData } from "@/app/lib/eoa/get-signer";
import { Card } from "@/components/card";
import { fundWalletFromFaucet } from "@/app/lib/funding/balance-check";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Accounts({ signer, action }: { signer: SignerData | null; action: "create" | "manage" }) {
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
        <WalletDisplay signer={signer} />
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

function WalletDisplay({ signer }: { signer: SignerData }) {
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => fundWalletFromFaucet(signer.address)}
                  className="bg-[#3333] w-full hover:bg-[#000] text-white font-bold px-4 rounded left-0"
                >
                  Claim Gas Gift
                </Button>
              </TooltipTrigger>
              <TooltipContent className="opacity-1 bg-[#333] p-2 rounded">
                <p>The faucet seems to hit CPU limits after one request and will sleep for 1-2 mins.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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

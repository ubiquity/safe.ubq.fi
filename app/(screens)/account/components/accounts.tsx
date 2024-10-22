import { DropDownOptions } from "./drop-down-options";
import { GroupOptionsSelect } from "./group-options-select";
import { Button } from "@/components/ui/button";
import { SignerData } from "@/app/lib/eoa/get-signer";
import { Card } from "@/components/card";
import { fundWalletFromFaucet } from "@/app/lib/funding/balance-check";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// @ts-expect-error - no types
import { PermitReward } from "@ubiquibot/permit-generation/types";
import { TOKENS } from "@/app/types/blockchain";
import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { ExternalLink } from "lucide-react";

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
        <PermitsDisplay signer={signer} />
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

function PermitsDisplay({ signer }: { signer: SignerData }) {
  const [permits, setPermits] = useState<PermitReward[]>([]);

  async function handleAddPermit() {
    const endpoint = "account/api/permits/create";

    const network = "amoy";
    const token = TOKENS.amoy.dai;
    const address = signer.address;

    const body = { network, token, address };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Error adding permit", data.error);
    } else {
      console.log("Permit added", data.claimUrlSuffix);
    }

    const str = data.claimUrlSuffix.split("=")[1];

    const permitObjects = JSON.parse(atob(str));

    setPermits(permitObjects);

    console.log("Permits", permits);
  }

  async function handleClaimPermit(reward: PermitReward) {
    const endpoint = "account/api/permits/claim";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reward }),
    });

    const data = await response.json();

    console.log("Permit claimed", data);
  }

  function getTokenReadable(token: string) {
    return token === TOKENS.amoy.dai ? "WXDAI" : "Unknown Token";
  }

  return (
    <Card className="bg-[#3333] border-[#333] text-white">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold">Permits</p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg text-gray-500">
            Permits: <span className="text-white">{permits.length}</span>
          </p>
          <Button onClick={handleAddPermit} className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">
            Add Permit
          </Button>
          <ul className="text-lg col-span-2">
            <p className="text-gray-500 mb-2">Permits:</p>
            {permits.map((reward, idx) => (
              <Card key={idx} className="bg-[#3333] border-[#333] text-gray-500 grid grid-cols-6 items-center justify-between p-4">
                <div className="flex-1 ">
                  <p className="text-2xl font-bold text-white">${formatUnits(reward.permit.permitted.amount, 18).toString()}</p>
                </div>
                <div className="flex-1 text-center col-span-4">
                  <p className="text-white">
                    ({getTokenReadable(reward.permit.permitted.token)}): <span className="break-all">{reward.permit.permitted.token}</span>
                  </p>
                </div>
                <div className="flex-1 text-right col-span-1">
                  <Button onClick={() => handleClaimPermit(reward)} className="bg-[#333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">
                    Instant Claim
                  </Button>
                  <Button onClick={handleAddPermit} className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">
                    Claim Portal <ExternalLink className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
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
        <p className="text-lg font-semibold text-gray-500">
          Address: <span className="text-white">{address}</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg text-gray-500">
            Gnosis Balance: <span className="text-white">{gnosisNativeBalance}</span>
          </p>
          <p className="text-lg text-gray-500">
            WXdai Balance: <span className="text-white">{wxdaiBalance}</span>
          </p>
          <Button disabled className="bg-[#3333] hover:bg-[#000] text-white font-bold px-4 rounded left-0">
            Deploy Safe
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => fundWalletFromFaucet(signer.address)}
                  className="bg-[#3333] w-full hover:bg-[#000] text-white font-bold px-4 rounded left-0"
                >
                  Use Gas Faucet
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
  const ext = ["Recurring Payments", "Automatic Withdrawals", "Auto-DeFi"];
  const spoofSafe = {
    address: "0x" + Math.floor(Math.random() * 10000).toString(16),
    daiBalance: Math.floor(Math.random() * 1000),
    ethNativeBalance: Math.random().toFixed(5),
    gnosisNativeBalance: Math.random().toFixed(2),
    wxdaiBalance: Math.random().toFixed(2),
    owners: ["0x" + Math.floor(Math.random() * 10000).toString(16), "0x" + Math.floor(Math.random() * 10000).toString(16)],
    threshold: Math.floor(Math.random() * 5) + 1,
    extensions: ext.slice(0, Math.floor(Math.random() * 2)),
    delegateKeys: ["0x" + Math.floor(Math.random() * 10000).toString(16), "0x" + Math.floor(Math.random() * 10000).toString(16)],
  };

  return (
    <Card className="row-span-1 bg-[#3333] border-[#333] text-white">
      <div className="flex flex-col gap-4">
        <p className="text-lg text-gray-500 font-semibold">
          Safe Address: <span className="text-white">{spoofSafe.address}</span>
        </p>
        <div className="flex flex-col gap-4">
          <p className="text-lg text-gray-500">
            DAI Balance: <span className="text-white">{spoofSafe.daiBalance}</span>
          </p>
          <p className="text-lg text-gray-500">
            ETH Balance: <span className="text-white">{spoofSafe.ethNativeBalance}</span>
          </p>
          <p className="text-lg text-gray-500">
            Gnosis Balance: <span className="text-white">{spoofSafe.gnosisNativeBalance}</span>
          </p>
          <p className="text-lg text-gray-500">
            WXdai Balance: <span className="text-white">{spoofSafe.wxdaiBalance}</span>
          </p>
          <ul className="text-lg text-gray-500">
            <p>Owners:</p>
            {spoofSafe.owners.map((owner, idx) => (
              <li key={idx}>{owner}</li>
            ))}
          </ul>
          <p className="text-lg text-gray-500">
            Threshold: <span className="text-white">{spoofSafe.threshold}</span>
          </p>
          <ul className="text-lg">
            <p className="text-gray-500 mb-2">Extensions:</p>
            {spoofSafe.extensions.map((ext, idx) => (
              <li key={idx}>{ext}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

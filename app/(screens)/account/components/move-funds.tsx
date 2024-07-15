import { Card } from "@/components/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GroupOptionsSelect } from "./group-options-select";
import { Networks, TOKENS } from "@/app/types/blockchain";
import { useState } from "react";
import { toast } from "sonner";
import { SignerData } from "@/app/lib/eoa/get-signer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { DropdownSearch } from "@/components/client/dropdown-search";

/**
 * Used for the management of a user's earnings.
 *
 * This could be used for sending, receiving and withdrawing funds.
 * As well as stats on earnings, etc.
 */
export function MoveFunds({ signer }: { signer: SignerData | null }) {
  const [network, setNetwork] = useState<Networks>("amoy");
  const [token, setToken] = useState<string>("");

  async function handleTransfer(amount: number, to: string, network: Networks) {
    const endpoint = "account/api/transfer";

    const body = {
      amount,
      to,
      token,
      network,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if ("error" in data) {
      toast.error(data.error);
    } else {
      toast.success("Transaction successful");
    }

    return data.txHash;
  }

  async function handleWithdraw(amount: number, to: string, network: string) {
    const endpoint = "/api/withdraw";

    const body = {
      amount,
      to,
      network,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if ("error" in data) {
      throw new Error(data.error);
    }

    console.log("Transaction hash: ", data.txHash);

    return data.txHash;
  }

  async function handleMintWxdai(network: Networks) {
    const endpoint = "account/api/mint-wxdai";

    const body = {
      network,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if ("error" in data) {
      throw new Error(data.error);
    }

    console.log("Transaction hash: ", data.txHash);

    return data.txHash;
  }

  async function handleNetworkSelect(network: Networks) {
    setNetwork(network);
  }

  const tokenOptions = Array.from(
    Object.values(TOKENS.amoy).map((token, i) => {
      switch (token) {
        case TOKENS.amoy.dai:
          return { label: "xdai", value: token };
        case TOKENS.amoy.eth:
          return { label: "native", value: token };
        case TOKENS.amoy.weth:
          return { label: "weth", value: token };
        default:
          return { label: "unknown", value: token };
      }
    })
  );

  return (
    <div className="grid grid-cols-2 gap-4 mt-2 h-full">
      <Card className="bg-[#3333] border-[#333] text-white">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full flex justify-end items-center">
              <HelpCircle className="w-6 h-6" />
            </TooltipTrigger>
            <TooltipContent className="opacity-1 bg-[#333] p-2 rounded">
              <p>Select Amoy for the demo. </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold self-center">Transfer</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { amount, address } = e.target as HTMLFormElement;
              const hash = await handleTransfer(amount.value, address.value, network);
              console.log("txhash", hash);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <GroupOptionsSelect
                  handleNetworkSelect={handleNetworkSelect}
                  className="flex flex-row"
                  options={["Gnosis", "Amoy"] as unknown as Networks[]}
                  cat=""
                />
                <p className="text-lg self-center">Balance: {signer?.wxdaiBalance ?? "0.00"}</p>
              </div>

              <div className="flex flex-col gap-2">
                <DropdownSearch options={tokenOptions} setToken={setToken} />
                <input type="text" name="amount" placeholder="Amount" className="p-2 rounded-md bg-[#000]" />
              </div>
              <input type="text" name="address" placeholder="address" className="p-2 rounded-md bg-[#000] col-span-2" />
              <Button type="submit" className="bg-[#3333] hover:bg-[#000] text-white col-span-2 font-bold px-4 rounded left-0">
                Send
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Card className="bg-[#3333] border-[#333] text-white">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full flex justify-end items-center">
              <HelpCircle className="w-6 h-6" />
            </TooltipTrigger>
            <TooltipContent className="opacity-1 bg-[#333] p-2 rounded">
              <p>Select Amoy for the demo. </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-col gap-4 h-full w-full justify-between">
          <p className="text-lg font-semibold self-center">Withdraw</p>
          <div className="flex flex-row gap-4 h-full w-full justify-center items-center">
            <div className="flex justify-evenly gap-4 w-full items-center">
              <p className="text-lg self-center">Balance: {signer?.wxdaiBalance ?? "0.00"}</p>
              <input type="text" placeholder="Amount" className="p-2 rounded-md bg-[#000] h-min" />
            </div>
          </div>
          <Button type="submit" className="bg-[#3333] hover:bg-[#000] text-white col-span-2 font-bold mb-6 rounded border py-4">
            Withdraw
          </Button>
        </div>
      </Card>

      <Card className="bg-[#3333] border-[#333] text-white col-span-2">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold">Mint Free Tokens</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const hash = await handleMintWxdai(network);
              console.log("completed form submission", hash);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <p className="text-lg">WXDAI Balance: {signer?.wxdaiBalance ?? "0.00"}</p>
              <p className="text-lg text-gray-500">Only for the demo.</p>
              <Button className="bg-[#3333] hover:bg-[#000] col-span-2 text-white font-bold px-4 rounded left-0">Mint</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

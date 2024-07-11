import { Card } from "@/components/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GroupOptionsSelect } from "./group-options-select";
import { Networks, TOKENS } from "@/app/types/blockchain";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Used for the management of a user's earnings.
 *
 * This could be used for sending, receiving and withdrawing funds.
 * As well as stats on earnings, etc.
 */
export function MoveFunds() {
  const [network, setNetwork] = useState<Networks>("gnosis");

  async function handleTransfer(amount: number, to: string, token: keyof (typeof TOKENS)[Networks], network: Networks) {
    const endpoint = "account/api/transfer";
    const tokenAddress = TOKENS[network][token];

    const body = {
      amount,
      to,
      tokenAddress,
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

  async function handleNetworkSelect(network: Networks) {
    setNetwork(network);
  }

  return (
    <div className="flex flex-row gap-4 mt-2 h-full">
      <Card className="bg-[#3333] border-[#333] text-white">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold self-center">Transfer</p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { amount, address, token } = e.target as HTMLFormElement;
              const selectedToken = token.value;
              const hash = await handleTransfer(amount.value, address.value, selectedToken, network);
              console.log("completed form submission", hash);
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
              </div>
              <Select name="token">
                <SelectTrigger className="w-[180px] data-[state=open]:bg-[#000] bg-[#333] hover:bg-[#000] text-white font-bold px-4 rounded left-0 data-[state=closed]:bg-[#333] data-[state=open]:text-white data-[state=open]:font-bold data-[state=open]:px-4 data-[state=open]:rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="opacity-100 bg-gray-500">
                  <SelectItem value="DAI">DAI</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="WETH">WETH</SelectItem>
                </SelectContent>
              </Select>
              <input type="text" name="amount" placeholder="Amount" className="p-2 rounded-md bg-[#000]" />
              <input type="text" name="address" placeholder="Address" className="p-2 rounded-md bg-[#000]" />
              <Button type="submit" className="bg-[#3333] hover:bg-[#000] text-white col-span-2 font-bold px-4 rounded left-0">
                Send
              </Button>
            </div>
          </form>
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

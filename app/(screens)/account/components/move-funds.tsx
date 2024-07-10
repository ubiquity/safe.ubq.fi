import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Used for the management of a user's earnings.
 *
 * This could be used for sending, receiving and withdrawing funds.
 * As well as stats on earnings, etc.
 */
export function MoveFunds() {
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

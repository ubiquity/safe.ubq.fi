import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DropDownOptions({ options, cat }: { options: string[] | number; cat: string }) {
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

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function GroupOptionsSelect({ options, cat }: { options: string[]; cat: string }) {
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

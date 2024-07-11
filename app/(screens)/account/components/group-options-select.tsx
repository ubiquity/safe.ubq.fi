import { cn } from "@/app/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function GroupOptionsSelect({
  handleNetworkSelect,
  className,
  options,
  cat,
}: {
  handleNetworkSelect?: (network: string) => void;
  className?: string;
  options: string[];
  cat: string;
}) {
  return (
    <ToggleGroup type="multiple" className={cn("flex flex-col gap-4", className)}>
      <h3 className="text-lg">{cat}</h3>
      {options.map((option, idx) => (
        <ToggleGroupItem
          onClick={() => {
            if (handleNetworkSelect) {
              handleNetworkSelect(option);
            }
          }}
          name={option}
          key={idx}
          value={option}
          className="hover:bg-[#000] text-white font-bold px-4 rounded left-0 data-[state=on]:bg-[#000]"
        >
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

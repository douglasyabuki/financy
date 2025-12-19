import { CategoryIcons, type CategoryIcon } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface IconPicker {
  icon: CategoryIcon;
  onIconChange: (icon: CategoryIcon) => void;
}

export const IconPicker = ({ icon, onIconChange }: IconPicker) => {
  return (
    <div className="grid w-fit grid-cols-8 space-y-2 space-x-2">
      {Object.entries(CategoryIcons).map(([key, Icon]) => (
        <Button
          key={key}
          type="button"
          onClick={() => onIconChange(key)}
          variant="custom-icon"
          size="custom-icon-md"
          className={cn(icon === key && "border-brand-base")}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
};

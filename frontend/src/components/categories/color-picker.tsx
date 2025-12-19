import type { CategoryColor } from "@/constants/categories";
import { cn } from "@/lib/utils";

interface ColorButton {
  color: CategoryColor;
  isSelected?: boolean;
  onClick?: () => void;
}

interface ColorPicker {
  color: CategoryColor;
  onColorChange: (color: CategoryColor) => void;
}

const categoryVariants: Record<CategoryColor, string> = {
  GREEN: "bg-green-base",
  BLUE: "bg-blue-base",
  PURPLE: "bg-purple-base",
  PINK: "bg-pink-base",
  ORANGE: "bg-orange-base",
  RED: "bg-red-base",
  YELLOW: "bg-yellow-base",
};

const ColorButton = ({ color, isSelected, onClick }: ColorButton) => {
  return (
    <button
      type="button"
      className={cn(
        "flex h-7.5 w-12.5 items-center justify-center rounded-md border border-gray-300 p-1",
        isSelected && "border-brand-base",
      )}
      onClick={onClick}
    >
      <span
        className={cn("h-full w-full rounded-xs", categoryVariants[color])}
      />
    </button>
  );
};

export const ColorPicker = ({ color, onColorChange }: ColorPicker) => {
  return (
    <div className="flex items-center gap-2">
      {Object.keys(categoryVariants).map((key) => (
        <ColorButton
          key={key}
          color={key as CategoryColor}
          isSelected={color === key}
          onClick={() => onColorChange(key as CategoryColor)}
        />
      ))}
    </div>
  );
};

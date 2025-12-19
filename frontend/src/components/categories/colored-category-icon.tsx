import type { CategoryColor } from "@/constants/categories";
import { CategoryIcons, type CategoryIcon } from "@/constants/categories";
import { cn } from "@/lib/utils";

interface ColoredCategoryIcon {
  icon: CategoryIcon;
  color: CategoryColor;
}

const categoryVariants: Record<CategoryColor, string> = {
  GREEN: "bg-green-light text-green-base",
  BLUE: "bg-blue-light text-blue-base",
  PURPLE: "bg-purple-light text-purple-base",
  PINK: "bg-pink-light text-pink-base",
  ORANGE: "bg-orange-light text-orange-base",
  RED: "bg-red-light text-red-base",
  YELLOW: "bg-yellow-light text-yellow-base",
};

export const ColoredCategoryIcon = ({ icon, color }: ColoredCategoryIcon) => {
  const IconComponent = CategoryIcons[icon];
  return (
    <span
      className={cn(
        "flex size-10 items-center justify-center rounded-md border",
        categoryVariants[color],
      )}
    >
      {IconComponent && <IconComponent className="size-4" />}
    </span>
  );
};

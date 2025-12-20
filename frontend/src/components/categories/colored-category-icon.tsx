import type { CategoryColor } from "@/constants/categories";
import { CategoryIcons, type CategoryIcon } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const coloredCategoryIconVariants = cva(
  "flex items-center justify-center rounded-md border",
  {
    variants: {
      color: {
        GREEN:
          "bg-green-light text-green-base [&_svg:not([class*='text-'])]:text-green-base",
        BLUE: "bg-blue-light text-blue-base [&_svg:not([class*='text-'])]:text-blue-base",
        PURPLE:
          "bg-purple-light text-purple-base [&_svg:not([class*='text-'])]:text-purple-base",
        PINK: "bg-pink-light text-pink-base [&_svg:not([class*='text-'])]:text-pink-base",
        ORANGE:
          "bg-orange-light text-orange-base [&_svg:not([class*='text-'])]:text-orange-base",
        RED: "bg-red-light text-red-base [&_svg:not([class*='text-'])]:text-red-base",
        YELLOW:
          "bg-yellow-light text-yellow-base [&_svg:not([class*='text-'])]:text-yellow-base",
      },
      variant: {
        default: "size-10 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-auto border-none bg-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ColoredCategoryIcon extends VariantProps<
  typeof coloredCategoryIconVariants
> {
  icon: CategoryIcon;
  color: CategoryColor;
  className?: string;
}

export const ColoredCategoryIcon = ({
  icon,
  color,
  className,
  variant,
}: ColoredCategoryIcon) => {
  const IconComponent = CategoryIcons[icon];

  if (!IconComponent) return null;

  return (
    <div
      className={cn(coloredCategoryIconVariants({ color, variant }), className)}
    >
      <IconComponent className={cn(variant === "default" && "size-4")} />
    </div>
  );
};

import type { CategoryColor } from "@/constants/categories";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

type TagColor = CategoryColor | "GRAY";

const color: Record<TagColor, string> = {
  GRAY: "bg-gray-200 text-gray-700",
  GREEN: "bg-green-light text-green-dark",
  BLUE: "bg-blue-light text-blue-dark",
  PURPLE: "bg-purple-light text-purple-dark",
  PINK: "bg-pink-light text-pink-dark",
  ORANGE: "bg-orange-light text-orange-dark",
  RED: "bg-red-light text-red-dark",
  YELLOW: "bg-yellow-light text-yellow-dark",
};

const tagVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-sm tracking-0 font-medium leading-5 pointer-events-none select-none",
  {
    variants: { color },
    defaultVariants: {
      color: "GRAY",
    },
  },
);

function Tag({
  className,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="tag"
      data-color={color}
      className={cn(tagVariants({ color, className }))}
      {...props}
    />
  );
}

export { Tag, tagVariants };

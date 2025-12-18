import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";

type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: "horizontal" | "vertical";
  variant?: "default" | "darker";
};

const variants = cva("", {
  variants: {
    variant: {
      default: "bg-gray-200",
      darker: "bg-gray-300",
    },
    direction: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
});

function Divider({
  className,
  variant = "default",
  direction = "horizontal",
  ...props
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={direction}
      className={cn(variants({ direction, variant }), className)}
      {...props}
    />
  );
}

export { Divider };

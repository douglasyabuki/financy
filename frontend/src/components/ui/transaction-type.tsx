import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const transactionTypeVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm tracking-0 font-medium leading-5 pointer-events-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      type: {
        entry: "text-green-dark [&_svg]:text-green-base",
        expense: "text-red-dark [&_svg]:text-red-base",
      },
    },
    defaultVariants: {
      type: "entry",
    },
  },
);

type TransactionTypeProps = React.ComponentProps<"span"> &
  VariantProps<typeof transactionTypeVariants> & {
    asChild?: boolean;
  };

function TransactionType({
  className,
  type = "entry",
  asChild = false,
  children,
  ...props
}: TransactionTypeProps) {
  const Comp = asChild ? Slot : "span";
  const Icon = type === "entry" ? ArrowUpCircle : ArrowDownCircle;

  return (
    <Comp
      data-slot="transaction-type"
      data-type={type}
      className={cn(transactionTypeVariants({ type, className }))}
      {...props}
    >
      <Icon />
      {children}
    </Comp>
  );
}

export { TransactionType, transactionTypeVariants };

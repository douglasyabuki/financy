import { cn } from "@/lib/utils";
import type { TransactionType as TransactionTypeEnum } from "@/types";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import * as React from "react";

const transactionTypeBadgeVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm tracking-0 font-medium leading-5 pointer-events-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      type: {
        INCOME: "text-green-dark [&_svg]:text-green-base",
        EXPENSE: "text-red-dark [&_svg]:text-red-base",
      },
    },
    defaultVariants: {
      type: "EXPENSE",
    },
  },
);

type TransactionTypeBadge = React.ComponentProps<"span"> &
  VariantProps<typeof transactionTypeBadgeVariants> & {
    asChild?: boolean;
    type: TransactionTypeEnum;
  };

function TransactionTypeBadge({
  className,
  type = "EXPENSE",
  asChild = false,
  children,
  ...props
}: TransactionTypeBadge) {
  const Comp = asChild ? Slot : "span";
  const Icon = type === "INCOME" ? ArrowUpCircle : ArrowDownCircle;

  return (
    <Comp
      data-slot="transaction-type-badge"
      data-type={type}
      className={cn(transactionTypeBadgeVariants({ type, className }))}
      {...props}
    >
      <Icon />
      {children}
    </Comp>
  );
}

export { TransactionTypeBadge, transactionTypeBadgeVariants };

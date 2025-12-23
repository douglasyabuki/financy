import { cn } from "@/lib/utils";
import type { TransactionType as TransactionTypeEnum } from "@/types";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import * as React from "react";

const transactionTypeBadgeVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full text-sm tracking-0 font-medium leading-5 pointer-events-none select-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      type: {
        INCOME: "text-green-dark [&_svg]:text-green-base!",
        EXPENSE: "text-red-dark [&_svg]:text-red-base!",
      },
      displayText: {
        true: "gap-2 px-3 py-1",
        false: "gap-0 p-0",
      },
    },
    defaultVariants: {
      type: "EXPENSE",
      displayText: true,
    },
  },
);

type TransactionTypeBadge = React.ComponentProps<"span"> &
  VariantProps<typeof transactionTypeBadgeVariants> & {
    asChild?: boolean;
    type: TransactionTypeEnum | string;
    displayText?: boolean;
  };

function TransactionTypeBadge({
  className,
  type = "EXPENSE",
  asChild = false,
  displayText = true,
  ...props
}: TransactionTypeBadge) {
  const Comp = asChild ? Slot : "span";
  const normalizedType = type.toUpperCase() as TransactionTypeEnum;
  const Icon = normalizedType === "INCOME" ? ArrowUpCircle : ArrowDownCircle;

  return (
    <Comp
      data-slot="transaction-type-badge"
      data-type={normalizedType}
      className={cn(
        transactionTypeBadgeVariants({ type: normalizedType, displayText }),
        className,
      )}
      {...props}
    >
      <Icon />
      {displayText && (normalizedType === "INCOME" ? "Entrada" : "Saída")}
    </Comp>
  );
}

export { TransactionTypeBadge, transactionTypeBadgeVariants };

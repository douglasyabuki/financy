import type { TransactionType } from "@/types";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { Button } from "../ui/button";

interface TransactionTypePicker {
  transactionType: TransactionType;
  onTransactionTypeChange: (transactionType: TransactionType) => void;
}

export const TransactionTypePicker = ({
  transactionType,
  onTransactionTypeChange,
}: TransactionTypePicker) => {
  return (
    <div className="rounded-2lg flex items-center justify-center border border-gray-200 p-2">
      <Button
        onClick={() => onTransactionTypeChange("EXPENSE")}
        aria-selected={transactionType === "EXPENSE"}
        variant="transaction-type-expense"
        size="transaction-type"
        className="flex-1"
        type="button"
      >
        <CircleArrowDown />
        Despesa
      </Button>
      <Button
        onClick={() => onTransactionTypeChange("INCOME")}
        aria-selected={transactionType === "INCOME"}
        variant="transaction-type-income"
        size="transaction-type"
        className="flex-1"
        type="button"
      >
        <CircleArrowUp />
        Receita
      </Button>
    </div>
  );
};

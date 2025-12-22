import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionTypeBadge } from "./transaction-type-badge";

interface TypePicker {
  value: string;
  onValueChange: (value: string) => void;
  showAll?: boolean;
}

export const TypePicker = ({
  value,
  onValueChange,
  showAll = false,
}: TypePicker) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-12! w-full">
        <SelectValue placeholder="Selecione o tipo" />
      </SelectTrigger>
      <SelectContent className="px-3 py-3.5">
        {showAll && (
          <SelectItem value="all" className="h-10">
            Todos
          </SelectItem>
        )}
        <SelectItem value="income" className="h-10">
          <TransactionTypeBadge type="INCOME" className="px-0" />
        </SelectItem>
        <SelectItem value="expense" className="h-10">
          <TransactionTypeBadge type="EXPENSE" className="px-0" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

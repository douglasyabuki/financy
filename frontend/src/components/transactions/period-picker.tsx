import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

interface PeriodPicker {
  value: string;
  onValueChange: (value: string) => void;
}

export const PeriodPicker = ({ value, onValueChange }: PeriodPicker) => {
  const periods = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const value = `${date.getMonth()}-${date.getFullYear()}`;
      const label = date.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

      return { value, label: formattedLabel };
    });
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-12! w-full">
        <SelectValue placeholder="Selecione o período" />
      </SelectTrigger>
      <SelectContent className="px-3 py-3.5">
        {periods.map((period) => (
          <SelectItem key={period.value} value={period.value} className="h-10">
            <span className="text-base leading-4.5 tracking-normal text-gray-800">
              {period.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

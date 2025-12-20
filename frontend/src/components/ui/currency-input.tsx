import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";

interface CurrencyInput {
  value: string | number;
  onChange: (value: number) => void;
}

export const CurrencyInput = ({ value, onChange }: CurrencyInput) => {
  return (
    <NumericFormat
      value={value}
      onValueChange={({ floatValue }) => {
        onChange(floatValue ?? 0);
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      customInput={Input}
      className="h-12"
    />
  );
};

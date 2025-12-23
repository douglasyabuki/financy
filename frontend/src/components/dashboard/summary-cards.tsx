import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { NumericFormat } from "react-number-format";

interface SummaryCards {
  balanceSummary:
    | {
        balance: number;
        monthIncome: number;
        monthExpense: number;
      }
    | undefined;
}

export const SummaryCards = ({ balanceSummary }: SummaryCards) => {
  const {
    balance = 0,
    monthIncome = 0,
    monthExpense = 0,
  } = balanceSummary ?? {};
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="p-6">
        <CardHeader className="flex items-center justify-start gap-3">
          <Wallet className="text-purple-base size-5" />
          <CardTitle className="text-xs leading-4 font-medium tracking-[0.0375rem] text-gray-500">
            SALDO TOTAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NumericFormat
            value={balance}
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            className="text-start text-[1.75rem] leading-8 font-bold tracking-normal text-gray-800"
          />
        </CardContent>
      </Card>
      <Card className="p-6">
        <CardHeader className="flex items-center justify-start gap-3">
          <ArrowUpCircle className="size-5 text-green-500" />
          <CardTitle className="text-xs leading-4 font-medium tracking-[0.0375rem] text-gray-500">
            RECEITAS DO MÊS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NumericFormat
            value={monthIncome}
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            className="text-start text-[1.75rem] leading-8 font-bold tracking-normal text-gray-800"
          />
        </CardContent>
      </Card>
      <Card className="p-6">
        <CardHeader className="flex items-center justify-start gap-3">
          <ArrowDownCircle className="size-5 text-red-500" />
          <CardTitle className="text-xs leading-4 font-medium tracking-[0.0375rem] text-gray-500">
            DESPESAS DO MÊS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NumericFormat
            value={monthExpense}
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            className="text-start text-[1.75rem] leading-8 font-bold tracking-normal text-gray-800"
          />
        </CardContent>
      </Card>
    </div>
  );
};

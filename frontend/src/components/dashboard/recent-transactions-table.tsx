import { ColoredCategoryIcon } from "@/components/categories/colored-category-icon";
import type { Transaction } from "@/types";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { TransactionTypeBadge } from "../transactions/transaction-type-badge";
import { Link } from "../ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tag } from "../ui/tag";

interface RecentTransactionsTable {
  transactions: Pick<
    Transaction,
    "id" | "description" | "date" | "amount" | "type" | "category"
  >[];
}

export const RecentTransactionsTable = ({
  transactions,
}: RecentTransactionsTable) => {
  return (
    <Table className="rounded-2lg overflow-hidden bg-white ring ring-gray-200 ring-inset">
      <TableHeader className="">
        <TableRow className="h-15.25">
          <TableHead className="px-6 text-start">TRANSAÇÕES RECENTES</TableHead>
          <TableHead colSpan={2}>
            <div className="flex items-center justify-end px-6">
              <Link to="/transactions">
                Ver todas <ChevronRight className="size-4" />
              </Link>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="h-20">
            <TableCell className="px-6 text-base leading-6 font-medium tracking-normal text-gray-800">
              <div className="flex items-center gap-4">
                <ColoredCategoryIcon
                  icon={transaction.category.icon}
                  color={transaction.category.color}
                />
                <span className="flex flex-col gap-0.5">
                  <p className="text-base leading-6 font-medium tracking-normal text-gray-800">
                    {transaction.description}
                  </p>
                  <p className="text-sm leading-5 font-normal tracking-normal text-gray-600">
                    {format(new Date(transaction.date), "dd/MM/yy")}
                  </p>
                </span>
              </div>
            </TableCell>
            <TableCell className="w-50 px-6 text-center">
              <Tag color={transaction.category.color}>
                {transaction.category.title}
              </Tag>
            </TableCell>
            <TableCell className="w-50 px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <NumericFormat
                  value={transaction.amount}
                  displayType="text"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix={
                    transaction.type.toUpperCase() === "INCOME"
                      ? "+ R$ "
                      : "- R$ "
                  }
                  decimalScale={2}
                  fixedDecimalScale
                  className="text-center text-sm leading-5 font-semibold tracking-normal text-gray-800"
                  allowNegative={false}
                />
                <TransactionTypeBadge
                  type={transaction.type}
                  displayText={false}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="rounded-b-2lg bg-white ring ring-gray-200 ring-inset">
        <TableRow className="h-15">
          <TableCell colSpan={6} className="px-6">
            <Link to="/transactions" className="mx-auto">
              + Nova transação
            </Link>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

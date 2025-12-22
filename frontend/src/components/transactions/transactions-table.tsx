import type { Transaction } from "@/types";
import { format } from "date-fns";
import { SquarePen, Trash } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { ColoredCategoryIcon } from "../categories/colored-category-icon";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
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
import { TransactionTypeBadge } from "./transaction-type-badge";

interface TransactionsTable {
  transactions: Transaction[];
  offset: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  onEditToggle: (transaction: Transaction) => void;
  onDeleteToggle: (transaction: Transaction) => void;
}
export const TransactionsTable = ({
  transactions,
  offset,
  limit,
  totalCount,
  totalPages,
  currentPage,
  handlePageChange,
  onEditToggle,
  onDeleteToggle,
}: TransactionsTable) => {
  return (
    <Table className="rounded-2lg overflow-hidden bg-white ring ring-gray-200 ring-inset">
      <TableHeader className="">
        <TableRow className="h-14">
          <TableHead className="w-103.5 px-6 text-start">DESCRIÇÃO</TableHead>
          <TableHead className="w-28 px-6 text-center">DATA</TableHead>
          <TableHead className="w-50 px-6 text-center">CATEGORIA</TableHead>
          <TableHead className="w-34 px-6 text-center">TIPO</TableHead>
          <TableHead className="w-50 px-6 text-center">VALOR</TableHead>
          <TableHead className="w-30 px-6 text-center">AÇÕES</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="h-18">
            <TableCell className="px-6 text-base leading-6 font-medium tracking-normal text-gray-800">
              <div className="flex items-center gap-2">
                <ColoredCategoryIcon
                  icon={transaction.category.icon}
                  color={transaction.category.color}
                />
                {transaction.description}
              </div>
            </TableCell>
            <TableCell className="px-6 text-center text-sm leading-5 font-normal tracking-normal text-gray-600">
              {format(new Date(transaction.date), "dd/MM/yy")}
            </TableCell>
            <TableCell className="w-50 px-6 text-center">
              <Tag color={transaction.category.color}>
                {transaction.category.title}
              </Tag>
            </TableCell>
            <TableCell className="w-34 px-6">
              <div className="flex items-center justify-center">
                <TransactionTypeBadge type={transaction.type} />
              </div>
            </TableCell>
            <TableCell className="w-50 px-6 text-center">
              <NumericFormat
                value={transaction.amount}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                prefix={Number(transaction.amount) > 0 ? "+ R$ " : "- R$ "}
                decimalScale={2}
                fixedDecimalScale
                className="text-center text-sm leading-5 font-semibold tracking-normal text-gray-800"
              />
            </TableCell>
            <TableCell className="w-30 px-6">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="custom-icon"
                  size="custom-icon-sm"
                  onClick={() => onDeleteToggle(transaction)}
                >
                  <Trash className="text-destructive" />
                </Button>
                <Button
                  variant="custom-icon"
                  size="custom-icon-sm"
                  onClick={() => onEditToggle(transaction)}
                >
                  <SquarePen />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="rounded-b-2lg bg-white ring ring-gray-200 ring-inset">
        <TableRow className="h-18">
          <TableCell colSpan={6} className="px-6">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm leading-4.5 tracking-normal text-gray-700">
                <b className="semibold">{offset + 1}</b> a{" "}
                <b className="semibold">
                  {Math.min(offset + limit, totalCount)}
                </b>{" "}
                | <b className="semibold">{totalCount}</b> resultados
              </p>
              <Pagination className="flex w-full justify-end">
                <PaginationContent>
                  <PaginationItem aria-disabled={currentPage === 1}>
                    <PaginationPrevious
                      className="cursor-pointer"
                      disabled={currentPage === 1}
                      onClick={() => {
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          className="cursor-pointer"
                          active={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      className="cursor-pointer"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

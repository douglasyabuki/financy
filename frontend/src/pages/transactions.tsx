import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog";
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import { EditTransactionDialog } from "@/components/transactions/edit-transaction-dialog";
import { TransactionsFilters } from "@/components/transactions/transactions-filters";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useToggle } from "@/hooks/use-toggle";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/category";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/transactions";
import type { Category, Transaction } from "@/types";
import { useQuery } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const LIMIT = 10;

export const Transactions = () => {
  const [isCreateToggled, onCreateToggle] = useToggle(false);
  const [limit] = useState(LIMIT);
  const [offset, setOffset] = useState(0);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const [description, setDescription] = useState("");
  const debouncedDescription = useDebounce(description, 500);

  const [type, setType] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [month, setMonth] = useState<string>("");

  useEffect(() => {
    setOffset(0);
  }, [debouncedDescription]);

  const { data: categoriesData } = useQuery<{
    listCategories: Category[];
  }>(LIST_CATEGORIES);

  const categories = categoriesData?.listCategories ?? [];

  const filters = {
    description: debouncedDescription || undefined,
    type: type && type !== "all" ? type : undefined,
    categoryId: categoryId && categoryId !== "all" ? categoryId : undefined,
    month: month ? Number.parseInt(month.split("-")[0]) : undefined,
    year: month ? Number.parseInt(month.split("-")[1]) : undefined,
  };

  const { data, loading, refetch } = useQuery<{
    listTransactions: {
      items: Transaction[];
      totalCount: number;
    };
  }>(LIST_TRANSACTIONS, {
    variables: {
      limit,
      offset,
      filters,
    },
    fetchPolicy: "cache-and-network",
  });

  const transactions = data?.listTransactions.items ?? [];
  const totalCount = data?.listTransactions.totalCount ?? 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  return (
    <div className="flex h-auto w-full flex-1 flex-col gap-8 self-stretch">
      <div className="flex w-full items-center justify-between">
        <span>
          <h1 className="text-2xl leading-8 font-bold tracking-normal text-gray-800">
            Transações
          </h1>
          <p className="text-base leading-6 tracking-normal text-gray-600">
            Gerencie todas as suas transações financeiras
          </p>
        </span>
        <Button
          variant="custom-primary"
          size="custom-sm"
          onClick={() => onCreateToggle(true)}
          disabled={false}
        >
          <Plus />
          Nova transação
        </Button>
      </div>

      <TransactionsFilters
        description={description}
        onDescriptionChange={setDescription}
        type={type}
        onTypeChange={(val) => {
          setType(val);
          setOffset(0);
        }}
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setOffset(0);
        }}
        month={month}
        onMonthChange={(val) => {
          setMonth(val);
          setOffset(0);
        }}
        categories={categories}
      />
      <div className="flex flex-col gap-4">
        <TransactionsTable
          transactions={transactions}
          offset={offset}
          limit={limit}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          loading={loading}
          handlePageChange={handlePageChange}
          onEditToggle={(transaction: Transaction) => {
            setTransactionToEdit(transaction);
          }}
          onDeleteToggle={(transaction: Transaction) => {
            setTransactionToDelete(transaction);
          }}
        />
      </div>
      <CreateTransactionDialog
        isOpen={isCreateToggled}
        onClose={() => onCreateToggle(false)}
        onCreated={() => {
          setOffset(0);
          refetch();
        }}
      />
      <EditTransactionDialog
        transaction={transactionToEdit}
        isOpen={!!transactionToEdit}
        onClose={() => setTransactionToEdit(null)}
        onUpdated={() => {
          setOffset(0);
          refetch();
        }}
      />
      <DeleteTransactionDialog
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onDeleted={() => {
          setOffset(0);
          refetch();
        }}
        transaction={transactionToDelete}
      />
    </div>
  );
};

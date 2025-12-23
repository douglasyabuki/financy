import { CategoriesStats } from "@/components/dashboard/categories-stats";
import { RecentTransactionsTable } from "@/components/dashboard/recent-transactions-table";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import type { CategoryColor, CategoryIcon } from "@/constants/categories";
import { GET_DASHBOARD_DATA } from "@/lib/graphql/queries/dashboard";
import type { Transaction } from "@/types";
import { useQuery } from "@apollo/client/react";

const LIMIT = 6;
const endDate = new Date();
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30);

const filters = {
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString(),
};

export const Dashboard = () => {
  const { data, loading } = useQuery<{
    balanceSummary: {
      balance: number;
      monthIncome: number;
      monthExpense: number;
    };
    categorySummary: {
      category: {
        id: string;
        title: string;
        color: string;
        icon: string;
      };
      count: number;
      totalAmount: number;
    }[];
    listTransactions: {
      items: Transaction[];
      totalCount: number;
    };
  }>(GET_DASHBOARD_DATA, {
    variables: {
      limit: LIMIT,
      offset: 0,
      filters,
    },
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className="flex h-auto w-full flex-1 flex-col gap-8 self-stretch">
      <div className="flex flex-col gap-4">
        <SummaryCards balanceSummary={data?.balanceSummary} loading={loading} />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {data?.listTransactions && (
              <RecentTransactionsTable
                transactions={data.listTransactions.items}
                loading={loading}
              />
            )}
          </div>
          <div className="col-span-1">
            {data?.categorySummary && (
              <CategoriesStats
                categorySummary={data.categorySummary.map((item) => ({
                  ...item,
                  category: {
                    ...item.category,
                    icon: item.category.icon as CategoryIcon,
                    color: item.category.color as CategoryColor,
                  },
                  totalAmount: Number(item.totalAmount),
                }))}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

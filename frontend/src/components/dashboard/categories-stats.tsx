import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { ChevronRight } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { LoadingFrame } from "../frames/loading-frame";
import { NoItemFoundFrame } from "../frames/no-item-found-frame";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Divider } from "../ui/divider";
import { Link } from "../ui/link";
import { Tag } from "../ui/tag";

interface CategoryStat {
  category: Pick<Category, "id" | "title" | "color" | "icon">;
  count: number;
  totalAmount: number;
}

interface CategoriesStats {
  categorySummary: CategoryStat[];
  loading?: boolean;
}

export const CategoriesStats = ({
  categorySummary,
  loading,
}: CategoriesStats) => {
  const sortedCategories = [...categorySummary].sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );
  return (
    <Card className="rounded-2lg gap-0 overflow-hidden bg-white p-0!">
      <CardHeader className="flex h-15.25 items-center justify-between px-6">
        <CardTitle className="text-xs leading-4 font-medium tracking-[0.0375rem] whitespace-nowrap text-gray-500">
          CATEGORIAS
        </CardTitle>
        <Link to="/categories">
          Gerenciar
          <ChevronRight className="size-4" />
        </Link>
      </CardHeader>
      <Divider />
      <CardContent className="flex flex-col gap-5 p-6">
        {loading ? (
          <LoadingFrame
            size="lg"
            text="Carregando categorias"
            spanDots
            className="h-80"
          />
        ) : (
          <>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <div
                  key={category.category.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4"
                >
                  <div className="flex justify-start">
                    <Tag color={category.category.color}>
                      {category.category.title}
                    </Tag>
                  </div>
                  <p className="min-w-16 text-end text-sm leading-5 font-normal tracking-normal text-gray-600">
                    {category.count} {category.count === 1 ? "item" : "itens"}
                  </p>
                  <NumericFormat
                    value={Math.abs(category.totalAmount)}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    className={cn(
                      "min-w-22 text-end text-sm leading-5 font-bold tracking-normal text-gray-800",
                    )}
                    allowNegative={false}
                  />
                </div>
              ))
            ) : (
              <NoItemFoundFrame text="Nenhuma categoria encontrada" />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

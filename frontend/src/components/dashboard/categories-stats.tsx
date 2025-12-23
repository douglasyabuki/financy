import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { ChevronRight } from "lucide-react";
import { NumericFormat } from "react-number-format";
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
}

export const CategoriesStats = ({ categorySummary }: CategoriesStats) => {
  const sortedCategories = [...categorySummary].sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );

  return (
    <Card className="rounded-2lg gap-0 overflow-hidden bg-white p-0!">
      <CardHeader className="flex h-15.25 items-center justify-between px-6">
        <CardTitle className="text-xs leading-4 font-medium tracking-[0.0375rem] whitespace-nowrap text-gray-500">
          TRANSAÇÕES RECENTES
        </CardTitle>
        <Link to="/categories">
          Gerenciar
          <ChevronRight className="size-4" />
        </Link>
      </CardHeader>
      <Divider />
      <CardContent className="flex flex-col gap-5 p-6">
        {sortedCategories.map((category) => (
          <div
            key={category.category.id}
            className="flex h-7 items-center justify-between gap-4"
          >
            <div className="flex w-auto flex-1 justify-start self-stretch">
              <Tag color={category.category.color}>
                {category.category.title}
              </Tag>
            </div>
            <div className="flex items-center justify-end gap-4">
              <p className="text-sm leading-5 font-normal tracking-normal text-gray-600">
                {category.count} {category.count === 1 ? "item" : "itens"}
              </p>
              <NumericFormat
                value={Math.abs(category.totalAmount)}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                prefix={category.totalAmount >= 0 ? "+ R$ " : "- R$ "}
                decimalScale={2}
                fixedDecimalScale
                className={cn(
                  "w-fit min-w-22 text-end text-sm leading-5 font-semibold tracking-normal text-gray-800",
                )}
                allowNegative={false}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

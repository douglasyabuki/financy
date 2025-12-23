import { CategoriesSummaryCard } from "@/components/categories/categories-summary-card";
import { CategoryCard } from "@/components/categories/category-card";
import { ColoredCategoryIcon } from "@/components/categories/colored-category-icon";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { EditCategoryDialog } from "@/components/categories/edit-category-dialog";
import { LoadingFrame } from "@/components/frames/loading-frame";
import { NoItemFoundFrame } from "@/components/frames/no-item-found-frame";
import { Button } from "@/components/ui/button";
import { useToggle } from "@/hooks/use-toggle";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/category";
import type { Category } from "@/types";
import { useQuery } from "@apollo/client/react";
import { ArrowUpDown, Plus, Tag } from "lucide-react";
import { useMemo, useState } from "react";

export const Categories = () => {
  const [isCreateToggled, onCreateToggle] = useToggle(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const { data, loading, refetch } = useQuery<{ listCategories: Category[] }>(
    LIST_CATEGORIES,
  );

  const categories = data?.listCategories || [];
  const categoriesCount = categories.length;

  const transactionsCount = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + category.transactionCount,
        0,
      ),
    [categories],
  );

  const mostUsedCategory = useMemo(
    () =>
      categories.reduce(
        (mostUsed, category) =>
          category.transactionCount > mostUsed.transactionCount
            ? category
            : mostUsed,
        categories[0],
      ),
    [categories],
  );

  return (
    <div className="flex h-auto w-full flex-1 flex-col gap-8 self-stretch">
      <div className="flex w-full items-center justify-between">
        <span>
          <h1 className="text-2xl leading-8 font-bold tracking-normal text-gray-800">
            Categorias
          </h1>
          <p className="text-base leading-6 tracking-normal text-gray-600">
            Organize suas transações por categoria
          </p>
        </span>
        <Button
          variant="custom-primary"
          size="custom-sm"
          onClick={() => onCreateToggle(true)}
          disabled={loading}
        >
          <Plus />
          Nova categoria
        </Button>
      </div>
      {loading ? (
        <LoadingFrame text="Carregando categorias" spanDots />
      ) : categories.length > 0 ? (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <CategoriesSummaryCard
              icon={<Tag className="size-8 text-gray-700" />}
              title={categoriesCount}
              description="TOTAL DE CATEGORIAS"
            />
            <CategoriesSummaryCard
              icon={<ArrowUpDown className="text-purple-base size-8" />}
              title={transactionsCount}
              description="TOTAL DE TRANSAÇÕES"
            />
            <CategoriesSummaryCard
              icon={
                mostUsedCategory ? (
                  <ColoredCategoryIcon
                    icon={mostUsedCategory.icon}
                    color={mostUsedCategory.color}
                    className="size-8"
                    variant="icon"
                  />
                ) : (
                  <div className="size-8" />
                )
              }
              title={mostUsedCategory?.title ?? "-"}
              description="CATEGORIA MAIS USADA"
            />
          </div>
          <div className="flex flex-wrap justify-around gap-6 xl:grid xl:grid-cols-4 xl:gap-0 xl:space-y-4 xl:space-x-4">
            {categories.map((category) => {
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEditToggle={() => setCategoryToEdit(category)}
                  onDeleteToggle={() => setCategoryToDelete(category)}
                />
              );
            })}
          </div>
        </>
      ) : (
        <NoItemFoundFrame text="Nenhuma categoria cadastrada" />
      )}
      <CreateCategoryDialog
        isOpen={isCreateToggled}
        onClose={() => onCreateToggle(false)}
        onCreated={() => refetch()}
      />
      <EditCategoryDialog
        isOpen={!!categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        category={categoryToEdit}
        onUpdated={() => refetch()}
      />
      <DeleteCategoryDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        category={categoryToDelete}
        onDeleted={() => refetch()}
      />
    </div>
  );
};

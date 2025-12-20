import { ColoredCategoryIcon } from "@/components/categories/colored-category-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/category";
import type { Category } from "@/types";
import { useQuery } from "@apollo/client/react";

interface CategoryPicker {
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryPicker = ({
  categoryId,
  onCategoryChange,
}: CategoryPicker) => {
  const { data, loading } = useQuery<{ listCategories: Category[] }>(
    LIST_CATEGORIES,
  );

  const categories = data?.listCategories || [];

  return (
    <Select value={categoryId} onValueChange={onCategoryChange}>
      <SelectTrigger className="h-12! w-full">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent className="px-3 py-3.5">
        {loading ? (
          <div className="p-2 text-sm text-gray-500">Carregando...</div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <SelectItem key={category.id} value={category.id} className="h-10">
              <div className="flex items-center gap-2">
                <ColoredCategoryIcon
                  icon={category.icon}
                  color={category.color}
                  className="size-5"
                />
                <span className="text-base leading-4.5 tracking-normal text-gray-800">
                  {category.title}
                </span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">
            Nenhuma categoria encontrada
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

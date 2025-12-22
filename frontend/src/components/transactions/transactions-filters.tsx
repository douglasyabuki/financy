import type { Category } from "@/types";
import { Search } from "lucide-react";
import { Card } from "../ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import { CategoryPicker } from "./category-picker";
import { PeriodPicker } from "./period-picker";
import { TypePicker } from "./type-picker";

interface TransactionsFilters {
  description: string;
  onDescriptionChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
  categories: Category[];
}

export const TransactionsFilters = ({
  description,
  onDescriptionChange,
  type,
  onTypeChange,
  categoryId,
  onCategoryChange,
  month,
  onMonthChange,
  categories,
}: TransactionsFilters) => {
  return (
    <Card className="grid grid-cols-4 gap-4 rounded-lg border border-gray-200 bg-white px-6 pt-5 pb-6 shadow-none">
      <div className="group/search-for-description flex flex-col gap-2">
        <Label
          htmlFor="search-for-description"
          className="group-has-active/search-for-description:text-primary group-has-focus/search-for-description:text-primary"
        >
          Buscar
        </Label>
        <InputGroup className="h-12">
          <InputGroupInput
            className="text-base leading-4.5 tracking-normal text-gray-800 placeholder:text-base placeholder:leading-4.5 placeholder:tracking-normal placeholder:text-gray-400"
            id="search-for-description"
            placeholder="Buscar por descrição"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="group-has-active/search-for-description:text-primary group-has-focus/search-for-description:text-primary" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="group/search-for-type flex flex-col gap-2">
        <Label
          htmlFor="search-for-type"
          className="group-has-active/search-for-type:text-primary group-has-focus/search-for-type:text-primary"
        >
          Tipo
        </Label>
        <TypePicker value={type} onValueChange={onTypeChange} showAll />
      </div>

      <div className="group/search-for-category flex flex-col gap-2">
        <Label
          htmlFor="search-for-category"
          className="group-has-active/search-for-category:text-primary group-has-focus/search-for-category:text-primary"
        >
          Categoria
        </Label>
        <CategoryPicker
          categoryId={categoryId}
          onCategoryChange={onCategoryChange}
          categories={categories}
          placeholder="Selecione a categoria"
          showAll
        />
      </div>

      <div className="group/search-for-period flex flex-col gap-2">
        <Label
          htmlFor="search-for-period"
          className="group-has-active/search-for-period:text-primary group-has-focus/search-for-period:text-primary"
        >
          Período
        </Label>
        <PeriodPicker value={month} onValueChange={onMonthChange} />
      </div>
    </Card>
  );
};

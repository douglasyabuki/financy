import type { Category } from "@/types";
import { SquarePen, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Tag } from "../ui/tag";
import { ColoredCategoryIcon } from "./colored-category-icon";

export const CategoryCard = ({
  category,
  onEditToggle,
  onDeleteToggle,
}: {
  category: Category;
  onEditToggle: () => void;
  onDeleteToggle: () => void;
}) => {
  return (
    <Card className="h-56.5 w-71 p-6">
      <CardHeader className="flex items-start justify-between">
        <ColoredCategoryIcon icon={category.icon} color={category.color} />
        <CardAction className="flex gap-2">
          <Button
            variant="custom-icon"
            size="custom-icon-sm"
            onClick={onDeleteToggle}
          >
            <Trash className="text-destructive" />
          </Button>
          <Button
            variant="custom-icon"
            size="custom-icon-sm"
            onClick={onEditToggle}
          >
            <SquarePen />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 gap-1 self-stretch">
        <h3 className="text-base leading-6 font-semibold tracking-normal text-gray-800">
          {category.title}
        </h3>
        <p className="text-sm leading-5 font-normal tracking-normal text-gray-600">
          {category.description}
        </p>
      </CardContent>
      <CardFooter className="items-center justify-between p-0">
        <Tag color={category.color}>{category.title}</Tag>
        <p className="text-sm leading-5 font-normal tracking-normal text-gray-600">
          {category.transactionCount}{" "}
          {category.transactionCount === 1 ? "item" : "itens"}
        </p>
      </CardFooter>
    </Card>
  );
};

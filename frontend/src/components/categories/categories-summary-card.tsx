import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface CategoriesSummaryCard {
  icon: ReactNode;
  title: string | number;
  description: string;
  className?: string;
}

export const CategoriesSummaryCard = ({
  icon,
  title,
  description,
  className,
}: CategoriesSummaryCard) => {
  return (
    <Card className={cn("h-26.5 min-w-[23.6625rem] flex-1 p-6", className)}>
      <CardHeader className="flex gap-4">
        {icon}
        <div className="flex flex-col gap-2">
          <CardTitle className="text-[1.75rem] leading-7 font-bold tracking-normal text-gray-800">
            {title}
          </CardTitle>
          <CardDescription className="text-xs font-medium tracking-[0.0375rem] text-gray-500">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

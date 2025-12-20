"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

interface DatePicker {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const DatePicker = ({ date, onDateChange }: DatePicker) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          size="custom-md"
          className={cn(
            "min-w-[191px] justify-between font-normal text-gray-400",
            date && "text-gray-800",
          )}
          type="button"
        >
          {date ? date.toLocaleDateString("pt-BR") : "Selecione"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            onDateChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

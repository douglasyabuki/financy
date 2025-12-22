import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/transaction";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionType } from "@/types";
import { useMutation } from "@apollo/client/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CurrencyInput } from "../ui/currency-input";
import { DatePicker } from "../ui/date-picker";
import { InputGroup, InputGroupInput, InputGroupText } from "../ui/input-group";
import { CategoryPicker } from "./category-picker";
import { TransactionTypePicker } from "./transaction-type-picker";

interface EditTransactionDialog {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const EditTransactionDialog = ({
  transaction,
  isOpen,
  onClose,
  onUpdated,
}: EditTransactionDialog) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    description: string;
    amount: number;
    type: TransactionType;
    date: Date;
    categoryId: string;
  }>({
    defaultValues: {
      description: "",
      amount: 0,
      type: "EXPENSE",
      date: undefined,
      categoryId: "",
    },
  });

  useEffect(() => {
    if (transaction && isOpen) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        type: (transaction.type as string).toUpperCase() as TransactionType,
        date: new Date(transaction.date),
        categoryId: transaction.categoryId || transaction.category.id,
      });
    }
  }, [transaction, isOpen, reset]);

  const [updateTransaction, { loading }] = useMutation(UPDATE_TRANSACTION, {
    onCompleted() {
      toast.success("Transação atualizada com sucesso");
      onClose();
      onUpdated?.();
    },
    onError(err) {
      console.log(err);
      toast.error("Falha ao atualizar transação");
    },
  });

  const onSubmit = (data: {
    description: string;
    amount: number;
    type: TransactionType;
    date: Date;
    categoryId: string;
  }) => {
    if (!transaction) return;

    updateTransaction({
      variables: {
        id: transaction.id,
        data: {
          description: data.description,
          amount: String(data.amount),
          type: data.type,
          date: data.date,
          categoryId: data.categoryId,
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-md gap-6" showCloseButton={false}>
        <DialogHeader className="relative gap-0.5">
          <DialogTitle className="text-lg leading-6 font-semibold tracking-normal text-gray-800">
            Editar transação
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal tracking-normal text-gray-600">
            Atualize os detalhes da transação
          </DialogDescription>
          <DialogClose asChild className="absolute right-0">
            <Button variant="custom-icon" size="custom-icon-sm" type="button">
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Controller
              control={control}
              name="type"
              rules={{ required: "Tipo é obrigatório" }}
              render={({ field }) => (
                <TransactionTypePicker
                  transactionType={field.value}
                  onTransactionTypeChange={(nextType: TransactionType) =>
                    field.onChange(nextType)
                  }
                />
              )}
            />
            {errors.type && (
              <InputGroupText>{errors.type.message as string}</InputGroupText>
            )}
          </div>
          <div className="space-y-4">
            <div className="group/description space-y-2">
              <Label
                htmlFor="description"
                className={cn(
                  "group-has-[[data-slot][aria-invalid=true]]/description:text-destructive",
                  "group-has-active/description:text-primary group-has-focus/description:text-primary",
                )}
              >
                Descrição
              </Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  className="text-base leading-4.5 tracking-normal text-gray-800 placeholder:text-base placeholder:leading-4.5 placeholder:tracking-normal placeholder:text-gray-400"
                  id="description"
                  type="description"
                  placeholder="Ex: Almoço no restaurante"
                  autoComplete="description"
                  aria-invalid={!!errors.description}
                  required
                  {...register("description")}
                />
              </InputGroup>
              {errors.description && (
                <InputGroupText>
                  {errors.description.message as string}
                </InputGroupText>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="group/date space-y-2">
                <Label
                  htmlFor="date"
                  className={cn(
                    "group-has-[[data-slot][aria-invalid=true]]/date:text-destructive",
                    "group-has-active/date:text-primary group-has-focus/date:text-primary",
                  )}
                >
                  Data
                </Label>
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: "Data é obrigatória" }}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                    />
                  )}
                />
                {errors.date && (
                  <InputGroupText>
                    {errors.date.message as string}
                  </InputGroupText>
                )}
              </div>
              <div className="group/amount space-y-2">
                <Label
                  htmlFor="amount"
                  className={cn(
                    "group-has-[[data-slot][aria-invalid=true]]/amount:text-destructive",
                    "group-has-active/amount:text-primary group-has-focus/amount:text-primary",
                  )}
                >
                  Valor
                </Label>
                <Controller
                  control={control}
                  name="amount"
                  rules={{ required: "Valor é obrigatório" }}
                  render={({ field }) => (
                    <CurrencyInput
                      id="amount"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.amount && (
                  <InputGroupText>
                    {errors.amount.message as string}
                  </InputGroupText>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              className={cn(errors.categoryId && "text-destructive")}
              aria-invalid={!!errors.categoryId}
            >
              Categoria
            </Label>
            <Controller
              control={control}
              name="categoryId"
              rules={{ required: "Categoria é obrigatória" }}
              render={({ field }) => (
                <CategoryPicker
                  categoryId={field.value}
                  onCategoryChange={field.onChange}
                />
              )}
            />
            {errors.categoryId && (
              <InputGroupText>
                {errors.categoryId.message as string}
              </InputGroupText>
            )}
          </div>
          <Button
            className="w-full"
            disabled={loading}
            variant="custom-primary"
            size="custom-md"
            type="submit"
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

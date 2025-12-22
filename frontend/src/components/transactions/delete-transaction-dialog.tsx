import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/transaction";
import type { Transaction } from "@/types";
import { useMutation } from "@apollo/client/react";
import { ColoredCategoryIcon } from "../categories/colored-category-icon";

interface DeleteTransactionDialog {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onDeleted?: () => void;
}

export const DeleteTransactionDialog = ({
  isOpen,
  onClose,
  onDeleted,
  transaction,
}: DeleteTransactionDialog) => {
  type DeleteCategoryMutationData = { deleteCategory: boolean };
  type DeleteCategoryVariables = { id: string };

  const [deleteCategoryMutation, { loading }] = useMutation<
    DeleteCategoryMutationData,
    DeleteCategoryVariables
  >(DELETE_TRANSACTION, {
    onCompleted: () => {
      onDeleted?.();
      onClose();
    },
  });

  const handleDelete = async () => {
    if (!transaction) return;
    await deleteCategoryMutation({
      variables: {
        id: transaction.id,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle className="text-lg leading-6 font-semibold tracking-normal text-gray-800">
            Deletar transação
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal tracking-normal text-gray-600">
            Tem certeza que deseja deletar a transação?
          </DialogDescription>
        </DialogHeader>
        {transaction && (
          <div className="space-y-2">
            <p className="text-sm font-medium tracking-normal">Transação:</p>
            <div className="flex items-center gap-2 text-base leading-6 text-gray-800">
              <ColoredCategoryIcon
                icon={transaction.category.icon}
                color={transaction.category.color}
              />
              <span>{transaction.description}</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="custom-sm">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            size="custom-sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

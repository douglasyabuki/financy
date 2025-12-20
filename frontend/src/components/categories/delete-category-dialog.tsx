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
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/category";
import type { Category } from "@/types";
import { useMutation } from "@apollo/client/react";
import { Tag } from "../ui/tag";

interface DeleteCategoryDialog {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onDeleted?: () => void;
}

export const DeleteCategoryDialog = ({
  isOpen,
  onClose,
  category,
  onDeleted,
}: DeleteCategoryDialog) => {
  type DeleteCategoryMutationData = { deleteCategory: boolean };
  type DeleteCategoryVariables = { id: string };

  const [deleteCategoryMutation, { loading }] = useMutation<
    DeleteCategoryMutationData,
    DeleteCategoryVariables
  >(DELETE_CATEGORY, {
    onCompleted: () => {
      onDeleted?.();
      onClose();
    },
  });

  const handleDelete = async () => {
    if (!category) return;
    await deleteCategoryMutation({
      variables: {
        id: category.id,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle className="text-lg leading-6 font-semibold tracking-normal text-gray-800">
            Deletar categoria
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal tracking-normal text-gray-600">
            Tem certeza que deseja deletar a categoria?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm font-medium">Categoria:</p>
          <Tag color={category?.color}>{category?.title}</Tag>
        </div>
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

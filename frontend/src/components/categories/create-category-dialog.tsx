import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { type CategoryColor, type CategoryIcon } from "@/constants/categories";
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/category";
import { cn } from "@/lib/utils";
import { useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { InputGroup, InputGroupInput, InputGroupText } from "../ui/input-group";
import { ColorPicker } from "./color-picker";
import { IconPicker } from "./icon-picker";

interface CreateCategoryDialog {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateCategoryDialog = ({
  isOpen,
  onClose,
  onCreated,
}: CreateCategoryDialog) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    title: string;
    description: string;
    icon: CategoryIcon;
    color: CategoryColor;
  }>({
    defaultValues: {
      title: "",
      description: "",
      icon: "BRIEFCASE_BUSINESS",
      color: "GREEN",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    onCompleted() {
      toast.success("Categoria criada com sucesso");
      onClose();
      onCreated?.();
    },
    onError(err) {
      console.log(err);
      toast.error("Falha ao criar categoria");
    },
  });

  const onSubmit = (data: {
    title: string;
    description: string;
    icon: CategoryIcon;
    color: CategoryColor;
  }) => {
    createCategory({
      variables: {
        data: {
          title: data.title,
          description: data.description,
          icon: data.icon,
          color: data.color,
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-md gap-6">
        <DialogHeader className="gap-0.5">
          <DialogTitle className="text-lg leading-6 font-semibold tracking-normal text-gray-800">
            Nova categoria
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal tracking-normal text-gray-600">
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="group/title space-y-2">
            <Label
              htmlFor="title"
              className={cn(
                "group-has-[[data-slot][aria-invalid=true]]/title:text-destructive",
                "group-has-active/title:text-primary group-has-focus/title:text-primary",
              )}
            >
              Título
            </Label>
            <InputGroup className="h-12">
              <InputGroupInput
                className="text-base leading-4.5 tracking-normal text-gray-800 placeholder:text-base placeholder:leading-4.5 placeholder:tracking-normal placeholder:text-gray-400"
                id="title"
                placeholder="Ex: Alimentação"
                aria-invalid={!!errors.title}
                {...register("title", {
                  required: "Título é obrigatório",
                  minLength: {
                    value: 3,
                    message: "Título deve ter no mínimo 3 caracteres",
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Título não pode ser vazio",
                })}
              />
            </InputGroup>
            {errors.title && (
              <InputGroupText>{errors.title.message as string}</InputGroupText>
            )}
          </div>
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
                placeholder="Descrição da categoria"
                autoComplete="description"
                {...register("description", {
                  required: "Descrição é obrigatória",
                  minLength: {
                    value: 3,
                    message: "Descrição deve ter no mínimo 3 caracteres",
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Descrição não pode ser vazio",
                })}
              />
            </InputGroup>
            <InputGroupText>Opcional</InputGroupText>
          </div>
          <div className="space-y-2">
            <Label
              className={cn(errors.icon && "text-destructive")}
              aria-invalid={!!errors.icon}
            >
              Ícone
            </Label>

            <Controller
              control={control}
              name="icon"
              rules={{ required: "Ícone é obrigatório" }}
              render={({ field }) => (
                <IconPicker
                  icon={field.value}
                  onIconChange={(nextIcon: string) => field.onChange(nextIcon)}
                />
              )}
            />
            {errors.icon && (
              <InputGroupText>{errors.icon.message as string}</InputGroupText>
            )}
          </div>
          <div className="space-y-2">
            <Label
              className={cn(errors.icon && "text-destructive")}
              aria-invalid={!!errors.icon}
            >
              Cor
            </Label>
            <Controller
              control={control}
              name="color"
              rules={{ required: "Cor é obrigatória" }}
              render={({ field }) => (
                <ColorPicker
                  color={field.value}
                  onColorChange={(nextColor: CategoryColor) =>
                    field.onChange(nextColor)
                  }
                />
              )}
            />
            {errors.color && (
              <InputGroupText>{errors.color.message as string}</InputGroupText>
            )}
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={loading}
            variant="custom-primary"
            size="custom-md"
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

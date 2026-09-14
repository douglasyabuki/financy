import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/user/avatar-upload";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { LogOut, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { user, updateProfile, logout } = useAuthStore((state) => state);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
    },
  });

  const handleRemoveAvatar = () => {
    setIsAvatarRemoved(true);
    setAvatarFile(null);
  };

  const handleFileSelect = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      setIsAvatarRemoved(false);
    }
  };

  const onSubmit = async (data: { name: string }) => {
    setLoading(true);

    try {
      const updateProfileMutate = await updateProfile({
        name: data.name,
        avatar: avatarFile || undefined,
        removeAvatar: isAvatarRemoved,
      });
      if (updateProfileMutate) {
        toast.success("Perfil atualizado com sucesso!");
        setAvatarFile(null); // Reset file selection after success
        setIsAvatarRemoved(false);
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex w-full max-w-md flex-col gap-8 rounded-xl p-8">
      <CardHeader className="flex flex-col items-center gap-6 text-center">
        <AvatarUpload
          name={user?.name || ""}
          currentAvatarUrl={user?.avatarUrl}
          onFileSelect={handleFileSelect}
          onAvatarRemove={handleRemoveAvatar}
          isLoading={loading}
        />
        <span>
          <h2 className="text-xl leading-7 font-semibold tracking-normal text-gray-800">
            {user?.name}
          </h2>
          <p className="text-base leading-6 font-normal tracking-normal text-gray-500">
            {user?.email}
          </p>
        </span>
      </CardHeader>
      <Divider direction="horizontal" />
      <CardContent className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="group/name space-y-2">
            <Label
              htmlFor="name"
              className={cn(
                "group-has-[[data-slot][aria-invalid=true]]/name:text-destructive",
                "group-has-active/name:text-primary group-has-focus/name:text-primary",
              )}
            >
              Nome completo
            </Label>
            <InputGroup className="h-12">
              <InputGroupInput
                className="text-base leading-4.5 tracking-normal text-gray-800 placeholder:text-base placeholder:leading-4.5 placeholder:tracking-normal placeholder:text-gray-400"
                id="name"
                placeholder="Seu nome completo"
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 3,
                    message: "Nome deve ter no mínimo 3 caracteres",
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Nome não pode ser vazio",
                })}
              />
              <InputGroupAddon>
                <UserRound
                  className={cn(
                    "group-has-[[data-slot][aria-invalid=true]]/name:text-destructive",
                    "group-has-active/name:text-primary group-has-focus/name:text-primary",
                  )}
                />
              </InputGroupAddon>
            </InputGroup>
            {errors.name && (
              <InputGroupText>{errors.name.message as string}</InputGroupText>
            )}
          </div>
          <div className="group/email space-y-2">
            <Label
              htmlFor="email"
              className={cn(
                "group-has-[[data-slot][aria-invalid=true]]/email:text-destructive",
                "group-has-active/email:text-primary group-has-focus/email:text-primary",
              )}
            >
              E-mail
            </Label>
            <InputGroup className="h-12">
              <InputGroupInput
                className="text-base leading-4.5 tracking-normal text-gray-800 placeholder:text-base placeholder:leading-4.5 placeholder:tracking-normal placeholder:text-gray-400"
                id="email"
                type="email"
                placeholder="mail@exemplo.com"
                autoComplete="email"
                value={user?.email}
                disabled
              />
              <InputGroupAddon>
                <Mail
                  className={cn(
                    "group-has-[[data-slot][aria-invalid=true]]/email:text-destructive",
                    "group-has-active/email:text-primary group-has-focus/email:text-primary",
                  )}
                />
              </InputGroupAddon>
            </InputGroup>
            <InputGroupText>O e-mail não pode ser alterado</InputGroupText>
          </div>
          <Button
            variant="custom-primary"
            size="custom-md"
            type="submit"
            className="mt-2 w-full"
            disabled={loading}
          >
            Salvar alterações
          </Button>
          <Button
            variant="custom-secondary"
            size="custom-md"
            className="w-full"
            onClick={logout}
          >
            <LogOut className="text-destructive" />
            Sair da conta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

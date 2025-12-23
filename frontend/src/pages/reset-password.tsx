import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RESET_PASSWORD } from "@/lib/graphql/mutations/reset-password";
import { cn } from "@/lib/utils";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeClosed, KeyRound, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailFromState || "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const { data: result } = await resetPassword({
        variables: {
          data: {
            email: data.email,
            code: data.code,
            password: data.password,
            confirmPassword: data.confirmPassword,
          },
        },
      });

      if (result) {
        toast.success("Senha redefinida com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        "Erro ao redefinir senha. Verifique o código e tente novamente.",
      );
    }
  };

  return (
    <div className="flex w-md flex-col items-center gap-8">
      <img src={logo} className="h-8 w-41" />
      <Card className="flex w-full max-w-md flex-col gap-6 rounded-xl p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground text-xl leading-7 font-bold tracking-normal">
            Redefinir senha
          </CardTitle>
          <CardDescription className="text-base leading-6 font-normal text-gray-600">
            Digite o código recebido no email e sua nova senha
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!emailFromState && (
              <div className="group/email space-y-2">
                <Label htmlFor="email">Email</Label>
                <InputGroup className="h-12">
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="mail@exemplo.com"
                    {...register("email", { required: "Email é obrigatório" })}
                  />
                  <InputGroupAddon>
                    <Mail />
                  </InputGroupAddon>
                </InputGroup>
                {errors.email && (
                  <InputGroupText>
                    {errors.email.message as string}
                  </InputGroupText>
                )}
              </div>
            )}

            <div className="group/code space-y-2">
              <Label
                htmlFor="code"
                className={cn(
                  "group-has-[[data-slot][aria-invalid=true]]/code:text-destructive",
                  "group-has-active/code:text-primary group-has-focus/code:text-primary",
                )}
              >
                Código de verificação
              </Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  id="code"
                  type="text"
                  placeholder="Código de 6 dígitos"
                  maxLength={6}
                  aria-invalid={!!errors.code}
                  {...register("code", {
                    required: "Código é obrigatório",
                    minLength: {
                      value: 6,
                      message: "Mínimo de 6 dígitos",
                    },
                  })}
                />
                <InputGroupAddon>
                  <KeyRound />
                </InputGroupAddon>
              </InputGroup>
              {errors.code && (
                <InputGroupText>{errors.code.message as string}</InputGroupText>
              )}
            </div>

            <div className="group/password space-y-2">
              <Label
                htmlFor="password"
                className={cn(
                  "group-has-[[data-slot][aria-invalid=true]]/password:text-destructive",
                  "group-has-active/password:text-primary group-has-focus/password:text-primary",
                )}
              >
                Nova senha
              </Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nova senha"
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 8,
                      message: "Mínimo de 8 caracteres",
                    },
                  })}
                />
                <InputGroupAddon>
                  <Lock
                    className={cn(
                      "group-has-[[data-slot][aria-invalid=true]]/password:text-destructive",
                      "group-has-active/password:text-primary group-has-focus/password:text-primary",
                    )}
                  />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <InputGroupText>
                  {errors.password.message as string}
                </InputGroupText>
              )}
            </div>

            <div className="group/confirm-password space-y-2">
              <Label
                htmlFor="confirmPassword"
                className={cn(
                  "group-has-[[data-slot][aria-invalid=true]]/confirm-password:text-destructive",
                  "group-has-active/confirm-password:text-primary group-has-focus/confirm-password:text-primary",
                )}
              >
                Confirmar senha
              </Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "Confirmação de senha é obrigatória",
                    validate: (value, formValues) =>
                      value === formValues.password ||
                      "As senhas não coincidem",
                  })}
                />
                <InputGroupAddon>
                  <Lock
                    className={cn(
                      "group-has-[[data-slot][aria-invalid=true]]/confirm-password:text-destructive",
                      "group-has-active/confirm-password:text-primary group-has-focus/confirm-password:text-primary",
                    )}
                  />
                </InputGroupAddon>
              </InputGroup>
              {errors.confirmPassword && (
                <InputGroupText>
                  {errors.confirmPassword.message as string}
                </InputGroupText>
              )}
            </div>

            <Button
              type="submit"
              variant="custom-primary"
              size="custom-md"
              className="mt-2 w-full"
              disabled={loading}
            >
              Redefinir Senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

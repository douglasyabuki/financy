import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { Eye, EyeClosed, Lock, LogIn, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const signup = useAuthStore((state) => state.signup);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      const signupMutate = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (signupMutate) {
        toast.success("Cadastrado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao fazer cadastro!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-md flex-col items-center gap-8">
      <img src={logo} className="h-8 w-41" />
      <Card className="flex w-full max-w-md flex-col gap-8 rounded-xl p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground text-xl leading-7 font-bold tracking-normal">
            Criar conta
          </CardTitle>
          <CardDescription className="text-base leading-6 font-normal text-gray-600">
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
        </CardHeader>
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
                Email
              </Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  className="text-base leading-4.5 tracking-normal text-gray-800 placeholder:text-base placeholder:leading-4.5 placeholder:tracking-normal placeholder:text-gray-400"
                  id="email"
                  type="email"
                  placeholder="mail@exemplo.com"
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Endereço de email inválido",
                    },
                  })}
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
              {errors.email && (
                <InputGroupText>
                  {errors.email.message as string}
                </InputGroupText>
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
                Senha
              </Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  className="text-base leading-4.5 tracking-normal text-gray-800 placeholder:text-base placeholder:leading-4.5 placeholder:tracking-normal placeholder:text-gray-400"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 8,
                      message: "A senha deve ter no mínimo 8 caracteres",
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
            <Button
              type="submit"
              variant="custom-primary"
              size="custom-md"
              className="mt-2 w-full"
              disabled={loading}
            >
              Cadastrar
            </Button>
          </form>
          <span className="flex items-center">
            <Divider variant="darker" />
            <p className="tracking-0 px-3 text-sm leading-5 font-normal text-gray-500">
              ou
            </p>
            <Divider variant="darker" />
          </span>
          <div className="flex flex-col gap-4">
            <p className="tracking-0 text-center text-sm leading-5 font-normal text-gray-600">
              Já tem uma conta?
            </p>
            <Link to="/login">
              <Button
                variant="custom-secondary"
                size="custom-md"
                className="w-full"
              >
                <LogIn />
                Fazer login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

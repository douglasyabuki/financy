import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Eye, EyeClosed, Lock, Mail, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";
import { toast } from "sonner";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }
  }, [email, rememberMe]);

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);

    try {
      const loginMutate = await login({
        email: data.email,
        password: data.password,
      });
      if (loginMutate) {
        toast.success("Logado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao fazer login!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-md flex-col items-center gap-8">
      <img src={logo} className="h-8 w-41" />
      <Card className="flex w-full max-w-md flex-col gap-6 rounded-xl p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground text-xl leading-7 font-bold tracking-normal">
            Fazer login
          </CardTitle>
          <CardDescription className="text-base leading-6 font-normal text-gray-600">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label htmlFor="terms" className="font-normal">
                  Lembrar-me
                </Label>
              </div>
              <NavLink
                to="/forgot-password"
                className="text-primary hover:border-primary border-b border-transparent text-sm leading-5 font-medium tracking-normal duration-150"
              >
                Recuperar senha
              </NavLink>
            </div>
            <Button
              type="submit"
              variant="custom-primary"
              size="custom-md"
              className="mt-2 w-full"
              disabled={loading}
            >
              Entrar
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
              Ainda não tem uma conta?
            </p>
            <Link to="/register">
              <Button
                variant="custom-secondary"
                size="custom-md"
                className="w-full"
              >
                <UserPlus />
                Criar conta
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

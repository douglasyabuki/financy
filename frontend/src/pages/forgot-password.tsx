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
import { FORGOT_PASSWORD } from "@/lib/graphql/mutations/forgot-password";
import { cn } from "@/lib/utils";
import { useMutation } from "@apollo/client/react";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted() {
      toast.success("Código de recuperação enviado para seu email!");
    },
    onError() {
      toast.error("Falha ao enviar código. Tente novamente.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      const { data: result } = await forgotPassword({
        variables: {
          data: {
            email: data.email,
          },
        },
      });

      if (result) {
        toast.success("Código de recuperação enviado para seu email!");
        navigate("/reset-password", { state: { email: data.email } });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="flex w-md flex-col items-center gap-8">
      <img src={logo} className="h-8 w-41" />
      <Card className="flex w-full max-w-md flex-col gap-6 rounded-xl p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-foreground text-xl leading-7 font-bold tracking-normal">
            Recuperar senha
          </CardTitle>
          <CardDescription className="text-base leading-6 font-normal text-gray-600">
            Digite seu email para receber um código de recuperação
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

            <Button
              type="submit"
              variant="custom-primary"
              size="custom-md"
              className="mt-2 w-full"
              disabled={loading}
            >
              Enviar código
            </Button>
          </form>
          <Link to="/login">
            <Button
              variant="link"
              size="custom-md"
              className="w-full text-gray-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

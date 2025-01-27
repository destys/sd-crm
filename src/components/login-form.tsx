import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginRequest } from "@/api/auth"
import { useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

const formSchema = z.object({
  username: z
    .string()
    .email({ message: "Invalid email address." })
    .min(2, { message: "Email must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." })
})

export const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log(values);

      const response = await loginRequest(values.username, values.password);

      localStorage.setItem("token", response.jwt);
      localStorage.setItem("user", JSON.stringify(response.user));

      console.log("Login successful:", response);
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Неверный логин или пароль");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Вход в аккаунт</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="info@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <Alert variant="destructive" className="gap-4">
            <AlertCircle className="size-4" />
            <AlertTitle>Ошибка входа</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </form>
    </Form>
  )
}

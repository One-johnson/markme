"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/validations/validationSchema"; // Import the schema
import { z } from "zod"; // Import z namespace from zod
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/stores/authStore";
import { Loader2 } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setServerError("");

    try {
      const res = await login({
        email: values.email,
        password: values.password,
      });

      if (!res) {
        throw new Error("Login failed");
      }

      toast.success("Login successful! Redirecting...");

      // Delay the redirect by 2 seconds
      setTimeout(() => {
        router.push("/pages/admin-dashboard");
      }, 4000);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Login failed";
      console.error("Login failed:", errMsg);
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}

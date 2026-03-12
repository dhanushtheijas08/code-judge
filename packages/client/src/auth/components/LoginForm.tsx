import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginSchema } from "@code-judge/shared/authSchema";

export const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginSchema) {
    console.log(data);
  }

  return (
    <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
              <Input
                {...field}
                id="login-form-email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-password">Password</FieldLabel>
              <Input
                {...field}
                id="login-form-password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Field className="mt-5.5 w-full">
        <Button type="submit" form="login-form" className="h-8.5">
          Login
        </Button>
      </Field>
    </form>
  );
};

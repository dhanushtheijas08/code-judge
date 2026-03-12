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
import {
  registerSchema,
  type RegisterSchema,
} from "@code-judge/shared/authSchema";

export const RegisterForm = () => {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data: RegisterSchema) {
    console.log(data);
  }

  return (
    <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-form-username">Username</FieldLabel>
              <Input
                {...field}
                id="register-form-username"
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="johndoe"
                autoComplete="username"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-form-email">Email</FieldLabel>
              <Input
                {...field}
                id="register-form-email"
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
              <FieldLabel htmlFor="register-form-password">Password</FieldLabel>
              <Input
                {...field}
                id="register-form-password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Field className="mt-5.5 w-full">
        <Button type="submit" form="register-form" className="h-8.5">
          Register
        </Button>
      </Field>
    </form>
  );
};

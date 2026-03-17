import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi } from "./authApi";
import type {
  LoginSchema,
  RegisterSchema,
} from "@code-judge/shared/authSchema";
import { toast } from "sonner";

export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: (data: LoginSchema) => loginApi(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterSchema) => registerApi(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { loginMutation, registerMutation };
};

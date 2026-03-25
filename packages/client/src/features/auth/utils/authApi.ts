import { LOGIN_API_URL, REGISTER_API_URL } from "@/utils/conts";
import type {
  LoginSchema,
  RegisterSchema,
} from "@code-judge/shared/authSchema";

export const loginApi = async ({ email, password }: LoginSchema) => {
  try {
    const res = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Login failed");
    }
    return data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

export const registerApi = async ({
  username,
  email,
  password,
}: RegisterSchema) => {
  try {
    const res = await fetch(REGISTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  } catch (error) {
    console.error("Register API error:", error);
    throw error;
  }
};

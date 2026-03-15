import { CustomError } from "@/utils/CustomError";
import { password } from "bun";
import {
  findUserByEmail as findUserByEmailQuery,
  findUserById as findUserByIdQuery,
  insertUser,
} from "@/queries/user.query";

type CreateUserData = {
  email: string;
  username: string;
  rawPassword: string;
};

export const getUserByEmail = async (email: string) => {
  const user = await findUserByEmailQuery(email);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return user;
};

export const getUserById = async (userId: string) => {
  const user = await findUserByIdQuery(userId);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return user;
};

export const createUser = async (data: CreateUserData) => {
  const existing = await findUserByEmailQuery(data.email);

  if (existing) {
    throw new CustomError("User exists. Please try with another email", 409);
  }

  const hashedPassword = await password.hash(data.rawPassword);

  const user = await insertUser({
    email: data.email,
    password: hashedPassword,
    username: data.username,
  });

  if (!user) {
    throw new CustomError("Failed to create user", 500);
  }

  return user;
};

export const verifyUserCredentials = async (
  email: string,
  rawPassword: string,
) => {
  const user = await findUserByEmailQuery(email);

  if (!user) {
    throw new CustomError("Invalid email or password", 401);
  }

  const isValid = await password.verify(rawPassword, user.password);

  if (!isValid) {
    throw new CustomError("Invalid email or password", 401);
  }

  return user;
};

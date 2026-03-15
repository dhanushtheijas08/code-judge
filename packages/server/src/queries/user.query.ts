import { db } from "@/config";
import { userTable } from "@/schema";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  return user ?? null;
};

export const findUserById = async (userId: string) => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));

  return user ?? null;
};

export const insertUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const [user] = await db
    .insert(userTable)
    .values(data)
    .returning({ id: userTable.id, role: userTable.role });

  return user ?? null;
};

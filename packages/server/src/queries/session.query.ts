import { db } from "@/config";
import { sessionTable } from "@/schema";
import { eq } from "drizzle-orm";

export const findSessionById = async (sessionId: string) => {
  const [session] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId));

  return session ?? null;
};

export const insertSession = async (data: {
  userId: string;
  userIp: string;
  userAgent: string;
}) => {
  const [session] = await db
    .insert(sessionTable)
    .values(data)
    .returning({ id: sessionTable.id });

  return session ?? null;
};

export const deleteSessionById = async (sessionId: string) => {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
};

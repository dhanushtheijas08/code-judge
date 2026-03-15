import { CustomError } from "@/utils/CustomError";
import {
  findSessionById as findSessionByIdQuery,
  insertSession,
  deleteSessionById as deleteSessionByIdQuery,
} from "@/queries/session.query";

type CreateSessionData = {
  userId: string;
  userIp: string;
  userAgent: string;
};

export const createSession = async (data: CreateSessionData) => {
  const session = await insertSession(data);

  if (!session) {
    throw new CustomError("Failed to create session", 500);
  }

  return session;
};

export const getSessionById = async (sessionId: string) => {
  const session = await findSessionByIdQuery(sessionId);

  if (!session) {
    throw new CustomError("Session not found", 401);
  }

  if (new Date(session.expiresAt) < new Date()) {
    await deleteSessionByIdQuery(sessionId);
    throw new CustomError("Session expired", 401);
  }

  if (!session.userId) {
    throw new CustomError("Invalid session data", 500);
  }

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
  };
};

export const deleteSessionById = async (sessionId: string): Promise<void> => {
  await deleteSessionByIdQuery(sessionId);
};

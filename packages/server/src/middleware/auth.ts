import { verifyToken } from "@/services/token.service";
import { CustomError } from "@/utils/CustomError";
import type { NextFunction, Request, Response } from "express";

type AuthenticatedUser = {
  userId: string;
  role: string;
  sessionId: string;
};

type AccessTokenPayload = {
  userId?: string;
  role?: string;
  jti?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidAccessTokenPayload = (
  payload: AccessTokenPayload,
): payload is Required<AccessTokenPayload> =>
  isNonEmptyString(payload.userId) &&
  isNonEmptyString(payload.role) &&
  isNonEmptyString(payload.jti);

const unauthorizedError = (message: string) => new CustomError(message, 401);

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return next(unauthorizedError("Unauthorized - No access token provided"));
  }

  try {
    const { payload } = await verifyToken<AccessTokenPayload>(accessToken);

    if (!isValidAccessTokenPayload(payload)) {
      return next(unauthorizedError("Unauthorized - Invalid token payload"));
    }

    req.user = {
      userId: payload.userId,
      role: payload.role,
      sessionId: payload.jti,
    };

    return next();
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    } else {
      return next(unauthorizedError("Unauthorized - Invalid or expired token"));
    }
  }
};

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(unauthorizedError("Unauthorized - Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new CustomError("Forbidden - Insufficient permissions", 403));
    }

    return next();
  };

import { CustomError } from "@/utils/CustomError";
import {
  pgErrorFormatter,
  zodErrorFormatter,
  type PgError,
} from "@/utils/errorFormater";
import { ZodError } from "@code-judge/shared";
import { DrizzleError, DrizzleQueryError } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      redirectTo: error.redirectTo,
    });
  }

  if (error instanceof DrizzleError || error instanceof DrizzleQueryError) {
    const actualError =
      error instanceof DrizzleQueryError
        ? (error.cause as PgError)
        : (error as PgError);

    const { message } = pgErrorFormatter(actualError);
    return res.status(409).json({
      status: "failed",
      message,
    });
  }

  if (error instanceof ZodError) {
    const { primaryError } = zodErrorFormatter(error);
    return res.status(422).json({
      status: "failed",
      message: primaryError?.message ?? "Validation error",
    });
  }
  return res.status(500).json({
    status: "error",
    message: error.message || "Internal Server Error",
  });
};

export default errorHandler;

import type { ZodError } from "@code-judge/shared";
type ZodFormattedError = {
  field: string;
  message: string;
};
type ZodFormattedErrorResponse = {
  primaryError: ZodFormattedError | null;
  secondaryError: ZodFormattedError[];
};

export type PgError = Error & {
  code: string;
  errno?: string;
  detail?: string;
  severity?: string;
  schema?: string;
  table?: string;
  constraint?: string;
  file?: string;
  routine?: string;
};

export const zodErrorFormatter = (
  zodError: ZodError,
): ZodFormattedErrorResponse => {
  let primaryError: ZodFormattedError | null = null;
  let secondaryError: ZodFormattedError[] = [];
  zodError.issues.forEach((err, i) => {
    const field = String(err.path[0] ?? "unknown");
    if (i === 0) {
      primaryError = {
        field: field,
        message: err.message,
      };
    } else {
      secondaryError.push({
        field: field,
        message: err.message,
      });
    }
  });

  return { primaryError, secondaryError };
};

export const pgErrorFormatter = (pgError: PgError) => {
  const extractDupliacteKey = (val: string | undefined) => {
    if (!val) return { tableName: "", field: "" };
    const [tableName, ...otherVal] = val.split("_");
    otherVal.pop();
    const field = otherVal.join(" ").trim();
    return { tableName, field };
  };

  switch (pgError.errno) {
    case "23505":
      const { tableName, field } = extractDupliacteKey(pgError.constraint);

      return {
        message: `${field} already exist`,
        error: { tableName, field, errorNumber: pgError.errno },
      };

    default:
      return {
        message: "Server error",
      };
  }
};

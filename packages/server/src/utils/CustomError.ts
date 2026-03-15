export class CustomError extends Error {
  statusCode: number | undefined;
  redirectTo: string | undefined;
  constructor(
    errorMessage: string,
    errorStatusCode?: number,
    redirectTo?: string,
  ) {
    super(errorMessage);
    this.statusCode = errorStatusCode;
    this.redirectTo = redirectTo;
    Error.captureStackTrace(this, this.constructor);
  }
}

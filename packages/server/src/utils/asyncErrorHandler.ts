import type { NextFunction, Request, Response } from "express";

export const asyncErrorHandler =
  <Req extends Request<any, any, any, any> = Request>(
    fn: (
      req: Req,
      res: Response,
      next: NextFunction,
    ) => Promise<void | Response>,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req as Req, res, next);
    } catch (error) {
      next(error);
    }
  };

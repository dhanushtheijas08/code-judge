import type { ZodType } from "@code-judge/shared";
import type { NextFunction, Request, Response } from "express";

type ValidatorOptions = {
  target: "body" | "query" | "params";
  schema: ZodType;
};

export const validator =
  (options: ValidatorOptions) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { schema, target } = options;

      if (target === "body") req.body = schema.parse(req.body);
      if (target === "query")
        req.query = schema.parse(req.query) as Request["query"];
      if (target === "params")
        req.params = schema.parse(req.params) as Request["params"];

      next();
    } catch (error) {
      next(error);
    }
  };

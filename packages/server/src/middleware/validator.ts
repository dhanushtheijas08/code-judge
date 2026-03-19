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
      if (target === "query") {
        const validated = schema.parse(req.query) as Record<string, unknown>;
        Object.keys(req.query).forEach(
          (k) => delete (req.query as Record<string, unknown>)[k],
        );
        Object.assign(req.query, validated);
      }
      if (target === "params") {
        const validated = schema.parse(req.params) as Record<string, string>;
        Object.keys(req.params).forEach(
          (k) => delete (req.params as Record<string, string>)[k],
        );
        Object.assign(req.params, validated);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

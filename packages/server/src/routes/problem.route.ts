import {
  getAllProblems,
  getSingleProblem,
} from "@/controllers/problems.controller";
import { validator } from "@/middleware/validator";
import {
  paginationSchema,
  slugSchema,
  supportedLanguageQuerySchema,
} from "@code-judge/shared/problemsSchema";
import { Router } from "express";

const router = Router();

router.get(
  "/",
  validator({ schema: paginationSchema, target: "query" }),
  getAllProblems,
);
router.get(
  "/:slug",
  validator({ schema: slugSchema, target: "params" }),
  validator({ schema: supportedLanguageQuerySchema, target: "query" }),
  getSingleProblem,
);

export default router;

import { validator } from "@/middleware/validator";
import { Router } from "express";
import { id, paginationSchema } from "@code-judge/shared/problemsSchema";
import { getAllProblems } from "@/controllers/problems.controller";

const router = Router();

router.get(
  "/",
  validator({ schema: paginationSchema, target: "query" }),
  getAllProblems,
);
router.get("/:id", validator({ schema: id, target: "params" }));

export default router;

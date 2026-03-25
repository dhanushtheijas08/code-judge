import { submitCode } from "@/controllers/submission.controller";
import { authenticate } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import {
  runCodeSchema,
  submitCodeSchema,
} from "@code-judge/shared/submissionSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  validator({ schema: submitCodeSchema, target: "body" }),
  authenticate,
  submitCode,
);
router.post("/run", validator({ schema: runCodeSchema, target: "body" }));

export default router;

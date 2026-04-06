import {
  generateNewAccessToken,
  loginUser,
  logoutUser,
  registerUser,
} from "@/controllers/auth.controller";
import { validator } from "@/middleware/validator";
import { loginSchema, registerSchema } from "@code-judge/shared/authSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/login",
  validator({ schema: loginSchema, target: "body" }),
  loginUser,
);
router.post(
  "/register",
  validator({ schema: registerSchema, target: "body" }),
  registerUser,
);
router.post("/logout", logoutUser);
router.post("/refresh-token", generateNewAccessToken);

export default router;

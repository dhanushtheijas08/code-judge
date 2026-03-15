import {
  createSession,
  deleteSessionById,
  getSessionById,
} from "@/services/session.service";
import {
  createUser,
  getUserById,
  verifyUserCredentials,
} from "@/services/user.service";
import { clearAuthCookies, setAuthCookies } from "@/services/cookie.service";
import {
  generateAccessToken,
  generateTokenPair,
  verifyToken,
} from "@/services/token.service";
import { asyncErrorHandler } from "@/utils/asyncErrorHandler";
import { loginSchema, registerSchema } from "@code-judge/shared/authSchema";
import type { Request, Response } from "express";
import { CustomError } from "@/utils/CustomError";

export const loginUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const user = await verifyUserCredentials(body.email, body.password);

    const session = await createSession({
      userId: user.id,
      userIp: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"] ?? "unknown",
    });

    const tokens = await generateTokenPair({
      userId: user.id,
      role: user.role,
      sessionId: session.id,
    });

    setAuthCookies(res, tokens);

    return res
      .status(200)
      .json({ status: "success", message: "Logged in successfully" });
  },
);

export const registerUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const user = await createUser({
      email: body.email,
      username: body.username,
      rawPassword: body.password,
    });

    const session = await createSession({
      userId: user.id,
      userIp: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"] ?? "unknown",
    });

    const tokens = await generateTokenPair({
      userId: user.id,
      role: user.role,
      sessionId: session.id,
    });

    setAuthCookies(res, tokens);

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  },
);

export const logoutUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) throw new CustomError("Unauthorized", 401);

    const { payload } = await verifyToken(accessToken);
    if (!payload?.jti) throw new CustomError("Unauthorized", 401);

    await deleteSessionById(payload.jti);
    clearAuthCookies(res);
    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  },
);

export const generateNewAccessToken = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new CustomError("Refresh token not provided", 401);

    const { payload } = await verifyToken(refreshToken);
    if (!payload?.jti) throw new CustomError("Invalid refresh token", 401);

    const session = await getSessionById(payload.jti);
    const user = await getUserById(session.userId);

    const accessToken = await generateAccessToken({
      role: user.role,
      sessionId: session.id,
      userId: user.id,
    });

    setAuthCookies(res, { accessToken }, "access-token");

    return res.status(200).json({
      status: "success",
      message: "Access token generated successfully",
    });
  },
);

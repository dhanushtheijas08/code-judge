import type { Response } from "express";
type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_PATHS = "/api/v1/auth";

export const setAuthCookies = (
  res: Response,
  tokens: AuthTokens,
  type: "access-token" | "refresh-token" | "both" = "both",
) => {
  const isProduction = Bun.env.NODE_ENV === "production";

  if (type === "access-token" || type === "both")
    res.cookie("accessToken", tokens.accessToken, {
      expires: new Date(Date.now() + ACCESS_TOKEN_TTL_MS),
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    });

  if (type === "refresh-token" || type === "both")
    res.cookie("refreshToken", tokens.refreshToken, {
      expires: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      path: REFRESH_TOKEN_PATHS,
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: REFRESH_TOKEN_PATHS });
};

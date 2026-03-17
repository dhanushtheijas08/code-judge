import { SignJWT, jwtVerify } from "jose";

type AccessTokenPayload = {
  userId: string;
  role: string;
  sessionId: string;
};

type RefreshTokenPayload = {
  sessionId: string;
};

const getSecret = () => new TextEncoder().encode(Bun.env.JWT_SECRET);

export const generateAccessToken = async (payload: AccessTokenPayload) => {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setJti(payload.sessionId)
    .sign(getSecret());
};

export const generateRefreshToken = async (payload: RefreshTokenPayload) => {
  return new SignJWT({ sessionId: payload.sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .setJti(payload.sessionId)
    .sign(getSecret());
};

export const generateTokenPair = async (payload: AccessTokenPayload) => {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken({ sessionId: payload.sessionId }),
  ]);

  return { accessToken, refreshToken };
};

export const verifyToken = async <CustomPayload>(token: string) => {
  return await jwtVerify<CustomPayload>(token, getSecret(), {
    algorithms: ["HS256"],
  });
};

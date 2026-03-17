import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import errorHandler from "@/middleware/errorHandler";
import authRoutes from "@/routes/auth.route";
import userRoutes from "@/routes/user.route";
const app = express();

app.set("trust proxy", true);
app.use(
  cors({
    origin: Bun.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.get("/health", (_req, res) => {
  return res.status(200).json("healthy");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.use(errorHandler);
app.listen(Bun.env.PORT, () => console.log(`Running in port ${Bun.env.PORT}`));

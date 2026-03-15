import express from "express";
import cors from "cors";
import authRoutes from "@/routes/auth.route";
import errorHandler from "@/middleware/errorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.set("trust proxy", true);
app.use(
  cors({
    origin: Bun.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use(cookieParser());
app.get("/health", (req, res) => {
  return res.status(200).json("healthy");
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);
app.listen(Bun.env.PORT, () => console.log(`Running in port ${Bun.env.PORT}`));

import { getUserById } from "@/services/user.service";
import { CustomError } from "@/utils/CustomError";
import { asyncErrorHandler } from "@/utils/asyncErrorHandler";
import type { Request, Response } from "express";

export const getCurrentUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      throw new CustomError("Unauthorized - Authentication required", 401);
    }
    const { userId } = req.user;
    const { email, username, role, id } = await getUserById(userId);

    return res.status(200).json({ username, email, role, id });
  },
);

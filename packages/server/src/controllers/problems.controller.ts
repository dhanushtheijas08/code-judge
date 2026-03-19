import { getAllProblems as getProblems } from "@/services/problem.service";
import { asyncErrorHandler } from "@/utils/asyncErrorHandler";
import { CustomError } from "@/utils/CustomError";
import { paginationSchema } from "@code-judge/shared/problemsSchema";
import type { Request, Response } from "express";

export const getAllProblems = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { limit, page, difficulty, search, sort } = paginationSchema.parse(
      req.query,
    );
    const offset = (page - 1) * limit;

    const { problems, total } = await getProblems(offset, limit, {
      difficulty,
      search,
      sort,
    });
    if (total === 0) {
      throw new CustomError("No problems found", 404);
    }

    return res.status(200).json({ problems, total });
  },
);

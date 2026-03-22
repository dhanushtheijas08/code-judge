import {
  getProblemBySlug,
  getAllProblems as getProblems,
} from "@/services/problem.service";
import { asyncErrorHandler } from "@/utils/asyncErrorHandler";
import { CustomError } from "@/utils/CustomError";
import type {
  PaginationSchema,
  SupportedLanguageSchema,
} from "@code-judge/shared/problemsSchema";
import type { Request } from "express";

export const getAllProblems = asyncErrorHandler<
  Request<{}, {}, {}, PaginationSchema>
>(async (req, res) => {
  const { limit, page, difficulty, search, sort } = req.query;
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
});

export const getSingleProblem = asyncErrorHandler<
  Request<{ slug: string }, {}, {}, { lang: SupportedLanguageSchema }>
>(async (req, res) => {
  const { slug } = req.params;
  const { lang } = req.query;
  const problem = await getProblemBySlug(slug, lang);
  return res.status(200).json({ problem });
});

import { countProblems, findAllProblems, findProblemBySlug } from "@/queries";
import { CustomError } from "@/utils/CustomError";
import type { SupportedLanguageSchema } from "@code-judge/shared/problemsSchema";

export type GetAllProblemsOptions = {
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
  search?: string;
  sort?:
    | "createdAt"
    | "acceptance-asc"
    | "acceptance-desc"
    | "difficulty"
    | "title-asc"
    | "title-desc";
};

export const getAllProblems = async (
  offset: number,
  limit: number = 10,
  options: GetAllProblemsOptions = {},
) => {
  const [rows, total] = await Promise.all([
    findAllProblems(offset, limit, {
      tags: options.tags,
      difficulty: options.difficulty,
      search: options.search,
      sort: options.sort,
    }),
    countProblems({
      difficulty: options.difficulty,
      search: options.search,
    }),
  ]);

  const problemMap = new Map<
    string,
    (typeof rows)[0]["problem"] & { tags: { id: string; name: string }[] }
  >();

  for (const row of rows) {
    const problemId = row.problem.id;
    if (!problemMap.has(problemId)) {
      problemMap.set(problemId, { ...row.problem, tags: [] });
    }
    const entry = problemMap.get(problemId)!;
    if (row.tag?.id) {
      entry.tags.push({ id: row.tag.id, name: row.tag.name });
    }
  }

  return {
    problems: Array.from(problemMap.values()),
    total,
  };
};

export const getProblemBySlug = async (
  slug: string,
  lang: SupportedLanguageSchema,
) => {
  const problem = await findProblemBySlug(slug, lang);

  if (!problem) {
    throw new CustomError("Problem not found", 404);
  }
  return problem;
};

import { db } from "@/config";
import {
  problemsTable,
  problemsToTags,
  starterCodeTable,
  tagsTable,
} from "@/schema";
import type { GetAllProblemsOptions } from "@/services/problem.service";
import type { SupportedLanguageSchema } from "@code-judge/shared/problemsSchema";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

const SORT_BY_OPTIONS = [
  { value: "createdAt", q: asc(problemsTable.createdAt) },
  {
    value: "acceptance-asc",
    q: asc(problemsTable.acceptance),
  },
  {
    value: "acceptance-desc",
    q: desc(problemsTable.acceptance),
  },
  {
    value: "difficulty",
    q: asc(problemsTable.difficulty),
  },
  { value: "title-asc", q: asc(problemsTable.name) },
  { value: "title-desc", q: desc(problemsTable.name) },
];

const buildWhereClause = (options: GetAllProblemsOptions = {}) =>
  and(
    options.difficulty
      ? eq(problemsTable.difficulty, options.difficulty)
      : undefined,
    options.search
      ? ilike(problemsTable.name, `%${options.search}%`)
      : undefined,
  );

export const findAllProblems = async (
  offset: number,
  limit: number = 10,
  options: GetAllProblemsOptions = {},
) => {
  const sortBy =
    SORT_BY_OPTIONS.find((opt) => opt.value === options.sort)?.q ??
    asc(problemsTable.createdAt);

  const paginatedIds = db
    .select({ id: problemsTable.id })
    .from(problemsTable)
    .where(buildWhereClause(options))
    .orderBy(sortBy)
    .limit(limit)
    .offset(offset)
    .as("paginated");

  return await db
    .select({
      problem: {
        id: problemsTable.id,
        name: problemsTable.name,
        difficulty: problemsTable.difficulty,
        acceptance: problemsTable.acceptance,
        slug: problemsTable.slug,
      },
      tag: { id: tagsTable.id, name: tagsTable.name },
    })
    .from(paginatedIds)
    .innerJoin(problemsTable, eq(paginatedIds.id, problemsTable.id))
    .leftJoin(problemsToTags, eq(problemsToTags.problemId, problemsTable.id))
    .leftJoin(tagsTable, eq(tagsTable.id, problemsToTags.tagId))
    .orderBy(sortBy);
};

export const countProblems = async (
  options: GetAllProblemsOptions = {},
): Promise<number> => {
  const [result] = await db
    .select({ count: count() })
    .from(problemsTable)
    .where(buildWhereClause(options));
  return Number(result?.count ?? 0);
};

export const findProblemBySlug = async (
  slug: string,
  lang: SupportedLanguageSchema,
) => {
  const rows = await db
    .select({
      problem: {
        id: problemsTable.id,
        name: problemsTable.name,
        difficulty: problemsTable.difficulty,
        acceptance: problemsTable.acceptance,
        slug: problemsTable.slug,
      },
      tag: { id: tagsTable.id, name: tagsTable.name },
      starterCode: {
        id: starterCodeTable.id,
        code: starterCodeTable.code,
        language: starterCodeTable.language,
      },
      testCase: problemsTable.testCase,
      question: problemsTable.question,
      createdAt: problemsTable.createdAt,
      updatedAt: problemsTable.updatedAt,
    })
    .from(problemsTable)
    .where(eq(problemsTable.slug, slug))
    .leftJoin(problemsToTags, eq(problemsToTags.problemId, problemsTable.id))
    .leftJoin(tagsTable, eq(tagsTable.id, problemsToTags.tagId))
    .leftJoin(
      starterCodeTable,
      and(
        eq(starterCodeTable.problemId, problemsTable.id),
        eq(starterCodeTable.language, lang),
      ),
    );

  if (!rows.length) return null;

  const first = rows[0]!;
  const tags: { id: string; name: string }[] = [];
  const seenTagIds = new Set<string>();

  for (const row of rows) {
    if (row.tag?.id && !seenTagIds.has(row.tag.id)) {
      seenTagIds.add(row.tag.id);
      tags.push({ id: row.tag.id, name: row.tag.name });
    }
  }

  return {
    ...first.problem,
    tags,
    starterCode: first.starterCode,
    testCase: first.testCase,
    question: first.question,
    createdAt: first.createdAt,
    updatedAt: first.updatedAt,
  };
};

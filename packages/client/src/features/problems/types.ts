import type { SupportedLanguageSchema } from "@code-judge/shared/problemsSchema";

export type DifficultyLevel = "easy" | "medium" | "hard";

export type ProblemStatus = "solved" | "attempted" | "unsolved";
export type Tags = {
  id: string;
  name: string;
};
export type LanguageEnum = SupportedLanguageSchema;
export type StarterCode = {
  id: string;
  code: string;
  language: LanguageEnum;
};

export type TestCase = {
  input: unknown;
  output: unknown;
};

export type ProblemType = {
  id: string;
  name: string;
  difficulty: DifficultyLevel;
  acceptance: number;
  tags: Tags[];
  slug: string;
  starterCode?: StarterCode;
  testCase?: TestCase[];
  createdAt?: string;
  updatedAt?: string;
  question?: string;
};

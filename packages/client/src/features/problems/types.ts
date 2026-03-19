export type DifficultyLevel = "easy" | "medium" | "hard";

export type ProblemStatus = "solved" | "attempted" | "unsolved";
export type Tags = {
  id: string;
  name: string;
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
  testCase?: TestCase[];
  createdAt?: string;
  updatedAt?: string;
  question?: string;
};

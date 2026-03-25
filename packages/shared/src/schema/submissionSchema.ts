import { z } from "zod";
import { supportedLanguageSchema } from "./problemsSchema";

export const languageEnum = supportedLanguageSchema.default("c");
export const submitCodeSchema = z.object({
  problemId: z.uuid("Invalid problem ID"),
  code: z
    .string()
    .min(1, "Code cannot be empty")
    .max(50000, "Code is too long"),
  language: languageEnum,
});

export const runCodeSchema = submitCodeSchema.extend({
  testCaseIndex: z.number().int().min(0).optional(),
});

export const submissionStatusEnum = z.enum([
  "pending",
  "accepted",
  "wrong_answer",
  "time_limit_exceeded",
  "memory_limit_exceeded",
  "compilation_error",
  "runtime_error",
]);

export const submissionResponseSchema = z.object({
  id: z.uuid(),
  status: submissionStatusEnum,
  testCasesPassed: z.number().int().min(0),
  totalTestCases: z.number().int().min(0),
  executionTimeMs: z.number().int().nullable(),
  memoryKb: z.number().int().nullable(),
  errorMessage: z.string().nullable(),
  failedTestCase: z
    .object({
      input: z.unknown(),
      expectedOutput: z.unknown(),
      actualOutput: z.unknown(),
    })
    .nullable(),
  submittedAt: z.string(),
});

export type SubmitCodeInput = z.infer<typeof submitCodeSchema>;
export type RunCodeInput = z.infer<typeof runCodeSchema>;
export type SubmissionResponse = z.infer<typeof submissionResponseSchema>;
export type Language = z.infer<typeof languageEnum>;
export type SubmissionStatus = z.infer<typeof submissionStatusEnum>;

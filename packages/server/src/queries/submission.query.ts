import { db } from "@/config";
import { submissionTable } from "@/schema";
import type { SubmitCodeInput } from "@code-judge/shared/submissionSchema";

export const createSubmission = async (
  data: SubmitCodeInput & { userId: string },
) => {
  const [submission] = await db
    .insert(submissionTable)
    .values({
      code: data.code,
      language: data.language,
      problemId: data.problemId,
      userId: data.userId,
    })
    .returning({ id: submissionTable.id });

  return submission ?? null;
};

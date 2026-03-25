import { submissionQueue } from "@/config";

export const enqueueSubmission = async (submissionId: string) => {
  const job = await submissionQueue.add(
    "execute-submission",
    {
      submissionId,
    },
    {
      priority: 1,
    },
  );
  console.log(job);
  return job;
};

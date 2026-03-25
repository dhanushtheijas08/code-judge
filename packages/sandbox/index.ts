import { Worker } from "bullmq";

export const worker = new Worker(
  "submission",
  async (job) => {
    const { submissionId } = job.data;

    console.log({ submissionId });
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);

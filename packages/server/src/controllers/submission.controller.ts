import { asyncErrorHandler } from "@/utils/asyncErrorHandler";
import type { Request } from "express";
import type { SubmitCodeInput } from "@code-judge/shared/submissionSchema";
import { createSubmission } from "@/queries/submission.query";
import { CustomError } from "@/utils/CustomError";
import { enqueueSubmission } from "@/services/queue.service";

export const submitCode = asyncErrorHandler<Request<{}, {}, SubmitCodeInput>>(
  async (req, res) => {
    const { problemId, code, language } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError("Unauthorized - Authentication required", 401);
    }
    const submission = await createSubmission({
      problemId,
      code,
      language,
      userId,
    });
    if (!submission) {
      throw new CustomError("Failed to create submission", 500);
    }
    await enqueueSubmission(submission.id);
    return res.status(201).json({
      status: "success",
      message: "Submission created successfully",
      data: submission.id,
    });
  },
);

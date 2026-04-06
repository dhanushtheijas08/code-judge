import { SUBMISSION_API_URL } from "@/utils/conts";
import { fetchWithAuthRetry } from "@/utils/fetchWithAuthRetry";
import type {
  SubmitCodeInput,
  RunCodeInput,
  SubmissionResponse,
} from "@code-judge/shared/submissionSchema";

export const submitCodeApi = async (
  input: SubmitCodeInput,
): Promise<{ submissionId: string }> => {
  try {
    const res = await fetchWithAuthRetry(SUBMISSION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Submission failed");
    }

    return { submissionId: data.data };
  } catch (error) {
    console.error("Submit code API error:", error);
    throw error;
  }
};

export const runCodeApi = async (
  input: RunCodeInput,
): Promise<SubmissionResponse> => {
  try {
    const res = await fetchWithAuthRetry(`${SUBMISSION_API_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Run code failed");
    }

    return data.data;
  } catch (error) {
    console.error("Run code API error:", error);
    throw error;
  }
};

import { PROBLEMS_API_URL, PROBLEMS_PER_PAGE } from "@/utils/conts";

type GetProblemsApiParams = {
  page: number;
  q?: string;
  difficulty?: string;
  tag?: string;
  status?: string;
  sort?: string;
};

export const getProblemsApi = async ({
  page,
  q,
  difficulty,
  tag,
  status,
  sort,
}: GetProblemsApiParams) => {
  try {
    const apiParams = new URLSearchParams();

    apiParams.set("page", String(page));
    apiParams.set("limit", String(PROBLEMS_PER_PAGE));

    if (q) apiParams.set("search", q);
    if (difficulty && difficulty !== "all")
      apiParams.set("difficulty", difficulty);
    if (tag) apiParams.set("tag", tag);
    if (status && status !== "all") apiParams.set("status", status);
    if (sort && sort !== "default") apiParams.set("sort", sort);

    const res = await fetch(`${PROBLEMS_API_URL}?${apiParams.toString()}`);
    const data = await res.json();

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Problems request failed");
    }

    return data;
  } catch (error) {
    console.error("Problems API error:", error);
    throw error;
  }
};

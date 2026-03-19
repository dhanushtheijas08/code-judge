import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getProblemsApi } from "./problemsApi";

export const useProblems = () => {
  const [searchParams] = useSearchParams();
  const parsedPage = Number(searchParams.get("page") ?? 1);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const q = searchParams.get("q") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;

  const fetchAllProblems = useQuery({
    queryKey: ["problems", page, q, difficulty, tag, status, sort],
    queryFn: () => getProblemsApi({ page, q, difficulty, tag, status, sort }),
  });

  return { fetchAllProblems };
};

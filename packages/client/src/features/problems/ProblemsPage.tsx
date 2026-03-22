import { PROBLEMS_PER_PAGE } from "@/utils/conts";
import { getPreferredLanguage } from "@/utils/user-preferences";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { Navbar } from "./components/Navbar";
import { ProblemFilters } from "./components/ProblemFilters";
import { problemColumns } from "./components/ProblemsTable/problem-columns";
import { ProblemsTable } from "./components/ProblemsTable/ProblemsTable";
import type { ProblemType } from "./types";
import { useProblems } from "./utils/useProblems";

export const ProblemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const preferredlang = getPreferredLanguage();
  const {
    fetchAllProblems: { data: problemsData, isPending, isError },
  } = useProblems();

  const total = problemsData?.total ?? 0;
  const problems = problemsData?.problems ?? [];
  const totalPages = Math.max(1, Math.ceil(total / PROBLEMS_PER_PAGE));
  const parsedPage = Number(searchParams.get("page") ?? 1);
  const safePage = Math.min(
    Math.max(Number.isFinite(parsedPage) ? parsedPage : 1, 1),
    totalPages,
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Problems
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Practice coding problems to sharpen your skills
            </p>
          </div>
        </div>

        {/* Filters */}
        <ProblemFilters
          tags={problems?.flatMap((p: ProblemType) => p.tags) || []}
        />

        {/* Result summary */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">
            {total === 0
              ? "No results"
              : `${(safePage - 1) * PROBLEMS_PER_PAGE + 1}–${Math.min(
                  safePage * PROBLEMS_PER_PAGE,
                  total,
                )} of ${total} problems`}
          </p>
        </div>

        {/* Table */}
        {isPending ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden py-24 text-center">
            <p className="text-sm text-muted-foreground">Loading problems...</p>
          </div>
        ) : (
          <>
            {isError && (
              <p className="text-xs text-destructive mb-3">
                Could not load from API. Showing fallback data.
              </p>
            )}
            <ProblemsTable
              columns={problemColumns}
              data={problems as ProblemType[]}
              onRowClick={(row) => {
                navigate(`/problems/${row.slug}?lang=${preferredlang}`);
              }}
            />
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              onClick={() =>
                setSearchParams((p) => {
                  const next = new URLSearchParams(p);
                  next.set("page", String(Math.max(safePage - 1, 1)));
                  return next;
                })
              }
              disabled={safePage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground bg-card border border-border rounded-lg hover:bg-accent hover:text-foreground disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set("page", String(p));
                      return next;
                    })
                  }
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                    p === safePage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setSearchParams((p) => {
                  const next = new URLSearchParams(p);
                  next.set("page", String(Math.min(safePage + 1, totalPages)));
                  return next;
                })
              }
              disabled={safePage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground bg-card border border-border rounded-lg hover:bg-accent hover:text-foreground disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

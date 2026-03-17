import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { ProblemFilters, type FilterState } from "./components/ProblemFilters";
import { ProblemsTable } from "./components/ProblemsTable";
import { MOCK_PROBLEMS } from "./mock-problems";
import type { Difficulty, Status } from "./mock-problems";

const PROBLEMS_PER_PAGE = 20;

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
};

const DEFAULT_FILTERS: FilterState = {
  search: "",
  difficulty: "All",
  tag: "",
  status: "All",
  sort: "default",
};

const StatPill = ({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
    <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
    <span className="text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">{count}</span> {label}
    </span>
  </div>
);

export const ProblemsPage = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...MOCK_PROBLEMS];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (filters.difficulty !== "All") {
      result = result.filter((p) => p.difficulty === (filters.difficulty as Difficulty));
    }
    if (filters.tag) {
      result = result.filter((p) => p.tags.includes(filters.tag));
    }
    if (filters.status !== "All") {
      result = result.filter((p) => p.status === (filters.status as Status));
    }

    switch (filters.sort) {
      case "acceptance-asc":
        result.sort((a, b) => a.acceptance - b.acceptance);
        break;
      case "acceptance-desc":
        result.sort((a, b) => b.acceptance - a.acceptance);
        break;
      case "difficulty":
        result.sort(
          (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
        );
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [filters]);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PROBLEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PROBLEMS_PER_PAGE,
    safePage * PROBLEMS_PER_PAGE,
  );

  const easyCount = MOCK_PROBLEMS.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = MOCK_PROBLEMS.filter((p) => p.difficulty === "Medium").length;
  const hardCount = MOCK_PROBLEMS.filter((p) => p.difficulty === "Hard").length;
  const solvedCount = MOCK_PROBLEMS.filter((p) => p.status === "solved").length;

  const solvedPercent = Math.round((solvedCount / MOCK_PROBLEMS.length) * 100);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Problems
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Practice coding problems to sharpen your skills
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-2">
              <StatPill color="bg-emerald-500" label="Easy" count={easyCount} />
              <StatPill color="bg-amber-500" label="Medium" count={mediumCount} />
              <StatPill color="bg-rose-500" label="Hard" count={hardCount} />

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${solvedPercent}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  <span className="font-semibold text-foreground">{solvedCount}</span>
                  /{MOCK_PROBLEMS.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProblemFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Result summary */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No results"
              : `${(safePage - 1) * PROBLEMS_PER_PAGE + 1}–${Math.min(
                  safePage * PROBLEMS_PER_PAGE,
                  filtered.length,
                )} of ${filtered.length} problems`}
          </p>
        </div>

        {/* Table */}
        <ProblemsTable problems={paginated} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  onClick={() => setPage(p)}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

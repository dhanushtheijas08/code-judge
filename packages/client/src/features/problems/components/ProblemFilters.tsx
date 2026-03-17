import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { ALL_TAGS, type Difficulty, type Status } from "../mock-problems";

export interface FilterState {
  search: string;
  difficulty: Difficulty | "All";
  tag: string;
  status: Status | "All";
  sort: "default" | "acceptance-asc" | "acceptance-desc" | "difficulty" | "title-asc";
}

interface ProblemFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const DIFFICULTY_OPTIONS: Array<{ label: string; value: Difficulty | "All" }> = [
  { label: "All", value: "All" },
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

const STATUS_OPTIONS: Array<{ label: string; value: Status | "All" }> = [
  { label: "All Status", value: "All" },
  { label: "Solved", value: "solved" },
  { label: "Attempted", value: "attempted" },
  { label: "Unsolved", value: "unsolved" },
];

const SORT_OPTIONS: Array<{ label: string; value: FilterState["sort"] }> = [
  { label: "Default", value: "default" },
  { label: "Acceptance ↑", value: "acceptance-asc" },
  { label: "Acceptance ↓", value: "acceptance-desc" },
  { label: "Difficulty", value: "difficulty" },
  { label: "Title A–Z", value: "title-asc" },
];

const difficultyActive: Record<string, string> = {
  All: "bg-foreground text-background",
  Easy: "bg-foreground text-background",
  Medium: "bg-foreground text-background",
  Hard: "bg-foreground text-background",
};

const SelectField = ({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none h-9 pl-3 pr-8 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 cursor-pointer transition-colors hover:bg-accent/40"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
  </div>
);

export const ProblemFilters = ({ filters, onFiltersChange }: ProblemFiltersProps) => {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onFiltersChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-2.5 py-4">
      {/* Search */}
      <div className="relative flex-1 min-w-52 max-w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search problems…"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border hidden sm:block" />

      {/* Difficulty segment */}
      <div className="flex items-center gap-0.5 bg-muted/60 border border-border/60 rounded-lg p-0.5">
        {DIFFICULTY_OPTIONS.map((d) => (
          <button
            key={d.value}
            onClick={() => update("difficulty", d.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
              filters.difficulty === d.value
                ? difficultyActive[d.value]
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border hidden sm:block" />

      {/* Dropdowns group */}
      <div className="flex items-center gap-2">
        <SelectField value={filters.tag} onChange={(v) => update("tag", v)}>
          <option value="">All Tags</option>
          {ALL_TAGS.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </SelectField>

        <SelectField
          value={filters.status}
          onChange={(v) => update("status", v as FilterState["status"])}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </SelectField>

        <SelectField
          value={filters.sort}
          onChange={(v) => update("sort", v as FilterState["sort"])}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </SelectField>
      </div>

      {/* Clear filters — only show when active */}
      {(filters.search || filters.difficulty !== "All" || filters.tag || filters.status !== "All" || filters.sort !== "default") && (
        <button
          onClick={() =>
            onFiltersChange({ search: "", difficulty: "All", tag: "", status: "All", sort: "default" })
          }
          className="flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 rounded-lg hover:bg-accent/40 transition-colors ml-auto"
        >
          <SlidersHorizontal className="size-3.5" />
          Reset
        </button>
      )}
    </div>
  );
};

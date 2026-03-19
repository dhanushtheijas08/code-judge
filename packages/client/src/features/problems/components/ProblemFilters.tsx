import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ArrowUpDown,
  CircleDot,
  RotateCcw,
  Search,
  Tag,
  X,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { DifficultyLevel, ProblemStatus, Tags } from "../types";
import { TagsDropdown } from "./TagsDropdown";

export interface FilterState {
  search: string;
  difficulty: DifficultyLevel | "all";
  tag: string;
  status: ProblemStatus | "all";
  sort:
    | "default"
    | "acceptance-asc"
    | "acceptance-desc"
    | "difficulty"
    | "title-asc";
}

const DEFAULT_FILTER_VALUES = ["", "all", "default", undefined, null];

const DIFFICULTY_OPTIONS: Array<{
  label: string;
  value: DifficultyLevel | "all";
}> = [
  { label: "All", value: "all" },
  {
    label: "Easy",
    value: "easy",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Hard",
    value: "hard",
  },
];

const STATUS_OPTIONS: Array<{ label: string; value: ProblemStatus | "all" }> = [
  { label: "All Status", value: "all" },
  { label: "Solved", value: "solved" },
  { label: "Attempted", value: "attempted" },
  { label: "Unsolved", value: "unsolved" },
];

const SORT_OPTIONS: Array<{ label: string; value: FilterState["sort"] }> = [
  { label: "Default", value: "default" },
  { label: "Acceptance (Asc)", value: "acceptance-asc" },
  { label: "Acceptance (Desc)", value: "acceptance-desc" },
  { label: "Difficulty", value: "difficulty" },
  { label: "Title A-Z", value: "title-asc" },
];

const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1 block">
    {children}
  </span>
);

export const ProblemFilters = ({ tags }: { tags: Tags[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState<string | null>(
    searchParams.get("q"),
  );

  useEffect(() => {
    if (!searchVal?.length) {
      setSearchParams((prev) => {
        prev.delete("q");
        return prev;
      });
      return;
    }
    const search = setTimeout(() => {
      setSearchParams((prev) => {
        prev.set("q", searchVal || "");
        return prev;
      });
    }, 500);

    return () => clearTimeout(search);
  }, [searchVal, setSearchParams]);

  const difficulty = searchParams.get("difficulty") || "all";
  const status = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "default";

  function updateSearchParams(key: string, value: string) {
    setSearchParams((prev) => {
      if (DEFAULT_FILTER_VALUES.includes(value)) {
        prev.delete(key);
        return prev;
      }
      prev.set(key, value);
      return prev;
    });
  }

  const hasActiveFilters =
    !!searchParams.get("q") ||
    difficulty !== "all" ||
    !!searchParams.get("tag") ||
    status !== "all" ||
    sort !== "default";

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-wrap items-end gap-3 py-4">
      <div>
        <FilterLabel>Search</FilterLabel>
        <InputGroup className="min-w-52 max-w-72 h-9">
          <InputGroupAddon>
            <Search className="size-3.5" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Problem name..."
            value={searchVal || ""}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={() => updateSearchParams("q", "")}
              variant="ghost"
              className={cn(
                "hover:bg-destructive/20 hover:text-destructive transition-colors",
                (searchVal || searchParams.get("q")) && "opacity-100",
                !(searchVal || searchParams.get("q")) &&
                  "opacity-0 pointer-events-none",
              )}
            >
              <X className="size-3" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="w-px h-9 bg-border/60 hidden md:block self-end mb-0.5" />
      <div>
        <FilterLabel>Difficulty</FilterLabel>
        <div className="flex items-center gap-0.5 bg-muted/50 border border-border/50 rounded-lg p-0.5 h-9">
          {DIFFICULTY_OPTIONS.map((d) => (
            <button
              key={d.value}
              className={`px-3 h-full text-xs font-semibold rounded-md transition-all duration-150 ${
                difficulty === d.value
                  ? "bg-foreground/80 text-background ring-1 ring-foreground/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
              onClick={() => updateSearchParams("difficulty", d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <>
          <div className="w-px h-9 bg-border/60 hidden md:block self-end mb-0.5" />
          <div>
            <FilterLabel>
              <span className="flex items-center gap-1">
                <Tag className="size-2.5" /> Topic
              </span>
            </FilterLabel>
            <TagsDropdown tags={tags} />
          </div>

          <div>
            <FilterLabel>
              <span className="flex items-center gap-1">
                <CircleDot className="size-2.5" /> Status
              </span>
            </FilterLabel>
            <Select
              value={status}
              onValueChange={(v) => updateSearchParams("status", v ?? "all")}
              items={STATUS_OPTIONS}
            >
              <SelectTrigger className="h-9 bg-card min-w-[130px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <FilterLabel>
              <span className="flex items-center gap-1">
                <ArrowUpDown className="size-2.5" /> Sort by
              </span>
            </FilterLabel>
            <Select
              value={sort}
              onValueChange={(v) => updateSearchParams("sort", v ?? "default")}
              items={SORT_OPTIONS}
            >
              <SelectTrigger className="h-9 bg-card min-w-[140px]">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 rounded-lg hover:bg-accent/40 transition-colors self-end"
        >
          <RotateCcw className="size-3" />
          Reset
        </button>
      )}
    </div>
  );
};

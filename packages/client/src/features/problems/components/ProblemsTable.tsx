import { CheckCircle2, MinusCircle, Circle, Lock } from "lucide-react";
import type { Problem } from "../mock-problems";

interface ProblemsTableProps {
  problems: Problem[];
}

const DifficultyBadge = ({ difficulty }: { difficulty: Problem["difficulty"] }) => {
  const styles = {
    Easy: "text-emerald-500 bg-emerald-500/10 border border-emerald-500/10",
    Medium: "text-amber-500 bg-amber-500/10 border border-amber-500/10",
    Hard: "text-rose-500 bg-rose-500/10 border border-rose-500/10",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-xs font-semibold ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
};

const StatusIcon = ({ status }: { status: Problem["status"] }) => {
  if (status === "solved") {
    return <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />;
  }
  if (status === "attempted") {
    return <Circle className="size-4 text-amber-400 fill-amber-400/20 shrink-0" />;
  }
  return <MinusCircle className="size-4 text-border shrink-0" />;
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mb-4">
      <Lock className="size-5 text-muted-foreground/50" />
    </div>
    <p className="text-sm font-semibold text-foreground mb-1.5">No problems found</p>
    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
      Try adjusting your filters or search query.
    </p>
  </div>
);

const AcceptanceBar = ({ value }: { value: number }) => {
  const color =
    value >= 50 ? "bg-emerald-500" : value >= 35 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums font-mono">
        {value.toFixed(1)}%
      </span>
    </div>
  );
};

export const ProblemsTable = ({ problems }: ProblemsTableProps) => {
  if (problems.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider w-14">
                #
              </th>
              <th className="text-left px-2 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider w-10">
                <span className="sr-only">Status</span>
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                Tags
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider w-28">
                Difficulty
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell w-36">
                Acceptance
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem.id}
                className={`group hover:bg-accent/30 transition-colors duration-100 cursor-pointer ${
                  index !== problems.length - 1
                    ? "border-b border-border/60"
                    : ""
                }`}
              >
                <td className="px-5 py-4 text-xs text-muted-foreground/60 font-mono tabular-nums">
                  {problem.id}
                </td>
                <td className="px-2 py-4">
                  <StatusIcon status={problem.status} />
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-100">
                    {problem.title}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-muted/80 group-hover:bg-accent/30 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-muted/80 group-hover:bg-accent/30 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                        +{problem.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <AcceptanceBar value={problem.acceptance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

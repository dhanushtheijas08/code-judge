import type { ProblemType } from "../../types";
import { cn } from "@/lib/utils";

export const DifficultyBadge = ({
  difficulty,
  size = "sm",
}: {
  difficulty: ProblemType["difficulty"];
  size?: "sm" | "md" | "lg";
}) => {
  const styles = {
    easy: "text-emerald-500 bg-emerald-500/10 border border-emerald-500/10",
    medium: "text-amber-500 bg-amber-500/10 border border-amber-500/10",
    hard: "text-rose-500 bg-rose-500/10 border border-rose-500/10",
  };

  const sizeClasses = {
    sm: "h-auto px-2 py-0.5 text-[11px]",
    md: "h-auto px-2.5 py-1 text-xs",
    lg: "h-auto px-3 py-1 text-[12.5px]",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none font-semibold capitalize",
        sizeClasses,
        styles[difficulty],
      )}
    >
      {difficulty}
    </span>
  );
};

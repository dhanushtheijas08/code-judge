import type { ProblemType } from "../../types";

export const DifficultyBadge = ({
  difficulty,
}: {
  difficulty: ProblemType["difficulty"];
}) => {
  const styles = {
    easy: "text-emerald-500 bg-emerald-500/10 border border-emerald-500/10",
    medium: "text-amber-500 bg-amber-500/10 border border-amber-500/10",
    hard: "text-rose-500 bg-rose-500/10 border border-rose-500/10",
  };
  return (
    <span
      className={`inline-flex capitalize items-center px-2 py-0.5 rounded-none text-xs font-semibold ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
};

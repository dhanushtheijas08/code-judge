export const AcceptanceBar = ({ value }: { value: number }) => {
  const color =
    value >= 50
      ? "bg-emerald-500"
      : value >= 35
        ? "bg-amber-500"
        : "bg-rose-500";
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden shrink-0">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(Number(value), 100)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums font-mono">
        {Number(value).toFixed(1)}%
      </span>
    </div>
  );
};

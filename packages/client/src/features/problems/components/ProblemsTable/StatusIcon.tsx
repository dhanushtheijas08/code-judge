import { CheckCircle2, MinusCircle, Circle } from "lucide-react";
import type { ProblemStatus } from "../../types";

export const StatusIcon = ({ status }: { status: ProblemStatus }) => {
  if (status === "solved") {
    return <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />;
  }
  if (status === "attempted") {
    return (
      <Circle className="size-4 text-amber-400 fill-amber-400/20 shrink-0" />
    );
  }
  if (status === "unsolved") {
    return <MinusCircle className="size-4 text-border shrink-0" />;
  }
  return null;
};

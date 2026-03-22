import type { Tags } from "../../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagsListProps {
  tags: Tags[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
}

export const TagsList = ({
  tags,
  maxVisible = 3,
  size = "sm",
}: TagsListProps) => {
  const sizeClasses = {
    sm: "h-auto px-2 py-0.5 text-[11px]",
    md: "h-auto px-2.5 py-1 text-xs",
    lg: "h-auto px-3 py-1 text-[12.5px]",
  }[size];

  const badgeBaseClassName = cn(
    "bg-muted/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground group-hover:bg-accent/30 transition-colors cursor-pointer",
    sizeClasses,
  );

  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, maxVisible).map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className={cn("capitalize", badgeBaseClassName)}
        >
          {tag.name.split("-").join(" ")}
        </Badge>
      ))}
      {tags.length > maxVisible && (
        <Badge variant="secondary" className={badgeBaseClassName}>
          +{tags.length - maxVisible}
        </Badge>
      )}
    </div>
  );
};

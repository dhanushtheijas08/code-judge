import type { Tags } from "../../types";

interface TagsListProps {
  tags: Tags[];
  maxVisible?: number;
}

export const TagsList = ({ tags, maxVisible = 3 }: TagsListProps) => {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, maxVisible).map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center capitalize px-2 py-0.5 text-[11px] font-medium bg-muted/80 group-hover:bg-accent/30 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
        >
          {tag.name.split("-").join(" ")}
        </span>
      ))}
      {tags.length > maxVisible && (
        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-muted/80 group-hover:bg-accent/30 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          +{tags.length - maxVisible}
        </span>
      )}
    </div>
  );
};

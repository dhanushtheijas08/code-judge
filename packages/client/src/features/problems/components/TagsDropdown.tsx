import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tags } from "../types";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

export const TagsDropdown = ({ tags }: { tags: Tags[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") || "";
  const updateSearchParams = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value == "all") {
        prev.delete(key);
        return prev;
      }

      prev.set(key, value);
      return prev;
    });
  };

  const uniqueTags = useMemo(() => {
    const flattened = tags.flat();
    const uniqueTagsMap = new Map<string, Tags>();

    flattened.forEach((tag) => {
      if (!uniqueTagsMap.has(tag.id)) {
        uniqueTagsMap.set(tag.id, tag);
      }
    });

    return Array.from(uniqueTagsMap.values());
  }, [tags]);

  return (
    <Select
      value={tag === "" ? "all" : tag}
      onValueChange={(v) => updateSearchParams("tag", v ?? "all")}
      items={uniqueTags.map((tag) => ({
        label: tag.name?.split("-").join(" "),
        value: tag.name,
      }))}
    >
      <SelectTrigger className="h-9 bg-card min-w-[110px]">
        <SelectValue placeholder="All Tags" className="capitalize" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tags</SelectItem>
        {uniqueTags.map((tag) => (
          <SelectItem key={tag.name} value={tag.name} className="capitalize">
            {tag.name?.split("-").join(" ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

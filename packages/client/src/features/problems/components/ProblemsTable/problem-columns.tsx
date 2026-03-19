"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ProblemType } from "../../types";
import { AcceptanceBar } from "./AcceptanceBar";
import { DifficultyBadge } from "./DifficultyBadge";
import { TagsList } from "./TagsList";

export const problemColumns: ColumnDef<ProblemType>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Title",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-100">
        {row.original.name}
      </span>
    ),
  },

  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => <TagsList tags={row.original.tags} maxVisible={3} />,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => <DifficultyBadge difficulty={row.original.difficulty} />,
  },
  {
    accessorKey: "acceptance",
    header: "Acceptance",
    cell: ({ row }) => <AcceptanceBar value={row.original.acceptance} />,
  },
];

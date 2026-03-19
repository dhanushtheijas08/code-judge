"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Lock } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProblemsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mb-4">
      <Lock className="size-5 text-muted-foreground/50" />
    </div>
    <p className="text-sm font-semibold text-foreground mb-1.5">
      No problems found
    </p>
    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
      Try adjusting your filters or search query.
    </p>
  </div>
);

export function ProblemsTable<TData, TValue>({
  columns,
  data,
}: ProblemsTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/60 hover:bg-muted/60"
              >
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { th?: string }
                    | undefined;
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-left py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider ${meta?.th || "px-4"}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`group hover:bg-accent/30 transition-colors duration-100 cursor-pointer ${
                    index !== table.getRowModel().rows.length - 1
                      ? "border-b border-border/60"
                      : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { td?: string }
                      | undefined;
                    return (
                      <TableCell
                        key={cell.id}
                        className={meta?.td || "px-4 py-4"}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

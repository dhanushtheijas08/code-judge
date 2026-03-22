import { Skeleton } from "@/components/ui/skeleton";

export const LeftPanelSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-52" />
    </div>
    <div className="flex flex-wrap items-center gap-2.5">
      <Skeleton className="h-7 w-20 rounded-none" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-7 w-28" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[94%]" />
      <Skeleton className="h-4 w-[88%]" />
      <Skeleton className="h-4 w-[76%]" />
    </div>
    <Skeleton className="h-28 w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[84%]" />
    </div>
  </div>
);

export const EditorPanelSkeleton = () => (
  <div className="flex-1 flex flex-col bg-card rounded-lg border border-border overflow-hidden min-h-[300px]">
    <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
      <Skeleton className="h-7 w-28" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-7 w-7" />
        <Skeleton className="h-7 w-7" />
      </div>
    </div>
    <div className="flex-1 p-4 space-y-3 bg-card">
      <Skeleton className="h-4 w-[96%]" />
      <Skeleton className="h-4 w-[88%]" />
      <Skeleton className="h-4 w-[92%]" />
      <Skeleton className="h-4 w-[74%]" />
      <Skeleton className="h-4 w-[86%]" />
      <Skeleton className="h-4 w-[68%]" />
      <Skeleton className="h-4 w-[81%]" />
      <Skeleton className="h-4 w-[58%]" />
      <Skeleton className="h-4 w-[86%]" />
      <Skeleton className="h-4 w-[68%]" />
      <Skeleton className="h-4 w-[81%]" />
      <Skeleton className="h-4 w-[68%]" />
    </div>
  </div>
);

export const TestCasesPanelSkeleton = () => (
  <div className="h-[280px] lg:h-[300px] flex flex-col bg-card rounded-lg border border-border overflow-hidden shrink-0">
    <div className="flex items-center px-2 py-2 bg-card border-b border-border gap-2">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-8 w-28" />
    </div>
    <div className="flex-1 p-5 space-y-5">
      <div className="flex space-x-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

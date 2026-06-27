import { portfolio } from "@/data";
import { Skeleton } from "@/components/ui/skeleton";
import { CP_CHART_ROW, SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";

const ROW_COUNT = portfolio.achievements.length;

export function CpTableSkeleton() {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-md border border-border bg-card",
        SURFACE_ELEVATED,
      )}
      aria-busy
      aria-label="Loading coding stats"
    >
      <div className="border-b border-border bg-accent/30 px-4 py-2">
        <div className="flex gap-8">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex-1 divide-y divide-border">
        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <div key={i} className="flex h-14 items-center gap-4 px-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="ml-auto h-3 w-14" />
            <Skeleton className="h-3 w-28" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CpProblemsSkeleton() {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-md border border-border bg-card",
        SURFACE_ELEVATED,
      )}
      aria-busy
      aria-label="Loading problems chart"
    >
      <div className="border-b border-border px-4 py-2.5">
        <Skeleton className="h-3 w-20" />
      </div>
      <div className={cn(CP_CHART_ROW, "flex-1")}>
        <div className="flex flex-1 items-center justify-center px-4 py-6 sm:w-[65%]">
          <Skeleton className="aspect-square h-[220px] w-[220px] rounded-full sm:h-[268px] sm:w-[268px]" />
        </div>
        <div className="w-full space-y-3 border-t border-border p-3 sm:w-[35%] sm:border-t-0 sm:border-l">
          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-2.5 w-8" />
                </div>
                <Skeleton className="h-1 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CpTopicsSkeleton() {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-md border border-border bg-card",
        SURFACE_ELEVATED,
      )}
      aria-busy
      aria-label="Loading topics chart"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>
      <div className="flex flex-1 items-end gap-2 px-4 pb-4 pt-6">
        {[48, 72, 56, 88, 40, 64, 52, 76].map((h, i) => (
          <Skeleton
            key={i}
            className="w-8 shrink-0 rounded-t-sm"
            style={{ height: `${h}%`, maxHeight: "12rem" }}
          />
        ))}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export type CpDataSource = "live" | "snapshot" | "static";

interface CpDataSourceIndicatorProps {
  source: CpDataSource;
  loading?: boolean;
  className?: string;
}

export function CpDataSourceIndicator({
  source,
  loading,
  className,
}: CpDataSourceIndicatorProps) {
  if (loading) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
          className,
        )}
        aria-label="Loading stats"
      >
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-muted-foreground/70" />
        Loading
      </span>
    );
  }

  if (source === "live") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400",
          className,
        )}
        aria-label="Live data from Codolio"
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Live
      </span>
    );
  }

  if (source === "snapshot") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
          className,
        )}
        aria-label="Cached Codolio snapshot"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/70" />
        Cached
      </span>
    );
  }

  return null;
}

/** @deprecated Use CpDataSourceIndicator */
export function CpLiveIndicator({
  show,
  className,
}: {
  show?: boolean;
  className?: string;
}) {
  return (
    <CpDataSourceIndicator
      source={show ? "live" : "static"}
      className={className}
    />
  );
}

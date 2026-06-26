import { cn } from "@/lib/utils";

interface CpLiveIndicatorProps {
  show?: boolean;
  className?: string;
}

export function CpLiveIndicator({ show, className }: CpLiveIndicatorProps) {
  if (!show) return null;

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

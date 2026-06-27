import { portfolio } from "@/data";
import type { CalMeetingLink } from "@/types/portfolio";
import { useTimeOnSitePulse } from "@/hooks/useTimeOnSitePulse";
import { CAL_MODAL_CONFIG_JSON } from "@/lib/cal";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

const DEFAULT_MEETING_ID = "15min";
const LABEL = "15 min call";

function getDefaultMeeting(): CalMeetingLink | undefined {
  return (
    portfolio.site.calLinks.find((m) => m.id === DEFAULT_MEETING_ID) ??
    portfolio.site.calLinks[0]
  );
}

export const calBookingSurfaceClass =
  "border-emerald-400/60 bg-gradient-to-br from-emerald-50 to-teal-100 dark:border-emerald-500/50 dark:from-emerald-600 dark:to-teal-600";

export const calBookingHoverClass =
  "transition-all hover:brightness-105 hover:shadow-md dark:hover:brightness-110";

interface CalBookingButtonProps {
  layout?: "inline" | "full" | "card";
  className?: string;
}

export function CalBookingButton({
  layout = "inline",
  className,
}: CalBookingButtonProps) {
  const meeting = getDefaultMeeting();
  const shouldPulse = useTimeOnSitePulse();
  if (!meeting) return null;

  const pulseClass = shouldPulse ? "animate-cal-easter-pulse" : "";

  const calProps = {
    type: "button" as const,
    "data-cal-namespace": meeting.id,
    "data-cal-link": meeting.link,
    "data-cal-config": CAL_MODAL_CONFIG_JSON,
    "data-cursor-hint": "Schedule a 15 min call",
  };

  if (layout === "card") {
    return (
      <button
        {...calProps}
        className={cn(
          "group flex w-full items-center gap-3 rounded-md border p-3 text-left shadow-sm",
          calBookingSurfaceClass,
          calBookingHoverClass,
          pulseClass,
          className,
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            "bg-black/5 dark:bg-white/15",
          )}
        >
          <Calendar className="h-4 w-4 text-black dark:text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-black/60 dark:text-emerald-100/90">
            Schedule
          </p>
          <p className="truncate text-sm font-semibold text-black dark:text-white">
            {LABEL}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      {...calProps}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border text-sm font-semibold shadow-sm",
        calBookingSurfaceClass,
        calBookingHoverClass,
        pulseClass,
        "text-black dark:text-white",
        layout === "full" ? "h-9 w-full justify-start px-3" : "h-9 px-4",
        className,
      )}
    >
      <Calendar className="h-4 w-4 shrink-0" />
      {LABEL}
    </button>
  );
}

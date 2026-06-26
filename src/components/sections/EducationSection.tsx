import { useEffect, useMemo, useRef, useState } from "react";
import { portfolio } from "@/data";
import type { EducationItem } from "@/types/portfolio";
import {
  BIRTHDATE_FRACTION,
  getCurrentYearFraction,
  getDefaultScrollLeft,
  getFullTimelineBounds,
  getMarkerPosition,
  getRowCount,
  getYearMarkersPx,
  layoutEducationTimelinePx,
} from "@/lib/education-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
} from "@/components/notion/NotionBlock";
import { NotionPropertyTable } from "@/components/notion/NotionPropertyTable";
import type { NotionPropertyRow } from "@/components/notion/NotionPropertyTable";
import { FadeIn } from "@/components/notion/FadeIn";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 38;
const HEADER_HEIGHT = 36;
const TIMELINE_BOTTOM_PAD = 8;
const TABLE_HEADER_HEIGHT = 32;
const TABLE_ROW_HEIGHT = 36;
const PX_PER_YEAR = 72;
const CANVAS_PADDING = 20;

type ViewMode = "gantt" | "table";

const VIEW_LABELS: Record<ViewMode, string> = {
  gantt: "Gantt",
  table: "Table",
};

const STATUS_STYLES = {
  completed:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  "in-progress":
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
} as const;

function periodLabel(edu: EducationItem) {
  if (edu.period) return edu.period;
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleString("en", {
      month: "short",
      year: "numeric",
    });
  };
  return `${fmt(edu.startDate)} – ${fmt(edu.endDate)}`;
}

function EducationDetail({ edu }: { edu: EducationItem }) {
  const rows: NotionPropertyRow[] = [
    { label: "Institution", value: edu.institution },
    { label: "Degree", value: edu.degree },
    { label: "Period", value: periodLabel(edu) },
    ...(edu.location ? [{ label: "Location", value: edu.location }] : []),
    { label: edu.marksLabel ?? "Marks", value: edu.marks },
    ...(edu.rank ? [{ label: "Rank", value: edu.rank }] : []),
    {
      label: "Status",
      value: (
        <Badge
          variant="outline"
          className={cn("border", STATUS_STYLES[edu.status])}
        >
          {edu.statusLabel}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{edu.pageIcon}</span>
        <h2 className="text-xl font-bold">{edu.shortTitle}</h2>
      </div>

      <NotionPropertyTable rows={rows} />

      <div>
        <NotionSubheading>Description</NotionSubheading>
        <p className="text-sm leading-relaxed text-foreground/90">
          {edu.description}
        </p>
      </div>

      <div>
        <NotionSubheading>Highlights</NotionSubheading>
        <ul className="space-y-2 text-sm leading-relaxed">
          {edu.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function EducationSection() {
  const [view, setView] = useState<ViewMode>("gantt");
  const [selected, setSelected] = useState<EducationItem | null>(null);
  const [atBirthLimit, setAtBirthLimit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const timeline = useMemo(() => {
    const bounds = getFullTimelineBounds();
    const contentWidth = bounds.span * PX_PER_YEAR;
    const canvasWidth = contentWidth + CANVAS_PADDING * 2;
    const layouts = layoutEducationTimelinePx(
      portfolio.education,
      bounds,
      contentWidth,
      CANVAS_PADDING,
    );
    const markers = getYearMarkersPx(bounds, contentWidth, CANVAS_PADDING);
    const todayPx = getMarkerPosition(
      getCurrentYearFraction(),
      bounds,
      contentWidth,
      CANVAS_PADDING,
    );
    const birthPx = getMarkerPosition(
      BIRTHDATE_FRACTION,
      bounds,
      contentWidth,
      CANVAS_PADDING,
    );
    const rowCount = getRowCount(layouts);
    const timelineHeight =
      HEADER_HEIGHT + rowCount * ROW_HEIGHT + TIMELINE_BOTTOM_PAD;
    const tableHeight =
      TABLE_HEADER_HEIGHT + portfolio.education.length * TABLE_ROW_HEIGHT;
    const contentAreaHeight = Math.max(timelineHeight, tableHeight);
    return {
      bounds,
      canvasWidth,
      layouts,
      markers,
      todayPx,
      birthPx,
      rowCount,
      timelineHeight,
      tableHeight,
      contentAreaHeight,
    };
  }, []);

  const applyDefaultScroll = (behavior: ScrollBehavior = "auto") => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return false;

    const left = getDefaultScrollLeft(
      timeline.canvasWidth,
      el.clientWidth,
      timeline.bounds,
      CANVAS_PADDING,
    );

    if (behavior === "auto") {
      el.scrollLeft = left;
    } else {
      el.scrollTo({ left, behavior });
    }

    setAtBirthLimit(left <= 8);
    return true;
  };

  const scrollToDefault = () => {
    applyDefaultScroll("smooth");
  };

  useEffect(() => {
    if (view !== "gantt") return;

    if (applyDefaultScroll()) return;

    const frame = requestAnimationFrame(() => {
      applyDefaultScroll();
    });

    return () => cancelAnimationFrame(frame);
  }, [view, timeline.canvasWidth, timeline.bounds]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBirthLimit(el.scrollLeft <= 8);
  };

  return (
    <FadeIn>
      <section id="education" className="scroll-mt-8 pt-12">
        <NotionBlock>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <NotionHeading>Education</NotionHeading>
            <div className="flex items-center gap-2">
              <Button
                variant="notion"
                size="sm"
                onClick={scrollToDefault}
                data-cursor-hint="Jump to today"
                className={cn(
                  view !== "gantt" && "pointer-events-none invisible",
                )}
              >
                Today
              </Button>
              <div className="flex rounded-md border border-border p-0.5 text-xs">
                {(["gantt", "table"] as ViewMode[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    data-cursor-hint={`Switch to ${VIEW_LABELS[v]} view`}
                    className={cn(
                      "rounded px-2.5 py-1 transition-colors",
                      view === v
                        ? "bg-notion-hover font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {VIEW_LABELS[v]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Database · {VIEW_LABELS[view]} view
          </p>
        </NotionBlock>

        <div
          className="mt-4 flex flex-col"
          style={{ minHeight: timeline.contentAreaHeight + 28 }}
        >
          <div style={{ height: timeline.contentAreaHeight }}>
            {view === "gantt" ? (
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="w-full overflow-x-auto overflow-y-hidden rounded-lg border border-border bg-card scroll-smooth"
                style={{ height: timeline.timelineHeight }}
              >
                <div
                  className="relative"
                  style={{
                    width: timeline.canvasWidth,
                    height: timeline.timelineHeight,
                  }}
                >
                  {/* Year header */}
                  <div
                    className="relative border-b border-border bg-card"
                    style={{ height: HEADER_HEIGHT }}
                  >
                    {timeline.markers.map((m, i) => (
                      <div
                        key={m.label}
                        className="absolute top-0 flex h-full items-end pb-2"
                        style={{
                          left: m.leftPx,
                          transform:
                            i === 0
                              ? "translateX(0)"
                              : i === timeline.markers.length - 1
                                ? "translateX(-100%)"
                                : "translateX(-50%)",
                        }}
                      >
                        <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Grid lines */}
                  {timeline.markers.map((m) => (
                    <div
                      key={`grid-${m.label}`}
                      className="absolute top-0 bottom-0 w-px bg-border/80"
                      style={{ left: m.leftPx }}
                    />
                  ))}

                  {/* Birth marker */}
                  {timeline.birthPx !== null && (
                    <div
                      className="absolute top-0 bottom-0 z-10 w-0.5 bg-pink-400"
                      style={{ left: timeline.birthPx }}
                      title="Jul 12, 2000"
                    >
                      <div className="absolute -left-2 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-400 text-[10px]">
                        🎂
                      </div>
                    </div>
                  )}

                  {/* Today marker */}
                  {timeline.todayPx !== null && (
                    <div
                      className="absolute top-0 bottom-0 z-10 w-0.5 bg-red-500"
                      style={{ left: timeline.todayPx }}
                    >
                      <div className="absolute -left-2 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {new Date().getDate()}
                      </div>
                    </div>
                  )}

                  {/* Education bars */}
                  {portfolio.education.map((edu) => {
                    const layout = timeline.layouts.get(edu.id);
                    if (!layout) return null;

                    return (
                      <button
                        key={edu.id}
                        type="button"
                        onClick={() => setSelected(edu)}
                        data-cursor-hint="Open education details"
                        className="absolute z-[5] flex items-center gap-1.5 overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-left shadow-sm transition-all hover:z-10 hover:border-primary/40 hover:shadow-md"
                        style={{
                          left: layout.leftPx,
                          width: layout.widthPx,
                          top: HEADER_HEIGHT + layout.row * ROW_HEIGHT + 4,
                          height: ROW_HEIGHT - 8,
                        }}
                      >
                        <span className="shrink-0 text-base leading-none">
                          {edu.pageIcon}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs font-medium">
                          {edu.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <div className="grid grid-cols-[minmax(160px,2fr)_minmax(140px,1.5fr)_minmax(80px,0.8fr)] bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <span>Name</span>
                  <span>Degree</span>
                  <span>Marks</span>
                </div>
                {portfolio.education.map((edu) => (
                  <button
                    key={edu.id}
                    type="button"
                    onClick={() => setSelected(edu)}
                    data-cursor-hint="Open education details"
                    className="grid w-full grid-cols-[minmax(160px,2fr)_minmax(140px,1.5fr)_minmax(80px,0.8fr)] items-center gap-2 border-b border-border px-3 py-2 text-left text-sm transition-colors last:border-b-0 hover:bg-notion-hover"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-base leading-none">
                        {edu.pageIcon}
                      </span>
                      <span className="truncate">{edu.shortTitle}</span>
                    </span>
                    <span className="truncate text-muted-foreground">
                      {edu.degree}
                    </span>
                    <span className="truncate">{edu.marks}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p
            className={cn(
              "mt-2 h-7 text-center text-xs text-muted-foreground",
              !(view === "gantt" && atBirthLimit) && "invisible",
            )}
          >
            🎂 Jul 12, 2000 — as far back as the timeline goes. Happy birthday,
            Sahil!
          </p>
        </div>

        <Sheet
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <SheetContent className="overflow-y-auto sm:max-w-lg">
            <p className="mb-4 text-xs text-muted-foreground">
              Workspace / Education / {selected ? selected.shortTitle : ""}
            </p>
            {selected && <EducationDetail edu={selected} />}
          </SheetContent>
        </Sheet>
      </section>
    </FadeIn>
  );
}

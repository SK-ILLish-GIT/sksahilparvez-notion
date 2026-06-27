import { useLayoutEffect, useRef, useState } from "react";
import { portfolio } from "@/data";
import type { ExperienceItem } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
} from "@/components/notion/NotionBlock";
import { NotionPropertyTable } from "@/components/notion/NotionPropertyTable";
import type { NotionPropertyRow } from "@/components/notion/NotionPropertyTable";
import { FadeIn } from "@/components/notion/FadeIn";
import { SECTION_SCROLL_MT } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

type ViewMode = "timeline" | "table";

const VIEW_LABELS: Record<ViewMode, string> = {
  timeline: "Timeline",
  table: "Table",
};

const TABLE_STACK_MAX_HEIGHT = 44;
const EXPERIENCE_TABLE_GRID =
  "grid-cols-[minmax(7rem,0.85fr)_minmax(10.5rem,1.4fr)_minmax(0,1fr)]";

function CompanyLogo({
  item,
  size = "md",
}: {
  item: ExperienceItem;
  size?: "sm" | "md" | "lg";
}) {
  const boxClass =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-10 w-10";

  if (item.logo) {
    return (
      <span
        className={cn(
          boxClass,
          "flex shrink-0 items-center justify-center rounded-md border border-border bg-white p-1 dark:bg-background",
        )}
      >
        <img
          src={item.logo}
          alt={`${item.company} logo`}
          className="max-h-[88%] max-w-[88%] object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        boxClass,
        "flex shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 leading-none",
        size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg",
      )}
    >
      💼
    </span>
  );
}

function ExperienceDetail({ item }: { item: ExperienceItem }) {
  const rows: NotionPropertyRow[] = [
    { label: "Company", value: item.company },
    { label: "Role", value: item.role },
    { label: "Period", value: item.period },
    { label: "Location", value: item.location },
    ...(item.credential
      ? [
          {
            label: item.credential.label,
            value: (
              <a
                href={item.credential.href}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-primary hover:underline"
              >
                {item.credential.href.replace(/^https?:\/\//, "")}
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <CompanyLogo item={item} size="lg" />
        <h2 className="text-xl font-bold">{item.company}</h2>
      </div>

      <NotionPropertyTable rows={rows} />

      <div>
        <NotionSubheading>Description</NotionSubheading>
        <p className="text-sm leading-relaxed text-foreground/90">
          {item.description}
        </p>
      </div>

      <div>
        <NotionSubheading>Stack</NotionSubheading>
        <div className="flex flex-wrap gap-1.5">
          {item.stack.map((s) => (
            <Badge key={s} variant="tag">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <NotionSubheading>Highlights</NotionSubheading>
        <ul className="space-y-2 text-sm leading-relaxed">
          {item.highlights.map((h) => (
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

function TimelineView({
  onSelect,
}: {
  onSelect: (item: ExperienceItem) => void;
}) {
  return (
    <div className="space-y-0">
      {portfolio.experience.map((item, i) => (
        <div
          key={item.id}
          className="group relative border-l-2 border-primary/30 pl-6"
        >
          <div className="absolute -left-[5px] top-4 h-2 w-2 rounded-full bg-primary" />

          <button
            type="button"
            onClick={() => onSelect(item)}
            data-cursor-hint="Open experience details"
            className="mb-3 w-full rounded-md border border-border bg-card p-4 text-left transition-colors hover:bg-notion-hover"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <CompanyLogo item={item} size="md" />
                <div>
                  <p className="font-semibold">{item.company}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{item.period}</p>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {item.location}
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.stack.slice(0, 4).map((s) => (
                <Badge key={s} variant="tag" className="text-[10px]">
                  {s}
                </Badge>
              ))}
            </div>
          </button>

          {i < portfolio.experience.length - 1 && (
            <div className="absolute left-0 top-8 h-full w-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}

function StackBadges({
  stack,
  maxHeight = TABLE_STACK_MAX_HEIGHT,
}: {
  stack: string[];
  maxHeight?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState(stack.length);
  const stackKey = stack.join("\0");

  useLayoutEffect(() => {
    setVisibleCount(stack.length);
  }, [stackKey, stack.length]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const overflows = () =>
      el.scrollHeight > el.clientHeight + 1 ||
      el.scrollWidth > el.clientWidth + 1;

    if (overflows() && visibleCount > 0) {
      setVisibleCount((count) => count - 1);
    }
  }, [visibleCount, stackKey]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setVisibleCount(stack.length);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [stackKey, stack.length]);

  if (stack.length === 0) return null;

  const hiddenCount = stack.length - visibleCount;

  return (
    <span
      ref={containerRef}
      className="flex min-w-0 flex-wrap content-start items-center gap-1 overflow-hidden"
      style={{ maxHeight }}
    >
      {stack.slice(0, visibleCount).map((s) => (
        <Badge key={s} variant="tag" className="shrink-0 text-[10px]">
          {s}
        </Badge>
      ))}
      {hiddenCount > 0 && (
        <Badge variant="tag" className="shrink-0 text-[10px]">
          +{hiddenCount}
        </Badge>
      )}
    </span>
  );
}

function TableView({ onSelect }: { onSelect: (item: ExperienceItem) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div
        className={cn(
          "grid bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground",
          EXPERIENCE_TABLE_GRID,
        )}
      >
        <span>Company</span>
        <span>Role</span>
        <span>Stack</span>
      </div>
      {portfolio.experience.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          data-cursor-hint="Open experience details"
          className={cn(
            "grid min-h-[4.75rem] items-center gap-3 border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-notion-hover",
            EXPERIENCE_TABLE_GRID,
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5 font-medium">
            <CompanyLogo item={item} size="md" />
            <span className="truncate">{item.company}</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm leading-snug text-muted-foreground">
              {item.role}
            </span>
            <span className="mt-0.5 block truncate text-xs leading-snug text-muted-foreground/80">
              {item.period}
            </span>
          </span>
          <StackBadges stack={item.stack} />
        </button>
      ))}
    </div>
  );
}

export function ExperienceSection() {
  const [view, setView] = useState<ViewMode>("timeline");
  const [selected, setSelected] = useState<ExperienceItem | null>(null);

  return (
    <FadeIn>
      <section id="experience" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <NotionHeading>Experience</NotionHeading>
            <div className="flex rounded-md border border-border p-0.5 text-xs">
              {(["timeline", "table"] as ViewMode[]).map((v) => (
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
          <p className="mt-1 text-xs text-muted-foreground">
            Database · {VIEW_LABELS[view]} view
          </p>
        </NotionBlock>

        <div className="mt-4 grid grid-cols-1 grid-rows-1">
          <div
            className={cn(
              "col-start-1 row-start-1 min-w-0",
              view !== "timeline" && "pointer-events-none invisible",
            )}
            aria-hidden={view !== "timeline"}
          >
            <TimelineView onSelect={setSelected} />
          </div>
          <div
            className={cn(
              "col-start-1 row-start-1 min-w-0",
              view !== "table" && "pointer-events-none invisible",
            )}
            aria-hidden={view !== "table"}
          >
            <TableView onSelect={setSelected} />
          </div>
        </div>

        <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <SheetContent className="overflow-y-auto sm:max-w-lg">
            <p className="mb-4 text-xs text-muted-foreground">
              Workspace / Experience / {selected?.company}
            </p>
            {selected && <ExperienceDetail item={selected} />}
          </SheetContent>
        </Sheet>
      </section>
    </FadeIn>
  );
}

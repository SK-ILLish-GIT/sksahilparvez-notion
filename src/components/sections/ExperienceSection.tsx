import { useLayoutEffect, useRef, useState } from "react";
import { portfolio } from "@/data";
import type { ExperienceItem } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NotionBlock, NotionHeading } from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

type ViewMode = "timeline" | "table";

const VIEW_LABELS: Record<ViewMode, string> = {
  timeline: "Timeline",
  table: "Table",
};

const TIMELINE_CARD_HEIGHT = 112;
const TIMELINE_CARD_MARGIN = 12;
const TABLE_HEADER_HEIGHT = 36;
const TABLE_ROW_HEIGHT = TIMELINE_CARD_HEIGHT;
const TABLE_STACK_MAX_HEIGHT = 56;

function getContentAreaHeight() {
  const timelineHeight =
    portfolio.experience.length * (TIMELINE_CARD_HEIGHT + TIMELINE_CARD_MARGIN);
  const tableHeight =
    TABLE_HEADER_HEIGHT + portfolio.experience.length * TABLE_ROW_HEIGHT;
  return Math.max(timelineHeight, tableHeight);
}

function ExperienceDetail({ item }: { item: ExperienceItem }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl">💼</span>
        <div>
          <h2 className="text-xl font-bold">{item.company}</h2>
          <p className="text-muted-foreground">{item.role}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.period} · {item.location}
          </p>
        </div>
      </div>

      {item.metric && (
        <div className="rounded-md border border-border bg-accent/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">{item.metric.label}</p>
          <p className="text-2xl font-bold text-primary">{item.metric.value}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {item.stack.map((s) => (
          <Badge key={s} variant="tag">
            {s}
          </Badge>
        ))}
      </div>

      <ul className="space-y-2 text-sm leading-relaxed">
        {item.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
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
              <div>
                <p className="font-semibold">{item.company}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
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
      <div className="grid grid-cols-3 bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground">
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
          className="grid grid-cols-3 items-start gap-3 border-b border-border px-4 py-4 text-left text-sm transition-colors last:border-b-0 hover:bg-notion-hover"
          style={{ minHeight: TABLE_ROW_HEIGHT }}
        >
          <span className="flex min-w-0 items-start gap-2 pt-0.5 font-medium">
            <span className="shrink-0 text-base leading-none">💼</span>
            <span className="truncate">{item.company}</span>
          </span>
          <span className="min-w-0">
            <span className="block leading-snug text-muted-foreground">
              {item.role}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
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
  const contentAreaHeight = getContentAreaHeight();

  return (
    <FadeIn>
      <section id="experience" className="scroll-mt-8 pt-12">
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

        <div className="mt-4" style={{ minHeight: contentAreaHeight }}>
          <div style={{ height: contentAreaHeight }}>
            {view === "timeline" && <TimelineView onSelect={setSelected} />}
            {view === "table" && <TableView onSelect={setSelected} />}
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

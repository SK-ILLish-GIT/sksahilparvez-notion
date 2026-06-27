import { useState } from "react";
import { portfolio } from "@/data";
import type { VolunteerItem } from "@/types/portfolio";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { NotionPropertyTable } from "@/components/notion/NotionPropertyTable";
import type { NotionPropertyRow } from "@/components/notion/NotionPropertyTable";
import { FadeIn } from "@/components/notion/FadeIn";
import { SECTION_SCROLL_MT } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function VolunteerDetail({ item }: { item: VolunteerItem }) {
  const rows: NotionPropertyRow[] = [
    { label: "Role", value: item.role },
    ...(item.period ? [{ label: "Period", value: item.period }] : []),
    { label: "Status", value: item.done ? "Done" : "To do" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{item.pageIcon}</span>
        <h2 className="text-xl font-bold">{item.title}</h2>
      </div>

      <NotionPropertyTable rows={rows} />

      <div>
        <NotionSubheading>Description</NotionSubheading>
        <p className="text-sm leading-relaxed text-foreground/90">
          {item.description}
        </p>
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

function TodoItem({
  item,
  onClick,
}: {
  item: VolunteerItem;
  onClick: () => void;
}) {
  return (
    <NotionBlock showHandle={false} className="px-0 py-0.5">
      <button
        type="button"
        onClick={onClick}
        data-cursor-hint="View volunteer details"
        className="flex w-full items-start gap-2.5 rounded-sm px-1 py-0.5 text-left transition-colors hover:bg-notion-hover"
      >
        <span
          className={cn(
            "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-emerald-500/70 bg-emerald-50 dark:bg-emerald-950/30",
            !item.done && "border-border bg-background",
          )}
          aria-hidden
        >
          {item.done && (
            <Check
              className="h-3 w-3 text-emerald-600 dark:text-emerald-400"
              strokeWidth={3}
            />
          )}
        </span>
        <p
          className={cn(
            "text-sm leading-relaxed",
            item.done &&
              "text-muted-foreground line-through decoration-muted-foreground/50",
          )}
        >
          {item.text}
        </p>
      </button>
    </NotionBlock>
  );
}

export function VolunteerSection() {
  const [selected, setSelected] = useState<VolunteerItem | null>(null);

  return (
    <FadeIn>
      <section id="volunteer" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Volunteer</NotionHeading>
          <SectionMeta label="List" />
        </NotionBlock>

        <div className="mt-2 space-y-0.5">
          {portfolio.volunteer.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onClick={() => setSelected(item)}
            />
          ))}
        </div>

        <Sheet
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <SheetContent className="overflow-y-auto sm:max-w-lg">
            <p className="mb-4 text-xs text-muted-foreground">
              Workspace / Volunteer / {selected?.title}
            </p>
            {selected && <VolunteerDetail item={selected} />}
          </SheetContent>
        </Sheet>
      </section>
    </FadeIn>
  );
}

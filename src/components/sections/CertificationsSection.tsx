import { useState, type ReactNode } from "react";
import { portfolio } from "@/data";
import type { Certification, CertificationStatus } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BookmarkBlock } from "@/components/notion/BookmarkBlock";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { cn } from "@/lib/utils";
import { Check, Circle, CircleDashed } from "lucide-react";

const STATUS_LABELS: Record<CertificationStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

const COLUMNS: {
  status: CertificationStatus;
  label: string;
  icon: ReactNode;
  headerClass: string;
}[] = [
  {
    status: "todo",
    label: "To do",
    icon: <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />,
    headerClass: "text-muted-foreground",
  },
  {
    status: "in-progress",
    label: "In progress",
    icon: <Circle className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />,
    headerClass: "text-amber-600 dark:text-amber-400",
  },
  {
    status: "done",
    label: "Done",
    icon: (
      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
    ),
    headerClass: "text-emerald-600 dark:text-emerald-400",
  },
];

function CertificationDetail({ cert }: { cert: Certification }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{cert.pageIcon}</span>
        <div>
          <h2 className="text-xl font-bold">{cert.title}</h2>
          <p className="text-muted-foreground">{cert.issuer}</p>
          {cert.period && (
            <p className="mt-1 text-sm text-muted-foreground">{cert.period}</p>
          )}
        </div>
      </div>

      <Badge
        variant={
          cert.status === "done"
            ? "status"
            : cert.status === "in-progress"
              ? "outline"
              : "default"
        }
        className={cn(
          cert.status === "in-progress" &&
            "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
        )}
      >
        {STATUS_LABELS[cert.status]}
      </Badge>

      <p className="text-sm leading-relaxed text-foreground/90">
        {cert.description}
      </p>

      <div>
        <NotionSubheading>Highlights</NotionSubheading>
        <ul className="space-y-2 text-sm leading-relaxed">
          {cert.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {cert.link && (
        <BookmarkBlock href={cert.link} label="Credential" value={cert.link} />
      )}
    </div>
  );
}

function CertCard({
  cert,
  onClick,
}: {
  cert: Certification;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor-hint="View certification details"
      className={cn(
        "w-full rounded-md border border-border bg-background px-3 py-2.5 text-left text-sm leading-relaxed shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-notion-hover hover:shadow-md",
        cert.status === "done" && "text-muted-foreground",
      )}
    >
      {cert.text}
    </button>
  );
}

export function CertificationsSection() {
  const [selected, setSelected] = useState<Certification | null>(null);

  const certsByStatus = (status: CertificationStatus) =>
    portfolio.certifications.filter((c) => c.status === status);

  return (
    <FadeIn>
      <section id="certifications" className="scroll-mt-8 pt-12">
        <NotionBlock>
          <NotionHeading>Certifications</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">
            Database · Board view
          </p>
        </NotionBlock>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = certsByStatus(col.status);
            return (
              <div
                key={col.status}
                className="flex min-h-[120px] flex-col rounded-lg border border-border bg-card"
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <p
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wide",
                        col.headerClass,
                      )}
                    >
                      {col.label}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-2">
                  {items.length > 0 ? (
                    items.map((cert) => (
                      <CertCard
                        key={cert.id}
                        cert={cert}
                        onClick={() => setSelected(cert)}
                      />
                    ))
                  ) : (
                    <p className="px-1 py-4 text-center text-xs text-muted-foreground">
                      No items
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Sheet
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <SheetContent className="overflow-y-auto sm:max-w-lg">
            <p className="mb-4 text-xs text-muted-foreground">
              Workspace / Certifications / {selected?.title}
            </p>
            {selected && <CertificationDetail cert={selected} />}
          </SheetContent>
        </Sheet>
      </section>
    </FadeIn>
  );
}

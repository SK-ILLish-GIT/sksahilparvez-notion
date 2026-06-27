import { useMemo, useState, type ReactNode } from "react";
import { portfolio } from "@/data";
import type { Certification, CertificationStatus } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
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
import {
  CERT_CARD_MOBILE,
  CERTS_CAROUSEL,
  CERTS_SCROLL,
  SECTION_SCROLL_MT,
  SURFACE_ELEVATED,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Check, Circle, CircleDashed, ExternalLink } from "lucide-react";

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
  columnClass: string;
  headerBgClass: string;
}[] = [
  {
    status: "todo",
    label: "To do",
    icon: <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />,
    headerClass: "text-muted-foreground",
    columnClass: "bg-muted/10",
    headerBgClass: "bg-muted/25",
  },
  {
    status: "in-progress",
    label: "In progress",
    icon: <Circle className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />,
    headerClass: "text-amber-600 dark:text-amber-400",
    columnClass: "bg-amber-50/40 dark:bg-amber-950/10",
    headerBgClass: "bg-amber-50/80 dark:bg-amber-950/25",
  },
  {
    status: "done",
    label: "Done",
    icon: (
      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
    ),
    headerClass: "text-emerald-600 dark:text-emerald-400",
    columnClass: "bg-emerald-50/40 dark:bg-emerald-950/10",
    headerBgClass: "bg-emerald-50/80 dark:bg-emerald-950/25",
  },
];

function periodBadgeClass(status: CertificationStatus): string {
  if (status === "in-progress") {
    return "border-amber-300/80 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300";
  }
  if (status === "done") {
    return "border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  return "";
}

function CertificationDetail({ cert }: { cert: Certification }) {
  const rows: NotionPropertyRow[] = [
    { label: "Issuer", value: cert.issuer },
    ...(cert.period ? [{ label: "Period", value: cert.period }] : []),
    {
      label: "Status",
      value: (
        <Badge
          variant={
            cert.status === "done"
              ? "status"
              : cert.status === "in-progress"
                ? "outline"
                : "default"
          }
          className={cn(periodBadgeClass(cert.status))}
        >
          {STATUS_LABELS[cert.status]}
        </Badge>
      ),
    },
    ...(cert.link
      ? [
          {
            label: "Credential",
            value: (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-primary hover:underline"
              >
                {cert.link.replace(/^https?:\/\//, "")}
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{cert.pageIcon}</span>
        <h2 className="text-xl font-bold">{cert.title}</h2>
      </div>

      <NotionPropertyTable rows={rows} />

      <div>
        <NotionSubheading>Description</NotionSubheading>
        <p className="text-sm leading-relaxed text-foreground/90">
          {cert.description}
        </p>
      </div>

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
        "group w-full rounded-md border border-border bg-background px-3 py-2.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-notion-hover hover:shadow-md",
        "border-l-[3px]",
        cert.status === "todo" && "border-l-muted-foreground/40",
        cert.status === "in-progress" && "border-l-amber-400",
        cert.status === "done" && "border-l-emerald-500",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-lg leading-none" aria-hidden>
          {cert.pageIcon}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium leading-snug",
              cert.status === "done" && "text-foreground/80",
            )}
          >
            {cert.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{cert.issuer}</p>
          {cert.link && (
            <span className="mt-2 inline-flex items-center gap-0.5 text-[10px] text-primary">
              <ExternalLink className="h-3 w-3" />
              Credential
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function CertFillerCard({ status }: { status: CertificationStatus }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none select-none rounded-md border border-dashed border-border bg-card px-3 py-2.5",
        "border-l-[3px]",
        status === "todo" && "border-l-muted-foreground/30",
        status === "in-progress" && "border-l-amber-400/40",
        status === "done" && "border-l-emerald-500/40",
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="h-5 w-5 shrink-0 rounded bg-muted/30" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-2.5 w-full max-w-[90%] rounded-full bg-muted/30" />
          <div className="h-2 w-full max-w-[60%] rounded-full bg-muted/20" />
        </div>
      </div>
    </div>
  );
}

function boardGridClass(columnCount: number): string {
  if (columnCount === 1) return "sm:grid-cols-1";
  if (columnCount === 2) return "sm:grid-cols-2";
  return "sm:grid-cols-3";
}

export function CertificationsSection() {
  const [selected, setSelected] = useState<Certification | null>(null);

  const certsByStatus = (status: CertificationStatus) =>
    portfolio.certifications.filter((c) => c.status === status);

  const boardColumns = useMemo(
    () =>
      COLUMNS.filter(
        (col) => col.status === "todo" || certsByStatus(col.status).length > 0,
      ),
    [],
  );

  return (
    <FadeIn>
      <section id="certifications" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Certifications</NotionHeading>
          <SectionMeta label="Board" />
        </NotionBlock>

        <div
          className={cn(
            "mt-4 overflow-hidden rounded-lg border border-border bg-card",
            SURFACE_ELEVATED,
          )}
        >
          <div className={CERTS_SCROLL}>
            <div
              className={cn(
                CERTS_CAROUSEL,
                boardGridClass(boardColumns.length),
              )}
            >
              {boardColumns.map((col, index) => {
                const items = certsByStatus(col.status);
                const isLast = index === boardColumns.length - 1;
                return (
                  <div
                    key={col.status}
                    className={cn(
                      CERT_CARD_MOBILE,
                      !isLast && "border-r border-border",
                      col.columnClass,
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-between border-b border-border px-3 py-2",
                        col.headerBgClass,
                      )}
                    >
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
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-[10px] tabular-nums"
                      >
                        {items.length}
                      </Badge>
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
                        <CertFillerCard status={col.status} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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

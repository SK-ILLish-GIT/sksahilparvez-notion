import { useState } from "react";
import type { CpTableRow } from "@/types/portfolio";
import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { CpProblemsChart } from "@/components/sections/CpProblemsChart";
import { CpTopicsChart } from "@/components/sections/CpTopicsChart";
import { Badge } from "@/components/ui/badge";
import { useCodolioStats } from "@/hooks/useCodolioStats";
import { SECTION_SCROLL_MT, SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type ViewMode = "table" | "problems" | "topics";

const VIEW_LABELS: Record<ViewMode, string> = {
  table: "Table",
  problems: "Problems",
  topics: "Topics",
};

/** Shared content height so Table / Problems / Topics don't shift layout */
const CP_VIEW_HEIGHT = 320;

function PlatformLogo({ logo, platform }: { logo?: string; platform: string }) {
  if (!logo) return null;

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white p-1 dark:bg-background">
      <img
        src={logo}
        alt={`${platform} logo`}
        className="max-h-[88%] max-w-[88%] object-contain"
      />
    </span>
  );
}

function TableView({
  rows,
  loading,
}: {
  rows: CpTableRow[];
  loading: boolean;
}) {
  return (
    <div
      className={cn(
        "h-full overflow-x-auto overflow-y-hidden rounded-md border border-border bg-card",
        SURFACE_ELEVATED,
      )}
    >
      <table className="w-full min-w-[640px] table-fixed text-sm">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[13%]" />
          <col className="w-[28%]" />
          <col className="w-[35%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-accent/30 text-left text-xs text-muted-foreground">
            <th className="px-4 py-2 font-medium">Platform</th>
            <th className="px-4 py-2 font-medium">Rating</th>
            <th className="px-4 py-2 font-medium">Handle</th>
            <th className="px-4 py-2 font-medium">Best Ranks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.platform}
              className="h-14 border-b border-border last:border-0 transition-colors hover:bg-notion-hover"
            >
              <td className="px-4 align-middle">
                <div className="flex items-center gap-2 font-medium">
                  <PlatformLogo logo={row.logo} platform={row.platform} />
                  <span>{row.platform}</span>
                </div>
              </td>
              <td
                className={cn(
                  "px-4 align-middle",
                  loading && row.isLive && "text-muted-foreground",
                )}
              >
                {row.rating}
              </td>
              <td className="px-4 align-middle">
                <a
                  href={row.displayHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hint={`Open ${row.platform} profile`}
                  className={cn(
                    "group inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline",
                  )}
                >
                  {row.displayHandle}
                  <ExternalLink className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
                </a>
              </td>
              <td
                className={cn(
                  "px-4 align-middle",
                  loading && row.isLive && "opacity-70",
                )}
              >
                {row.bestRanks.length > 0 ? (
                  <div className="flex flex-wrap content-center gap-1">
                    {row.bestRanks.map((rank) => (
                      <Badge
                        key={rank}
                        variant="outline"
                        className="shrink-0 border-border bg-background text-[10px] tabular-nums"
                      >
                        #{rank.toLocaleString()}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AchievementsSection() {
  const [view, setView] = useState<ViewMode>("table");
  const { data, loading, source } = useCodolioStats();

  return (
    <FadeIn>
      <section id="achievements" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <NotionHeading>Coding</NotionHeading>
            <div className="flex rounded-md border border-border p-0.5 text-xs">
              {(["table", "problems", "topics"] as ViewMode[]).map((v) => (
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
          <SectionMeta label={VIEW_LABELS[view]} />
        </NotionBlock>

        <div
          className="mt-4 overflow-y-auto"
          style={{ height: CP_VIEW_HEIGHT }}
        >
          <div className="h-full min-h-0">
            {view === "table" && (
              <TableView rows={data.tableRows} loading={loading} />
            )}
            {view === "problems" && (
              <CpProblemsChart
                slices={data.problemBreakdown}
                totalProblems={data.totalProblems}
                loading={loading}
                dataSource={source}
                className="h-full"
              />
            )}
            {view === "topics" && (
              <CpTopicsChart
                sections={data.topicBreakdownByPlatform}
                loading={loading}
                dataSource={source}
                className="h-full"
              />
            )}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  aggregateStackedByPlatform,
  ALL_PLATFORMS_KEY,
  PLATFORM_CHART_COLORS,
} from "@/lib/cp-topic-categories";
import type { CpStackedTopicRow } from "@/lib/cp-topic-categories";
import type { CpTopicPlatformSection } from "@/types/portfolio";
import { SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CpDataSourceIndicator } from "@/components/sections/CpLiveIndicator";
import type { CpDataSource } from "@/components/sections/CpLiveIndicator";
import { ChevronDown, Table2 } from "lucide-react";

interface CpTopicsChartProps {
  sections: CpTopicPlatformSection[];
  dataSource?: CpDataSource;
  className?: string;
}

const BAR_WIDTH = 64;

function CategoryAxisTick(props: {
  x?: string | number;
  y?: string | number;
  payload?: { value: string };
}) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const lines = (props.payload?.value ?? "").split("\n");

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={line + i}
          x={0}
          y={0}
          dy={8 + i * 10}
          textAnchor="middle"
          fill="var(--muted-foreground, #888)"
          fontSize={10}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function StackedTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: { topic: string };
  }>;
}) {
  if (!active || !payload?.length) return null;

  const fullTopic = payload[0].payload.topic;
  const segments = payload
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const total = segments.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
      <p className="mb-1.5 font-medium">{fullTopic}</p>
      <ul className="space-y-1">
        {segments.map((seg) => (
          <li
            key={seg.name}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: seg.color }}
              />
              {seg.name}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {seg.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 border-t border-border pt-1.5 tabular-nums text-muted-foreground">
        Total: {total.toLocaleString()}
      </p>
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

function TopicHeatmap({
  data,
  platformKeys,
  compact = false,
}: {
  data: CpStackedTopicRow[];
  platformKeys: string[];
  compact?: boolean;
}) {
  const columnMax = useMemo(() => {
    const maxes: Record<string, number> = {};
    for (const platform of platformKeys) {
      maxes[platform] = Math.max(
        ...data.map((row) => Number(row[platform] ?? 0)),
        1,
      );
    }
    return maxes;
  }, [data, platformKeys]);

  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse",
          compact ? "text-[11px]" : "min-w-[520px] text-xs",
        )}
      >
        <thead>
          <tr>
            <th
              className={cn(
                "sticky left-0 z-10 bg-background px-2 py-2 text-left font-medium text-muted-foreground",
                !compact && "bg-accent/10 px-3",
              )}
            >
              Topic
            </th>
            {platformKeys.map((platform) => (
              <th
                key={platform}
                className="px-2 py-2 text-center font-medium text-muted-foreground"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{
                      backgroundColor:
                        PLATFORM_CHART_COLORS[platform] ?? "#64748b",
                    }}
                  />
                  {platform}
                </span>
              </th>
            ))}
            <th className="px-3 py-2 text-right font-medium text-muted-foreground">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.topic} className="border-t border-border/60">
              <td
                className={cn(
                  "sticky left-0 z-10 bg-background px-2 py-1.5 font-medium",
                  !compact && "bg-accent/10 px-3 py-2 whitespace-nowrap",
                )}
                title={row.topic}
              >
                {compact ? row.topic : row.shortLabel.replace("\n", " ")}
              </td>
              {platformKeys.map((platform) => {
                const count = Number(row[platform] ?? 0);
                const color = PLATFORM_CHART_COLORS[platform] ?? "#64748b";

                return (
                  <td key={platform} className="px-2 py-1.5 text-center">
                    <div
                      title={`${row.topic} · ${platform}: ${count}`}
                      className={cn(
                        "mx-auto flex items-center justify-center rounded-md tabular-nums",
                        compact
                          ? "h-7 min-w-[2rem] text-[10px]"
                          : "h-8 min-w-[2.5rem]",
                        count === 0 && "text-muted-foreground/40",
                      )}
                      style={
                        count > 0
                          ? {
                              backgroundColor: hexWithAlpha(
                                color,
                                0.12 + 0.88 * (count / columnMax[platform]),
                              ),
                            }
                          : undefined
                      }
                    >
                      {count > 0 ? count : "—"}
                    </div>
                  </td>
                );
              })}
              <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                {row.total.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CpTopicsChart({
  sections,
  dataSource = "static",
  className,
}: CpTopicsChartProps) {
  const [selectedKey, setSelectedKey] = useState(ALL_PLATFORMS_KEY);
  const [heatmapOpen, setHeatmapOpen] = useState(false);

  const topicSections = useMemo(
    () => sections.filter((s) => s.rawTopics.length > 0),
    [sections],
  );

  const options = useMemo(
    () => [
      { key: ALL_PLATFORMS_KEY, label: "All platforms" },
      ...topicSections.map((s) => ({ key: s.platform, label: s.platform })),
    ],
    [topicSections],
  );

  const { chartData, platformKeys } = useMemo(() => {
    const filteredSections =
      selectedKey === ALL_PLATFORMS_KEY
        ? topicSections
        : topicSections.filter((s) => s.platform === selectedKey);

    const { data, platformKeys: keys } =
      aggregateStackedByPlatform(filteredSections);

    return { chartData: data, platformKeys: keys };
  }, [topicSections, selectedKey]);

  const chartMinWidth = Math.max(chartData.length * BAR_WIDTH, 640);
  const selectedLabel =
    options.find((o) => o.key === selectedKey)?.label ?? "All platforms";

  return (
    <>
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-md border border-border bg-card dark:bg-accent/10",
          SURFACE_ELEVATED,
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
          <CpDataSourceIndicator source={dataSource} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHeatmapOpen(true)}
              disabled={chartData.length === 0}
              data-cursor-hint="Open topic heatmap in side panel"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-notion-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Table2 className="h-3.5 w-3.5" />
              Heatmap
            </button>
            <div className="relative">
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="appearance-none rounded-md border border-border bg-background py-1.5 pr-8 pl-3 text-sm font-medium transition-colors hover:bg-notion-hover focus:outline-none focus:ring-1 focus:ring-ring"
                aria-label="Select platform for topic chart"
              >
                {options.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 px-2 pt-1 pb-0">
          {chartData.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No topic breakdown available for this selection.
            </p>
          ) : (
            <div className="h-full overflow-x-auto overflow-y-hidden">
              <div className="h-full" style={{ minWidth: chartMinWidth }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
                    barCategoryGap="18%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      type="category"
                      dataKey="shortLabel"
                      tick={CategoryAxisTick}
                      height={38}
                      interval={0}
                      tickMargin={4}
                    />
                    <YAxis type="number" tick={{ fontSize: 11 }} width={40} />
                    <Tooltip content={<StackedTooltip />} />
                    {platformKeys.map((platform, index) => (
                      <Bar
                        key={platform}
                        dataKey={platform}
                        stackId="topic"
                        maxBarSize={52}
                        fill={PLATFORM_CHART_COLORS[platform] ?? "#64748b"}
                        radius={
                          index === platformKeys.length - 1
                            ? [4, 4, 0, 0]
                            : [0, 0, 0, 0]
                        }
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      <Sheet open={heatmapOpen} onOpenChange={setHeatmapOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          <p className="mb-1 text-xs text-muted-foreground">
            Workspace / Coding / Topic heatmap
          </p>
          <h3 className="mb-1 text-lg font-semibold">Topic heatmap</h3>
          <p className="mb-4 text-xs text-muted-foreground">{selectedLabel}</p>
          {chartData.length > 0 && (
            <TopicHeatmap
              data={chartData}
              platformKeys={platformKeys}
              compact
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

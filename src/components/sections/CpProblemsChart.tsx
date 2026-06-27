import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CpDataSourceIndicator } from "@/components/sections/CpLiveIndicator";
import type { CpDataSource } from "@/components/sections/CpLiveIndicator";
import type { CpProblemSlice } from "@/types/portfolio";
import { CP_CHART_ROW, SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface CpProblemsChartProps {
  slices: CpProblemSlice[];
  totalProblems: number;
  dataSource?: CpDataSource;
  className?: string;
}

type ActiveSlice = CpProblemSlice & {
  name: string;
  value: number;
  percent: number;
};

function PlatformLogo({ logo, platform }: { logo?: string; platform: string }) {
  if (!logo) {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-accent/40 text-[9px] font-semibold uppercase text-muted-foreground"
        aria-hidden
      >
        {platform.slice(0, 2)}
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white p-0.5 dark:bg-background">
      <img
        src={logo}
        alt=""
        className="max-h-[88%] max-w-[88%] object-contain"
      />
    </span>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ActiveSlice }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
      <p className="font-medium">{item.platform}</p>
      <p className="text-muted-foreground">
        {item.count.toLocaleString()} · {item.percent.toFixed(1)}%
      </p>
    </div>
  );
}

export function CpProblemsChart({
  slices,
  totalProblems,
  dataSource = "static",
  className,
}: CpProblemsChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const chartData = useMemo(() => {
    return [...slices]
      .sort((a, b) => b.count - a.count)
      .map((slice) => ({
        ...slice,
        name: slice.platform,
        value: slice.count,
        percent: totalProblems > 0 ? (slice.count / totalProblems) * 100 : 0,
      }));
  }, [slices, totalProblems]);

  return (
    <div
      className={cn(
        "relative min-h-0 overflow-y-auto rounded-md border border-border bg-card dark:bg-accent/10",
        SURFACE_ELEVATED,
        className,
      )}
    >
      <div className={CP_CHART_ROW}>
        <div className="relative flex shrink-0 items-center justify-center px-2 pt-3 pb-2 sm:w-[65%] sm:flex-1 sm:flex-none sm:pt-2">
          <CpDataSourceIndicator
            source={dataSource}
            className="absolute top-2 left-3 z-10"
          />
          <div className="relative mx-auto aspect-square h-[220px] w-[220px] sm:h-[268px] sm:w-[268px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="56%"
                  outerRadius="84%"
                  paddingAngle={3}
                  cornerRadius={5}
                  stroke="transparent"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.platform}
                      fill={entry.fill}
                      opacity={
                        activeIndex === undefined || activeIndex === index
                          ? 1
                          : 0.35
                      }
                      stroke={
                        activeIndex === index ? entry.fill : "transparent"
                      }
                      strokeWidth={activeIndex === index ? 2 : 0}
                      style={{ transition: "opacity 150ms ease" }}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(undefined)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center rounded-full px-4 py-2 text-center">
                <span className="text-4xl font-semibold tracking-tight tabular-nums">
                  {totalProblems.toLocaleString()}
                </span>
                <span className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                  problems
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-border sm:flex sm:h-full sm:w-[35%] sm:shrink-0 sm:flex-col sm:justify-center sm:border-t-0 sm:border-l">
          <ul className="flex flex-col justify-center gap-1 p-2 sm:px-3 sm:py-3">
            {chartData.map((slice, index) => (
              <li key={slice.platform}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(undefined)}
                  className={cn(
                    "w-full rounded-md px-2 py-1.5 text-left transition-colors",
                    activeIndex === index
                      ? "bg-notion-hover"
                      : "hover:bg-notion-hover/70",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <PlatformLogo logo={slice.logo} platform={slice.platform} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[10px] font-medium">
                          {slice.platform}
                        </span>
                        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                          {slice.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-border/60">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${slice.percent}%`,
                            backgroundColor: slice.fill,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

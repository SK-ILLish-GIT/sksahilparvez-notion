import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { portfolio } from "@/data";
import type { ProjectItem } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NotionBlock, NotionHeading } from "@/components/notion/NotionBlock";
import { NotionPropertyTable } from "@/components/notion/NotionPropertyTable";
import type { NotionPropertyRow } from "@/components/notion/NotionPropertyTable";
import { FadeIn } from "@/components/notion/FadeIn";
import {
  ProjectDetailsDoc,
  ProjectHighlights,
  ProjectStackAndLanguages,
  buildGithubPropertyRows,
} from "@/components/projects/ProjectDetailsBody";
import { useGithubProject } from "@/hooks/useGithubProject";
import { cn } from "@/lib/utils";
import {
  BENTO_WIDGET_SPAN,
  PROJECTS_BENTO_GRID,
  PROJECT_BENTO_SPAN,
} from "@/lib/layout";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SOCIAL_LOGOS } from "@/lib/social-logos";
import { ExternalLink, Star } from "lucide-react";

type BentoTileSize = "small" | "wide" | "tall";

const BENTO_GRID_CLASS: Record<ProjectItem["bentoSize"], string> = {
  large: PROJECT_BENTO_SPAN.large,
  wide: PROJECT_BENTO_SPAN.wide,
  tall: PROJECT_BENTO_SPAN.tall,
  small: PROJECT_BENTO_SPAN.small,
};

const TILE_SIZE_CLASS: Record<BentoTileSize, string> = BENTO_WIDGET_SPAN;

type BentoLayoutItem =
  | { type: "project"; id: string }
  | {
      type: "widget";
      id: string;
      widget: "stats" | "building";
      size: BentoTileSize;
    };

const BENTO_LAYOUT: BentoLayoutItem[] = [
  { type: "project", id: "coldmail" },
  { type: "project", id: "portfolio" },
  { type: "widget", id: "building", widget: "building", size: "tall" },
  { type: "project", id: "gamevault" },
  { type: "project", id: "pricetracker" },
  { type: "widget", id: "stats", widget: "stats", size: "wide" },
  { type: "project", id: "gametheory" },
  { type: "project", id: "file-organizer" },
  { type: "project", id: "mini-project" },
];

function isProjectInProgress(period: string) {
  return /present/i.test(period);
}

function projectStatus(period: string) {
  return isProjectInProgress(period) ? "In progress" : "Shipped";
}

function ProjectLinkButton({
  href,
  label,
  onClick,
  children,
}: {
  href: string;
  label: string;
  onClick: (event: MouseEvent) => void;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-background hover:text-primary"
    >
      {children}
    </a>
  );
}

function ProjectSubPage({ project }: { project: ProjectItem }) {
  const inProgress = isProjectInProgress(project.period);
  const { detailsMarkdown, repo, loading, detailsError, detailsSource } =
    useGithubProject(project.links.github);

  const rows: NotionPropertyRow[] = [
    { label: "Period", value: project.period },
    {
      label: "Status",
      value: (
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            inProgress
              ? "border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              : "border-emerald-300/60 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
          )}
        >
          {projectStatus(project.period)}
        </Badge>
      ),
    },
    ...(repo ? buildGithubPropertyRows(repo, project) : []),
    ...(project.metric
      ? [{ label: project.metric.label, value: project.metric.value }]
      : []),
    ...(project.links.github
      ? [
          {
            label: "GitHub",
            value: (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-primary hover:underline"
              >
                {project.links.github.replace(/^https?:\/\//, "")}
              </a>
            ),
          },
        ]
      : []),
    ...(project.links.demo
      ? [
          {
            label: "Demo",
            value: (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-primary hover:underline"
              >
                {project.links.demo.replace(/^https?:\/\//, "")}
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-2xl shadow-sm",
            project.coverGradient,
          )}
        >
          {project.pageIcon}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">{project.name}</h2>
            {project.featured && (
              <Badge variant="outline" className="gap-1 text-[10px]">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Featured
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.tagline}
          </p>
        </div>
      </div>

      <NotionPropertyTable rows={rows} />

      <ProjectStackAndLanguages project={project} repo={repo} />

      <ProjectHighlights project={project} />

      <ProjectDetailsDoc
        project={project}
        detailsMarkdown={detailsMarkdown}
        loading={loading}
        detailsError={detailsError}
        detailsSource={detailsSource}
      />
    </div>
  );
}

function ProjectIcon({
  project,
  size = "md",
}: {
  project: ProjectItem;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-xl";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br shadow-sm",
        box,
        project.coverGradient,
      )}
    >
      {project.pageIcon}
    </span>
  );
}

const GLOBAL_STACK_FREQ = (() => {
  const counts = new Map<string, number>();
  for (const project of portfolio.projects) {
    for (const tech of project.stack) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return counts;
})();

const MAX_CARD_STACK_TAGS = 5;

function topStackTags(stack: string[], limit = MAX_CARD_STACK_TAGS) {
  return [...stack]
    .sort(
      (a, b) =>
        (GLOBAL_STACK_FREQ.get(b) ?? 0) - (GLOBAL_STACK_FREQ.get(a) ?? 0) ||
        a.localeCompare(b),
    )
    .slice(0, limit);
}

function projectCardPoints(project: ProjectItem, limit: number) {
  return project.highlights.slice(0, limit);
}

function ProjectCardPoints({
  points,
  tall,
}: {
  points: string[];
  tall?: boolean;
}) {
  if (points.length === 0) return null;

  return (
    <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground/90">
      {points.map((point) => (
        <li key={point} className="flex gap-2">
          <span className="shrink-0 text-muted-foreground">•</span>
          <span className={cn(!tall && "line-clamp-2")}>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectBentoCard({
  project,
  onClick,
}: {
  project: ProjectItem;
  onClick: () => void;
}) {
  const isWide = project.bentoSize === "wide";
  const isTall = project.bentoSize === "tall";
  const isExpanded = isWide || isTall;
  const pointLimit = isExpanded ? 2 : 1;
  const points = projectCardPoints(project, pointLimit);
  const stackTags = topStackTags(project.stack);

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor-hint="Open project details"
      className={cn(
        "group relative flex h-full min-h-40 flex-col overflow-hidden rounded-lg border border-border bg-card p-4 text-left transition-all",
        "hover:border-primary/25 hover:bg-notion-hover hover:shadow-sm",
        BENTO_GRID_CLASS[project.bentoSize],
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-80",
          project.coverGradient,
        )}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          <ProjectIcon project={project} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="font-semibold leading-tight group-hover:text-primary">
                {project.name}
              </h3>
              {project.featured && (
                <Star
                  className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400"
                  aria-label="Featured project"
                />
              )}
            </div>
            <p
              className={cn(
                "mt-1 text-sm text-muted-foreground",
                isWide
                  ? "line-clamp-2"
                  : isTall
                    ? "line-clamp-2"
                    : "line-clamp-1",
              )}
            >
              {project.tagline}
            </p>
          </div>
        </div>

        {(project.links.github || project.links.demo) && (
          <div
            className="flex shrink-0 items-center gap-1"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {project.links.github && (
              <ProjectLinkButton
                href={project.links.github}
                label="Open GitHub repository"
                onClick={(e) => e.stopPropagation()}
              >
                <BrandLogo
                  src={SOCIAL_LOGOS.github}
                  size="sm"
                  className="h-3.5 w-3.5"
                />
              </ProjectLinkButton>
            )}
            {project.links.demo && (
              <ProjectLinkButton
                href={project.links.demo}
                label="Open live demo"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </ProjectLinkButton>
            )}
          </div>
        )}
      </div>

      <ProjectCardPoints points={points} tall={isTall} />

      <div className="mt-auto flex flex-col gap-2.5 border-t border-border/60 pt-3">
        {stackTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {stackTags.map((s) => (
              <Badge key={s} variant="tag" className="text-[10px]">
                {s}
              </Badge>
            ))}
            {project.stack.length > MAX_CARD_STACK_TAGS && (
              <Badge variant="tag" className="text-[10px]">
                +{project.stack.length - MAX_CARD_STACK_TAGS}
              </Badge>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

function ProjectStatsWidget({ size }: { size: BentoTileSize }) {
  const projects = portfolio.projects;
  const demoCount = projects.filter((p) => p.links.demo).length;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full min-h-40 flex-col justify-between rounded-lg border border-border bg-muted/20 p-4",
        TILE_SIZE_CLASS[size],
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Portfolio
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-2xl font-bold tabular-nums">{projects.length}</p>
          <p className="text-xs text-muted-foreground">Projects</p>
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{demoCount}</p>
          <p className="text-xs text-muted-foreground">Live demos</p>
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{featuredCount}</p>
          <p className="text-xs text-muted-foreground">Featured</p>
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">
            {projects.filter((p) => p.links.github).length}
          </p>
          <p className="text-xs text-muted-foreground">On GitHub</p>
        </div>
      </div>
    </div>
  );
}

function BuildingWidget({ size }: { size: BentoTileSize }) {
  const active = portfolio.projects.filter((p) =>
    isProjectInProgress(p.period),
  );

  return (
    <div
      className={cn(
        "flex h-full min-h-40 flex-col rounded-lg border border-amber-300/40 bg-amber-50/30 p-4 dark:border-amber-800/50 dark:bg-amber-950/15",
        TILE_SIZE_CLASS[size],
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        Currently building
      </div>
      <div className="mt-4 space-y-3">
        {active.map((project) => (
          <div key={project.id} className="flex items-start gap-3">
            <ProjectIcon project={project} size="sm" />
            <div className="min-w-0">
              <p className="font-semibold leading-tight">{project.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {project.tagline}
              </p>
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View demo
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BentoWidget({
  widget,
  size,
}: {
  widget: "stats" | "building";
  size: BentoTileSize;
}) {
  if (widget === "stats") return <ProjectStatsWidget size={size} />;
  return <BuildingWidget size={size} />;
}

export function ProjectsSection() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  const projectMap = useMemo(
    () => new Map(portfolio.projects.map((p) => [p.id, p])),
    [],
  );

  return (
    <FadeIn>
      <section id="projects" className="scroll-mt-8 pt-12">
        <NotionBlock>
          <NotionHeading>Projects</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">Database</p>
        </NotionBlock>

        <div className={cn("mt-4", PROJECTS_BENTO_GRID)}>
          {BENTO_LAYOUT.map((item) => {
            if (item.type === "widget") {
              return (
                <BentoWidget
                  key={item.id}
                  widget={item.widget}
                  size={item.size}
                />
              );
            }
            const project = projectMap.get(item.id);
            if (!project) return null;
            return (
              <ProjectBentoCard
                key={item.id}
                project={project}
                onClick={() => setSelected(project)}
              />
            );
          })}
        </div>

        <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <SheetContent className="overflow-y-auto sm:max-w-lg">
            <p className="mb-4 text-xs text-muted-foreground">
              Workspace / Projects / {selected?.name}
            </p>
            {selected && <ProjectSubPage project={selected} />}
          </SheetContent>
        </Sheet>
      </section>
    </FadeIn>
  );
}

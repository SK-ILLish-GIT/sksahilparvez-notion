import { useState } from "react";
import { portfolio } from "@/data";
import type { ProjectItem } from "@/types/portfolio";
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
import { cn } from "@/lib/utils";

function ProjectSubPage({ project }: { project: ProjectItem }) {
  const rows: NotionPropertyRow[] = [
    { label: "Tagline", value: project.tagline },
    { label: "Period", value: project.period },
    {
      label: "Stack",
      value: (
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s} variant="tag">
              {s}
            </Badge>
          ))}
        </div>
      ),
    },
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
      <div className="flex items-center gap-3">
        <span className="text-3xl">{project.pageIcon}</span>
        <h2 className="text-xl font-bold">{project.name}</h2>
      </div>

      <NotionPropertyTable rows={rows} />

      <div>
        <NotionSubheading>Highlights</NotionSubheading>
        <ul className="space-y-2 text-sm leading-relaxed">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {project.id === "gamevault" && (
        <div>
          <NotionSubheading>Architecture</NotionSubheading>
          <pre className="overflow-x-auto rounded-md border border-border bg-accent/40 p-4 text-xs leading-relaxed">
            {`┌─────────┐    ┌─────────┐    ┌──────────────────┐
│ React   │───▶│  Nginx  │───▶│ Express services │
│   SPA   │    │ Gateway │    │ auth · games · lb│
└─────────┘    └─────────┘    └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              PostgreSQL            Redis             MongoDB`}
          </pre>
        </div>
      )}
    </div>
  );
}

export function ProjectsSection() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  return (
    <FadeIn>
      <section id="projects" className="scroll-mt-8 pt-12">
        <NotionBlock>
          <NotionHeading>Projects</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">
            Database · Gallery view
          </p>
        </NotionBlock>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {portfolio.projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelected(project)}
              data-cursor-hint="Open project details"
              className={cn(
                "group overflow-hidden rounded-lg border border-border bg-card text-left transition-all hover:bg-notion-hover hover:shadow-sm",
                project.bentoSize === "large" && "sm:row-span-2",
              )}
            >
              <div
                className={cn(
                  "flex h-28 items-end bg-gradient-to-br p-4",
                  project.coverGradient,
                )}
              >
                <span className="text-3xl">{project.pageIcon}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold group-hover:text-primary">
                  {project.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {project.tagline}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {project.period}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.stack.slice(0, 3).map((s) => (
                    <Badge key={s} variant="tag" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                  {project.stack.length > 3 && (
                    <Badge variant="tag" className="text-[10px]">
                      +{project.stack.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
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

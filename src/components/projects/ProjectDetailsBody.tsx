import type { ProjectItem } from "@/types/portfolio";
import type { GithubRepoDetails } from "@/lib/github";
import { formatGithubDate } from "@/lib/github";
import { Badge } from "@/components/ui/badge";
import { NotionSubheading } from "@/components/notion/NotionBlock";
import type { NotionPropertyRow } from "@/components/notion/NotionPropertyTable";
import { GithubContributorsRow } from "@/components/projects/GithubContributorsRow";
import { GithubLanguagesBreakdown } from "@/components/projects/GithubLanguagesBreakdown";
import { ProjectMarkdownContent } from "@/components/projects/ProjectMarkdownContent";
import type { GithubDetailsSource } from "@/hooks/useGithubProject";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SOCIAL_LOGOS } from "@/lib/social-logos";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

function DetailsSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  );
}

function ProjectJsonHighlights({ project }: { project: ProjectItem }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed">
      {project.highlights.map((h) => (
        <li key={h} className="flex gap-2">
          <span className="text-muted-foreground">•</span>
          <span>{h}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProjectHighlights({ project }: { project: ProjectItem }) {
  if (project.highlights.length === 0) return null;

  return (
    <div>
      <NotionSubheading>Highlights</NotionSubheading>
      <ProjectJsonHighlights project={project} />
    </div>
  );
}

function RepoVisibilityBadges({ repo }: { repo: GithubRepoDetails }) {
  const labels: { text: string; className: string }[] = [];

  labels.push({
    text: repo.visibility.charAt(0).toUpperCase() + repo.visibility.slice(1),
    className: repo.isPrivate
      ? "border-violet-300/60 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300"
      : "border-sky-300/60 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  });

  if (repo.isArchived) {
    labels.push({
      text: "Archived",
      className: "border-border bg-muted text-muted-foreground",
    });
  }

  if (repo.isFork) {
    labels.push({
      text: "Fork",
      className: "border-border bg-muted text-muted-foreground",
    });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <Badge
          key={label.text}
          variant="outline"
          className={cn("text-xs", label.className)}
        >
          {label.text}
        </Badge>
      ))}
    </div>
  );
}

export function buildGithubPropertyRows(
  repo: GithubRepoDetails,
  project: ProjectItem,
): NotionPropertyRow[] {
  const rows: NotionPropertyRow[] = [];

  if (repo.description) {
    rows.push({ label: "About", value: repo.description });
  }

  rows.push({
    label: "GitHub stats",
    value: `★ ${repo.stars.toLocaleString()} · ${repo.forks.toLocaleString()} forks`,
  });

  rows.push({
    label: "Visibility",
    value: <RepoVisibilityBadges repo={repo} />,
  });

  if (repo.createdAt) {
    rows.push({
      label: "Created",
      value: formatGithubDate(repo.createdAt),
    });
  }

  if (repo.latestRelease) {
    rows.push({
      label: "Latest release",
      value: (
        <span className="text-sm">
          <a
            href={repo.latestRelease.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {repo.latestRelease.name ?? repo.latestRelease.tagName}
          </a>
          {repo.latestRelease.publishedAt && (
            <span className="text-muted-foreground">
              {" "}
              · {formatGithubDate(repo.latestRelease.publishedAt)}
            </span>
          )}
        </span>
      ),
    });
  }

  if (repo.contributors.length > 0) {
    rows.push({
      label: "Contributors",
      value: <GithubContributorsRow contributors={repo.contributors} />,
    });
  }

  if (repo.topics.length > 0) {
    rows.push({
      label: "Topics",
      value: (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <Badge key={topic} variant="tag">
              {topic}
            </Badge>
          ))}
        </div>
      ),
    });
  }

  if (repo.license) {
    rows.push({ label: "License", value: repo.license });
  }

  if (repo.updatedAt) {
    rows.push({
      label: "Last updated",
      value: formatGithubDate(repo.updatedAt),
    });
  }

  if (repo.homepage && repo.homepage !== project.links.demo) {
    rows.push({
      label: "Homepage",
      value: (
        <a
          href={repo.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-primary hover:underline"
        >
          {repo.homepage.replace(/^https?:\/\//, "")}
        </a>
      ),
    });
  }

  return rows;
}

export function ProjectStackAndLanguages({
  project,
  repo,
}: {
  project: ProjectItem;
  repo: GithubRepoDetails | null;
}) {
  const hasLanguages =
    repo != null && (repo.languages.length > 0 || Boolean(repo.language));

  if (project.stack.length === 0 && !hasLanguages) return null;

  return (
    <div className="space-y-5">
      {project.stack.length > 0 && (
        <div>
          <NotionSubheading>Stack</NotionSubheading>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Badge key={s} variant="tag">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasLanguages && (
        <div>
          <NotionSubheading>Languages</NotionSubheading>
          {repo!.languages.length > 0 ? (
            <GithubLanguagesBreakdown languages={repo!.languages} />
          ) : (
            <p className="text-sm">{repo!.language}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectDetailsDoc({
  project,
  detailsMarkdown,
  loading,
  detailsError,
  detailsSource,
}: {
  project: ProjectItem;
  detailsMarkdown: string | null;
  loading: boolean;
  detailsError: string | null;
  detailsSource: GithubDetailsSource;
}) {
  const showGithubDetails = detailsSource === "github" && detailsMarkdown;
  const showJsonFallback =
    !showGithubDetails &&
    !loading &&
    Boolean(project.architecture) &&
    (!project.links.github || Boolean(detailsError));
  const showSection =
    Boolean(project.links.github) || Boolean(project.architecture);

  if (!showSection) return null;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <NotionSubheading className="mb-0">Details</NotionSubheading>
        {showGithubDetails && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <BrandLogo
              src={SOCIAL_LOGOS.github}
              size="sm"
              className="h-3 w-3"
            />
            DETAILS.md
          </span>
        )}
        {loading && project.links.github && (
          <span className="text-[10px] text-muted-foreground">
            Loading from GitHub…
          </span>
        )}
      </div>

      {loading && project.links.github ? (
        <DetailsSkeleton />
      ) : showGithubDetails ? (
        <ProjectMarkdownContent markdown={detailsMarkdown} />
      ) : showJsonFallback ? (
        <>
          {detailsError && project.links.github && (
            <p className="mb-3 text-xs text-muted-foreground">
              Could not load DETAILS.md ({detailsError}). Showing saved diagram
              instead.
            </p>
          )}
          <pre className="overflow-x-auto rounded-md border border-border bg-accent/40 p-4 text-xs leading-relaxed">
            {project.architecture}
          </pre>
        </>
      ) : (
        detailsError && (
          <p className="text-xs text-muted-foreground">
            Could not load DETAILS.md ({detailsError}).
          </p>
        )
      )}
    </div>
  );
}

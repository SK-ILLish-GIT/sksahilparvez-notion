import type { GithubContributor } from "@/lib/github";

export function GithubContributorsRow({
  contributors,
}: {
  contributors: GithubContributor[];
}) {
  if (contributors.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {contributors.map((contributor) => (
        <a
          key={contributor.login}
          href={contributor.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`${contributor.login} · ${contributor.contributions} contributions`}
          className="transition-opacity hover:opacity-80"
        >
          <img
            src={contributor.avatarUrl}
            alt={contributor.login}
            loading="lazy"
            className="h-8 w-8 rounded-full border border-border bg-background"
          />
        </a>
      ))}
    </div>
  );
}

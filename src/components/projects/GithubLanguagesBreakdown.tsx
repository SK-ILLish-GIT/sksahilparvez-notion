import type { GithubLanguageBreakdown } from "@/lib/github";
import { languageColor } from "@/lib/github";

export function GithubLanguagesBreakdown({
  languages,
}: {
  languages: GithubLanguageBreakdown[];
}) {
  if (languages.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
        {languages.map((language) => (
          <div
            key={language.name}
            title={`${language.name} · ${language.percentage}%`}
            className="h-full min-w-[2px]"
            style={{
              width: `${Math.max(language.percentage, 1)}%`,
              backgroundColor: languageColor(language.name),
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {languages.map((language) => (
          <span
            key={language.name}
            className="inline-flex items-center gap-1.5"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: languageColor(language.name) }}
            />
            {language.name} {language.percentage}%
          </span>
        ))}
      </div>
    </div>
  );
}

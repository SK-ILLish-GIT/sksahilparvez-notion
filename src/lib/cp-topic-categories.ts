import topicConfig from "@/data/content/cp-topic-categories.json";
import type { CpTopicEntry } from "@/types/portfolio";

export const CP_TOPIC_CATEGORIES = topicConfig.categories.map(
  (c) => c.name,
) as readonly string[];

export type CpTopicCategory = (typeof CP_TOPIC_CATEGORIES)[number];

const EXCLUDED_TAGS = new Set(
  topicConfig.excludedTags.map((tag) => normalizeTag(tag)),
);

const PLATFORM_EXCLUSIONS = new Set(
  topicConfig.platformExclusions.map(
    (e) => `${e.platform}:${normalizeTag(e.tag)}`,
  ),
);

const TAG_TO_CATEGORY: Record<string, CpTopicCategory> = Object.fromEntries(
  topicConfig.categories.flatMap((category) =>
    category.tags.map((tag) => [normalizeTag(tag), category.name]),
  ),
) as Record<string, CpTopicCategory>;

export const CATEGORY_COLORS = Object.fromEntries(
  topicConfig.categories.map((c) => [c.name, c.color]),
) as Record<CpTopicCategory, string>;

export const CATEGORY_SHORT_LABELS = Object.fromEntries(
  topicConfig.categories.map((c) => [c.name, c.shortLabel ?? c.name]),
) as Record<CpTopicCategory, string>;

export const PLATFORM_CHART_COLORS: Record<string, string> =
  topicConfig.platformChartColors;

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ");
}

export function mapTopicToCategory(
  tag: string,
  codolioPlatform: string,
): CpTopicCategory | null {
  const key = normalizeTag(tag);

  if (EXCLUDED_TAGS.has(key)) return null;
  if (PLATFORM_EXCLUSIONS.has(`${codolioPlatform}:${key}`)) return null;

  return TAG_TO_CATEGORY[key] ?? null;
}

export interface CpStackedTopicRow {
  topic: string;
  shortLabel: string;
  total: number;
  [platform: string]: string | number;
}

export function aggregateStackedByPlatform(sources: CpTopicSource[]): {
  data: CpStackedTopicRow[];
  platformKeys: string[];
} {
  const categoryPlatformCounts = new Map<
    CpTopicCategory,
    Map<string, number>
  >();
  const platformKeys = sources.map((s) => s.platform);

  for (const source of sources) {
    const platformTotals = new Map<CpTopicCategory, number>();

    for (const { topic, count } of source.rawTopics) {
      const category = mapTopicToCategory(topic, source.codolioPlatform);
      if (!category) continue;
      platformTotals.set(category, (platformTotals.get(category) ?? 0) + count);
    }

    for (const [category, count] of platformTotals) {
      if (!categoryPlatformCounts.has(category)) {
        categoryPlatformCounts.set(category, new Map());
      }
      const byPlatform = categoryPlatformCounts.get(category)!;
      byPlatform.set(
        source.platform,
        (byPlatform.get(source.platform) ?? 0) + count,
      );
    }
  }

  const data = CP_TOPIC_CATEGORIES.map((category) => {
    const byPlatform = categoryPlatformCounts.get(category);
    if (!byPlatform) return null;

    const total = [...byPlatform.values()].reduce((sum, n) => sum + n, 0);
    if (total === 0) return null;

    const row: CpStackedTopicRow = {
      topic: category,
      shortLabel: CATEGORY_SHORT_LABELS[category] ?? category,
      total,
    };
    for (const platform of platformKeys) {
      row[platform] = byPlatform.get(platform) ?? 0;
    }
    return row;
  })
    .filter((row): row is CpStackedTopicRow => row !== null)
    .sort((a, b) => b.total - a.total);

  return { data, platformKeys };
}

export function aggregateToCategories(
  rawTopics: CpTopicEntry[],
  codolioPlatform: string,
): CpTopicEntry[] {
  const totals = new Map<CpTopicCategory, number>();

  for (const { topic, count } of rawTopics) {
    const category = mapTopicToCategory(topic, codolioPlatform);
    if (!category) continue;
    totals.set(category, (totals.get(category) ?? 0) + count);
  }

  return CP_TOPIC_CATEGORIES.filter((cat) => (totals.get(cat) ?? 0) > 0)
    .map((cat) => ({ topic: cat, count: totals.get(cat)! }))
    .sort((a, b) => b.count - a.count);
}

export interface CpTopicSource {
  platform: string;
  codolioPlatform: string;
  logo?: string;
  rawTopics: CpTopicEntry[];
}

export function aggregateAllPlatforms(
  sources: CpTopicSource[],
): CpTopicEntry[] {
  const totals = new Map<CpTopicCategory, number>();

  for (const source of sources) {
    for (const { topic, count } of aggregateToCategories(
      source.rawTopics,
      source.codolioPlatform,
    )) {
      totals.set(
        topic as CpTopicCategory,
        (totals.get(topic as CpTopicCategory) ?? 0) + count,
      );
    }
  }

  return CP_TOPIC_CATEGORIES.filter((cat) => (totals.get(cat) ?? 0) > 0)
    .map((cat) => ({ topic: cat, count: totals.get(cat)! }))
    .sort((a, b) => b.count - a.count);
}

export const ALL_PLATFORMS_KEY = "all";

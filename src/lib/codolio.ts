import type {
  Achievement,
  CpSectionData,
  CpTopicEntry,
} from "@/types/portfolio";

export const CODOLIO_USER_KEY = "RzgB5KfU";
export const CODOLIO_API_URL = `https://api.codolio.com/profile?userKey=${CODOLIO_USER_KEY}`;

const CHART_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

interface CodolioUserStats {
  handle?: string;
  currentRating?: number | null;
  maxRating?: number | null;
  maxRank?: string | null;
  contestBadgeName?: string | null;
  stars?: number | null;
}

interface CodolioPlatformProfile {
  platform: string;
  userStats?: CodolioUserStats | null;
  totalQuestionStats?: {
    totalQuestionCounts?: number | null;
  } | null;
  topicAnalysisStats?: {
    topicWiseDistribution?: Record<string, number> | null;
  } | null;
  dailyActivityStatsResponse?: {
    topicWiseDistribution?: Record<string, number> | null;
  } | null;
}

interface CodolioProfileResponse {
  status?: { success?: boolean };
  data?: {
    platformProfiles?: {
      platformProfiles?: CodolioPlatformProfile[];
    };
  };
}

let cachedResponse: CodolioProfileResponse | null = null;
let cachePromise: Promise<CodolioProfileResponse> | null = null;

export async function fetchCodolioProfile(): Promise<CodolioProfileResponse> {
  if (cachedResponse) return cachedResponse;
  if (cachePromise) return cachePromise;

  cachePromise = fetch(CODOLIO_API_URL, {
    headers: { referer: "https://codolio.com/" },
  }).then(async (res) => {
    if (!res.ok) throw new Error(`Codolio API error: ${res.status}`);
    const json = (await res.json()) as CodolioProfileResponse;
    if (!json.status?.success) throw new Error("Codolio API returned failure");
    cachedResponse = json;
    return json;
  });

  try {
    return await cachePromise;
  } finally {
    cachePromise = null;
  }
}

function indexByPlatform(
  profiles: CodolioPlatformProfile[],
): Map<string, CodolioPlatformProfile> {
  const map = new Map<string, CodolioPlatformProfile>();
  for (const profile of profiles) {
    map.set(profile.platform, profile);
  }
  return map;
}

function usesSameProfile(achievement: Achievement): boolean {
  return (
    achievement.ratingProfile.handle === achievement.countProfile.handle &&
    achievement.ratingProfile.href === achievement.countProfile.href
  );
}

function formatRating(stats: CodolioUserStats | null | undefined): string {
  if (!stats) return "—";
  if (stats.contestBadgeName) return stats.contestBadgeName;
  if (stats.stars) return `${stats.stars}★`;
  if (stats.currentRating) return String(stats.currentRating);
  return "—";
}

function parseBestRank(
  stats: CodolioUserStats | null | undefined,
): number | null {
  if (!stats?.maxRank) return null;
  const rank = stats.maxRank.replace(/^#/, "");
  const num = Number.parseInt(rank, 10);
  return Number.isNaN(num) ? null : num;
}

function resolveBestRanks(
  achievement: Achievement,
  stats: CodolioUserStats | null | undefined,
  liveStats: boolean,
): number[] {
  if (achievement.bestRanks.length > 0) {
    return [...achievement.bestRanks].sort((a, b) => a - b);
  }

  if (liveStats) {
    const liveRank = parseBestRank(stats);
    if (liveRank !== null) return [liveRank];
  }

  return [];
}

function extractTopics(
  profile: CodolioPlatformProfile | undefined,
): CpTopicEntry[] {
  if (!profile) return [];

  const fromAnalysis =
    profile.topicAnalysisStats?.topicWiseDistribution ?? undefined;
  const fromDaily =
    profile.dailyActivityStatsResponse?.topicWiseDistribution ?? undefined;
  const distribution = fromAnalysis ?? fromDaily;

  if (!distribution || Object.keys(distribution).length === 0) return [];

  return Object.entries(distribution)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

function getProblemCount(
  profile: CodolioPlatformProfile | undefined,
  fallback: number,
): number {
  return profile?.totalQuestionStats?.totalQuestionCounts ?? fallback;
}

export function buildCpSectionData(
  achievements: Achievement[],
  raw: CodolioProfileResponse | null,
): CpSectionData {
  const profiles = raw?.data?.platformProfiles?.platformProfiles ?? [];
  const byPlatform = indexByPlatform(profiles);

  const tableRows = achievements.map((achievement) => {
    const liveStats = usesSameProfile(achievement);
    const liveProfile = byPlatform.get(achievement.codolioPlatform);
    const stats = liveProfile?.userStats;

    return {
      platform: achievement.platform,
      displayHandle: achievement.ratingProfile.handle,
      displayHref: achievement.ratingProfile.href,
      rating: liveStats
        ? formatRating(stats) !== "—"
          ? formatRating(stats)
          : achievement.rating
        : achievement.rating,
      bestRanks: resolveBestRanks(achievement, stats, liveStats),
      logo: achievement.logo,
      isLive: liveStats && !!liveProfile,
    };
  });

  const problemBreakdown = achievements.map((achievement, index) => {
    const countProfile = byPlatform.get(achievement.codolioPlatform);
    return {
      platform: achievement.platform,
      count: getProblemCount(countProfile, achievement.fallbackProblems ?? 0),
      logo: achievement.logo,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    };
  });

  const topicBreakdownByPlatform = achievements.map((achievement) => ({
    platform: achievement.platform,
    codolioPlatform: achievement.codolioPlatform,
    logo: achievement.logo,
    rawTopics: extractTopics(byPlatform.get(achievement.codolioPlatform)),
  }));

  const totalProblems = problemBreakdown.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return {
    tableRows,
    problemBreakdown,
    topicBreakdownByPlatform,
    totalProblems,
  };
}

export function buildStaticCpSectionData(
  achievements: Achievement[],
): CpSectionData {
  return buildCpSectionData(achievements, null);
}

export interface GithubLanguageBreakdown {
  name: string;
  bytes: number;
  percentage: number;
}

export interface GithubRelease {
  tagName: string;
  name: string | null;
  publishedAt: string | null;
  url: string;
}

export interface GithubContributor {
  login: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
}

export interface GithubRepoDetails {
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  license: string | null;
  homepage: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  sizeKb: number;
  visibility: string;
  isPrivate: boolean;
  isArchived: boolean;
  isFork: boolean;
  languages: GithubLanguageBreakdown[];
  latestRelease: GithubRelease | null;
  contributors: GithubContributor[];
}

export interface GithubProjectData {
  detailsMarkdown: string | null;
  repo: GithubRepoDetails | null;
  detailsError: string | null;
  repoError: string | null;
}

const DETAILS_MD_PATH = "details.md";

const projectCache = new Map<string, GithubProjectData>();

export function hasGithubToken() {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  return typeof token === "string" && token.length > 0;
}

function getGithubHeaders(accept: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: accept,
    "User-Agent": "sksahilparvez-portfolio",
  };

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (typeof token === "string" && token.length > 0) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function parseGithubRepoUrl(
  url: string,
): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;

    const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;

    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function formatGithubError(response: Response, fallback: string) {
  if (response.status === 404) return "Not found";
  return `${fallback} (${response.status})`;
}

function buildLanguageBreakdown(
  languages: Record<string, number>,
): GithubLanguageBreakdown[] {
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  if (total === 0) return [];

  return Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 100),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

async function fetchGithubDetailsMarkdown(
  owner: string,
  repo: string,
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${DETAILS_MD_PATH}`,
    { headers: getGithubHeaders("application/vnd.github.raw") },
  );

  if (!response.ok) {
    throw new Error(
      formatGithubError(response, `${DETAILS_MD_PATH} not found`),
    );
  }

  const markdown = (await response.text()).trim();
  if (!markdown) {
    throw new Error(`${DETAILS_MD_PATH} is empty`);
  }

  return markdown;
}

async function fetchGithubLanguages(
  owner: string,
  repo: string,
): Promise<GithubLanguageBreakdown[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    { headers: getGithubHeaders("application/vnd.github+json") },
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as Record<string, number>;
  return buildLanguageBreakdown(data);
}

async function fetchGithubLatestRelease(
  owner: string,
  repo: string,
): Promise<GithubRelease | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    { headers: getGithubHeaders("application/vnd.github+json") },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(formatGithubError(response, "Release lookup failed"));
  }

  const data = (await response.json()) as {
    tag_name?: string;
    name?: string | null;
    published_at?: string | null;
    html_url?: string;
  };

  if (!data.tag_name || !data.html_url) return null;

  return {
    tagName: data.tag_name,
    name: data.name ?? null,
    publishedAt: data.published_at ?? null,
    url: data.html_url,
  };
}

async function fetchGithubContributors(
  owner: string,
  repo: string,
): Promise<GithubContributor[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=8`,
    { headers: getGithubHeaders("application/vnd.github+json") },
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as {
    login?: string;
    avatar_url?: string;
    html_url?: string;
    contributions?: number;
  }[];

  return data
    .filter((item) => item.login && item.avatar_url && item.html_url)
    .map((item) => ({
      login: item.login!,
      avatarUrl: item.avatar_url!,
      profileUrl: item.html_url!,
      contributions: item.contributions ?? 0,
    }));
}

async function fetchGithubRepoCore(
  owner: string,
  repo: string,
): Promise<
  Omit<GithubRepoDetails, "languages" | "latestRelease" | "contributors">
> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: getGithubHeaders("application/vnd.github+json") },
  );

  if (!response.ok) {
    throw new Error(formatGithubError(response, "Repository not found"));
  }

  const data = (await response.json()) as {
    description?: string | null;
    stargazers_count?: number;
    forks_count?: number;
    language?: string | null;
    topics?: string[];
    license?: { spdx_id?: string | null; name?: string | null } | null;
    homepage?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
    size?: number;
    visibility?: string;
    private?: boolean;
    archived?: boolean;
    fork?: boolean;
  };

  return {
    description: data.description ?? null,
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    language: data.language ?? null,
    topics: data.topics ?? [],
    license: data.license?.spdx_id ?? data.license?.name ?? null,
    homepage: data.homepage?.trim() || null,
    updatedAt: data.updated_at ?? null,
    createdAt: data.created_at ?? null,
    sizeKb: data.size ?? 0,
    visibility: data.visibility ?? (data.private ? "private" : "public"),
    isPrivate: data.private ?? false,
    isArchived: data.archived ?? false,
    isFork: data.fork ?? false,
  };
}

export async function fetchGithubProjectData(
  owner: string,
  repoName: string,
): Promise<GithubProjectData> {
  const cacheKey = `${owner}/${repoName}`;
  const cached = projectCache.get(cacheKey);
  if (cached) return cached;

  const [
    detailsResult,
    repoCoreResult,
    languagesResult,
    releaseResult,
    contributorsResult,
  ] = await Promise.allSettled([
    fetchGithubDetailsMarkdown(owner, repoName),
    fetchGithubRepoCore(owner, repoName),
    fetchGithubLanguages(owner, repoName),
    fetchGithubLatestRelease(owner, repoName),
    fetchGithubContributors(owner, repoName),
  ]);

  const detailsMarkdown =
    detailsResult.status === "fulfilled" ? detailsResult.value : null;
  const detailsError =
    detailsResult.status === "rejected"
      ? detailsResult.reason instanceof Error
        ? detailsResult.reason.message
        : "Failed to load details.md"
      : null;

  let repoDetails: GithubRepoDetails | null = null;
  let repoError: string | null = null;

  if (repoCoreResult.status === "fulfilled") {
    repoDetails = {
      ...repoCoreResult.value,
      languages:
        languagesResult.status === "fulfilled" ? languagesResult.value : [],
      latestRelease:
        releaseResult.status === "fulfilled" ? releaseResult.value : null,
      contributors:
        contributorsResult.status === "fulfilled"
          ? contributorsResult.value
          : [],
    };
  } else {
    repoError =
      repoCoreResult.reason instanceof Error
        ? repoCoreResult.reason.message
        : "Failed to load repo details";
  }

  const result: GithubProjectData = {
    detailsMarkdown,
    repo: repoDetails,
    detailsError,
    repoError,
  };

  projectCache.set(cacheKey, result);
  return result;
}

export function formatRepoSize(sizeKb: number) {
  if (sizeKb >= 1024) {
    return `${(sizeKb / 1024).toFixed(1)} MB`;
  }
  return `${sizeKb.toLocaleString()} KB`;
}

export function formatGithubDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Vue: "#41b883",
  "Jupyter Notebook": "#DA5B0B",
};

export function languageColor(name: string) {
  if (LANGUAGE_COLORS[name]) return LANGUAGE_COLORS[name];

  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 55% 52%)`;
}

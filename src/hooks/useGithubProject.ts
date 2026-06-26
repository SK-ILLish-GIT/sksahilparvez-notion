import { useEffect, useState } from "react";
import {
  fetchGithubProjectData,
  parseGithubRepoUrl,
  type GithubProjectData,
  type GithubRepoDetails,
} from "@/lib/github";

export type GithubDetailsSource = "github" | "json" | null;

interface UseGithubProjectResult {
  detailsMarkdown: string | null;
  repo: GithubRepoDetails | null;
  loading: boolean;
  detailsError: string | null;
  repoError: string | null;
  detailsSource: GithubDetailsSource;
}

export function useGithubProject(
  githubUrl: string | undefined,
): UseGithubProjectResult {
  const [data, setData] = useState<GithubProjectData>({
    detailsMarkdown: null,
    repo: null,
    detailsError: null,
    repoError: null,
  });
  const [loading, setLoading] = useState(Boolean(githubUrl));

  useEffect(() => {
    if (!githubUrl) {
      setData({
        detailsMarkdown: null,
        repo: null,
        detailsError: null,
        repoError: null,
      });
      setLoading(false);
      return;
    }

    const parsed = parseGithubRepoUrl(githubUrl);
    if (!parsed) {
      setData({
        detailsMarkdown: null,
        repo: null,
        detailsError: "Invalid GitHub repository URL",
        repoError: null,
      });
      setLoading(false);
      return;
    }

    const { owner, repo: repoName } = parsed;
    let cancelled = false;

    async function load() {
      setLoading(true);

      const result = await fetchGithubProjectData(owner, repoName);
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [githubUrl]);

  const detailsSource: GithubDetailsSource =
    data.detailsMarkdown && !data.detailsError
      ? "github"
      : data.detailsError
        ? "json"
        : null;

  return {
    detailsMarkdown: data.detailsMarkdown,
    repo: data.repo,
    loading,
    detailsError: data.detailsError,
    repoError: data.repoError,
    detailsSource,
  };
}

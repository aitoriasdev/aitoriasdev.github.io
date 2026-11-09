import { GITHUB_TOKEN } from "astro:env/server";

export interface RepoStats {
  pushedAt?: Date;
  stars?: number;
  latestRelease?: { tag: string; url: string; publishedAt: Date };
}

const API = "https://api.github.com";
const cache = new Map<string, Promise<RepoStats | undefined>>();

export function parseGitHubRepo(url: string) {
  const match =
    /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/.exec(url);

  return match ? { owner: match[1], repo: match[2] } : undefined;
}

async function fetchJson<T>(path: string): Promise<T | undefined> {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "aitorias.is-a.dev-build",
      ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
    },
    signal: AbortSignal.timeout(5000),
  });

  return response.ok ? ((await response.json()) as T) : undefined;
}

async function loadRepoStats(owner: string, repo: string) {
  const [repoData, release] = await Promise.all([
    fetchJson<{ pushed_at: string; stargazers_count: number }>(
      `/repos/${owner}/${repo}`,
    ),
    fetchJson<{ tag_name: string; html_url: string; published_at: string }>(
      `/repos/${owner}/${repo}/releases/latest`,
    ),
  ]);

  if (!repoData && !release) return undefined;

  return {
    pushedAt: repoData ? new Date(repoData.pushed_at) : undefined,
    stars: repoData?.stargazers_count,
    latestRelease: release && {
      tag: release.tag_name,
      url: release.html_url,
      publishedAt: new Date(release.published_at),
    },
  } satisfies RepoStats;
}

/**
 * Repository metadata fetched once per build. Never throws: offline builds,
 * rate limits or API errors simply render the page without these details.
 */
export function getRepoStats(
  gitHubUrl?: string,
): Promise<RepoStats | undefined> {
  const parsed = gitHubUrl ? parseGitHubRepo(gitHubUrl) : undefined;

  if (!parsed) return Promise.resolve(undefined);

  const key = `${parsed.owner}/${parsed.repo}`;

  if (!cache.has(key)) {
    cache.set(
      key,
      loadRepoStats(parsed.owner, parsed.repo).catch(() => undefined),
    );
  }

  return cache.get(key)!;
}

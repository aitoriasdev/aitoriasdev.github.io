import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("astro:env/server", () => ({ GITHUB_TOKEN: undefined }));

const json = (body: unknown, ok = true) =>
  Promise.resolve({ ok, json: () => Promise.resolve(body) } as Response);

// Fresh module per test so the per-build cache starts empty
const load = async () => {
  vi.resetModules();
  return import("./github");
};

describe("parseGitHubRepo", () => {
  it.each([
    [
      "https://github.com/CDM-Optimiser/cdm-optimiser",
      "CDM-Optimiser",
      "cdm-optimiser",
    ],
    [
      "https://github.com/aitoriasdev/aitoriasdev.github.io",
      "aitoriasdev",
      "aitoriasdev.github.io",
    ],
    ["https://github.com/owner/repo.git", "owner", "repo"],
    ["https://github.com/owner/repo/", "owner", "repo"],
  ])("%s", async (url, owner, repo) => {
    const { parseGitHubRepo } = await load();

    expect(parseGitHubRepo(url)).toEqual({ owner, repo });
  });

  it("rejects non-repository URLs", async () => {
    const { parseGitHubRepo } = await load();

    expect(parseGitHubRepo("https://github.com/owner")).toBeUndefined();
    expect(parseGitHubRepo("https://gitlab.com/owner/repo")).toBeUndefined();
  });
});

describe("getRepoStats", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("combines repository data and the latest release", async () => {
    fetchMock.mockImplementation((url: string) =>
      url.endsWith("/releases/latest")
        ? json({
            tag_name: "v1.3.1",
            html_url: "https://github.com/o/r/releases/tag/v1.3.1",
            published_at: "2026-11-09T00:00:00Z",
          })
        : json({ pushed_at: "2026-11-09T12:00:00Z", stargazers_count: 3 }),
    );
    const { getRepoStats } = await load();

    const stats = await getRepoStats("https://github.com/o/r");

    expect(stats?.stars).toBe(3);
    expect(stats?.pushedAt?.toISOString()).toBe("2026-11-09T12:00:00.000Z");
    expect(stats?.latestRelease).toMatchObject({
      tag: "v1.3.1",
      url: "https://github.com/o/r/releases/tag/v1.3.1",
    });
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.github.com/repos/o/r");
  });

  it("still returns repository data when there are no releases", async () => {
    fetchMock.mockImplementation((url: string) =>
      url.endsWith("/releases/latest")
        ? json({}, false)
        : json({ pushed_at: "2026-01-01T00:00:00Z", stargazers_count: 0 }),
    );
    const { getRepoStats } = await load();

    const stats = await getRepoStats("https://github.com/o/r");

    expect(stats?.latestRelease).toBeUndefined();
    expect(stats?.pushedAt).toBeInstanceOf(Date);
  });

  it("fails soft on network errors and API errors", async () => {
    const { getRepoStats } = await load();

    fetchMock.mockRejectedValue(new Error("offline"));
    await expect(
      getRepoStats("https://github.com/o/offline"),
    ).resolves.toBeUndefined();

    fetchMock.mockImplementation(() =>
      json({ message: "rate limited" }, false),
    );
    await expect(
      getRepoStats("https://github.com/o/limited"),
    ).resolves.toBeUndefined();
  });

  it("fetches each repository only once per build", async () => {
    fetchMock.mockImplementation(() =>
      json({ pushed_at: "2026-01-01T00:00:00Z", stargazers_count: 1 }),
    );
    const { getRepoStats } = await load();

    await Promise.all([
      getRepoStats("https://github.com/o/r"),
      getRepoStats("https://github.com/o/r/"),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2); // repo + latest release, not 4
  });

  it("ignores missing or non-GitHub URLs without fetching", async () => {
    const { getRepoStats } = await load();

    await expect(getRepoStats(undefined)).resolves.toBeUndefined();
    await expect(
      getRepoStats("https://gitlab.com/o/r"),
    ).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

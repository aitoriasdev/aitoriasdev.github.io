import { describe, expect, it, vi } from "vitest";

vi.mock("astro:env/server", () => ({ GITHUB_TOKEN: undefined }));

const { parseGitHubRepo } = await import("./github");

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
  ])("%s", (url, owner, repo) => {
    expect(parseGitHubRepo(url)).toEqual({ owner, repo });
  });

  it("rejects non-repository URLs", () => {
    expect(parseGitHubRepo("https://github.com/owner")).toBeUndefined();
    expect(parseGitHubRepo("https://gitlab.com/owner/repo")).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import { compareProjects, getProjectSlug } from "./projects";

describe("getProjectSlug", () => {
  it("strips the locale folder", () => {
    expect(getProjectSlug({ id: "es/cdm-optimiser" })).toBe("cdm-optimiser");
  });

  it("keeps root-level ids", () => {
    expect(getProjectSlug({ id: "aitorias-dev" })).toBe("aitorias-dev");
  });
});

describe("compareProjects", () => {
  const project = (
    name: string,
    data: { order?: number; startDate?: string; completedDate?: string },
  ) => ({
    name,
    data: {
      order: data.order ?? 100,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      completedDate: data.completedDate
        ? new Date(data.completedDate)
        : undefined,
    },
  });

  it("sorts by explicit order first", () => {
    const sorted = [
      project("b", { order: 2, completedDate: "2026-01-01" }),
      project("a", { order: 1, completedDate: "2020-01-01" }),
    ].sort(compareProjects);

    expect(sorted.map((p) => p.name)).toEqual(["a", "b"]);
  });

  it("falls back to the most recent completed/start date", () => {
    const sorted = [
      project("old", { completedDate: "2024-05-01" }),
      project("active", { startDate: "2026-02-01" }),
      project("undated", {}),
      project("recent", { completedDate: "2025-06-01" }),
    ].sort(compareProjects);

    expect(sorted.map((p) => p.name)).toEqual([
      "active",
      "recent",
      "old",
      "undated",
    ]);
  });
});

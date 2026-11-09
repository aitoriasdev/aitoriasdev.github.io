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
  const project = (completedDate: string) =>
    ({ data: { completedDate: new Date(completedDate) } }) as Parameters<
      typeof compareProjects
    >[0];

  it("sorts most recent first", () => {
    const sorted = [
      project("2025-01-01"),
      project("2026-03-01"),
      project("2025-06-01"),
    ].sort(compareProjects);

    expect(sorted.map((p) => p.data.completedDate.getFullYear())).toEqual([
      2026, 2025, 2025,
    ]);
    expect(sorted[1].data.completedDate.getMonth()).toBe(5);
  });
});

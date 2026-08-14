// Unit tests for src/lib/data.ts — the build-time catalog loader.
// getCategoryLabel is the exported presentation contract used across pages/components;
// the catalog export is validated for shape + internal consistency against data/packages.json.
import { describe, it, expect } from "vitest";
import { getCategoryLabel, catalog } from "../src/lib/data";

describe("getCategoryLabel", () => {
  it("maps 'astro' to 'Astro'", () => {
    expect(getCategoryLabel("astro")).toBe("Astro");
  });

  it("maps 'auth' to 'Auth'", () => {
    expect(getCategoryLabel("auth")).toBe("Auth");
  });

  it("maps 'utilities' to 'Utilities'", () => {
    expect(getCategoryLabel("utilities")).toBe("Utilities");
  });

  it("falls back to 'Utilities' for any unknown category", () => {
    expect(getCategoryLabel("nonsense")).toBe("Utilities");
    expect(getCategoryLabel("")).toBe("Utilities");
  });
});

describe("catalog data", () => {
  it("has a count matching the packages array length", () => {
    expect(catalog.count).toBe(catalog.packages.length);
  });

  it("category tallies match the actual per-category counts", () => {
    const tally = { astro: 0, auth: 0, utilities: 0 };
    for (const p of catalog.packages) tally[p.category]++;
    expect(catalog.categories).toEqual(tally);
  });

  it("every package carries the required non-empty fields", () => {
    for (const p of catalog.packages) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBe(`@chirag127/${p.slug}`);
      expect(["astro", "auth", "utilities"]).toContain(p.category);
      expect(p.install).toBe(`npm i @chirag127/${p.slug}`);
      expect(p.npmUrl).toContain(p.slug);
      expect(p.githubUrl).toContain(p.repoSlug);
    }
  });
});

// Unit tests for the pure, deterministic metadata helpers in scripts/discover.mjs.
// These functions drive how every discovered @chirag127 package is categorized,
// titled, described, and given stub display metadata — so they are the real logic.
import { describe, it, expect } from "vitest";
import {
  assignCategory,
  humanize,
  stubDescription,
  pickSize,
  pickStars,
  pickLastPublish,
} from "../scripts/discover.mjs";

describe("assignCategory", () => {
  it("maps astro-* prefix to 'astro'", () => {
    expect(assignCategory("astro-shell")).toBe("astro");
    expect(assignCategory("astro-billing")).toBe("astro");
  });

  it("maps auth-* prefix to 'auth'", () => {
    expect(assignCategory("auth-core")).toBe("auth");
  });

  it("falls back to 'utilities' for anything else", () => {
    expect(assignCategory("oz-file")).toBe("utilities");
    expect(assignCategory("something")).toBe("utilities");
  });

  it("is case-insensitive on the prefix", () => {
    expect(assignCategory("ASTRO-Shell")).toBe("astro");
    expect(assignCategory("Auth-Core")).toBe("auth");
  });
});

describe("humanize", () => {
  it("title-cases hyphenated slugs", () => {
    expect(humanize("astro-shell")).toBe("Astro Shell");
  });

  it("upper-cases segments of length <= 2", () => {
    // "oz" -> "OZ" (len 2), "ai" -> "AI"
    expect(humanize("oz-ai")).toBe("OZ AI");
  });

  it("handles a single segment", () => {
    expect(humanize("utilities")).toBe("Utilities");
  });

  it("upper-cases a 2-char first segment but title-cases longer ones", () => {
    expect(humanize("db-tools")).toBe("DB Tools");
  });
});

describe("stubDescription", () => {
  it("produces an astro-flavored blurb containing the humanized name", () => {
    const d = stubDescription("astro-shell", "astro");
    expect(d).toContain("Astro Shell");
    expect(d).toMatch(/Astro integration/);
  });

  it("produces an auth-flavored blurb", () => {
    const d = stubDescription("auth-core", "auth");
    expect(d).toContain("Auth Core");
    expect(d).toMatch(/auth utility/);
  });

  it("produces a utilities blurb", () => {
    const d = stubDescription("oz-file", "utilities");
    expect(d).toContain("OZ File");
    expect(d).toMatch(/utility package/);
  });

  it("falls back to a generic blurb for an unknown category", () => {
    const d = stubDescription("oz-file", "mystery");
    expect(d).toBe("Oriz package OZ File.");
  });
});

describe("pickSize", () => {
  const sizes = ["4kb", "7kb", "9kb", "12kb", "15kb", "18kb", "22kb", "28kb"];

  it("prefixes with ~ and returns one of the known buckets", () => {
    const s = pickSize("astro-shell");
    expect(s.startsWith("~")).toBe(true);
    expect(sizes).toContain(s.slice(1));
  });

  it("is deterministic by name length (index = len % 8)", () => {
    const short = "abcde"; // length 5 -> sizes[5] = "18kb"
    expect(pickSize(short)).toBe("~18kb");
  });

  it("returns the same value for two equal-length names", () => {
    expect(pickSize("abcd")).toBe(pickSize("wxyz"));
  });
});

describe("pickStars", () => {
  it("is deterministic and within the documented 0-8 range", () => {
    for (const name of ["astro-shell", "auth-core", "oz-file", "x", "zzzzzzzz"]) {
      const stars = pickStars(name);
      expect(Number.isInteger(stars)).toBe(true);
      expect(stars).toBeGreaterThanOrEqual(0);
      expect(stars).toBeLessThanOrEqual(8);
    }
  });

  it("matches the formula (charCodeAt(0) % 5) + (length % 4)", () => {
    // "abcd": 'a'=97 -> 97%5=2 ; len 4 -> 4%4=0 -> 2
    expect(pickStars("abcd")).toBe(2);
  });
});

describe("pickLastPublish", () => {
  const opts = [
    "2 days ago",
    "5 days ago",
    "1 week ago",
    "2 weeks ago",
    "3 weeks ago",
    "1 month ago",
  ];

  it("cycles through the options by index modulo 6", () => {
    expect(pickLastPublish(0)).toBe("2 days ago");
    expect(pickLastPublish(5)).toBe("1 month ago");
    expect(pickLastPublish(6)).toBe("2 days ago"); // wraps
    expect(pickLastPublish(7)).toBe("5 days ago");
  });

  it("always returns a known option", () => {
    for (let i = 0; i < 20; i++) {
      expect(opts).toContain(pickLastPublish(i));
    }
  });
});

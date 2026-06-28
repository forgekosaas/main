import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("Founder Hub start command", () => {
  it("uses a local port fallback instead of hardcoding only 3030", () => {
    const script = readFileSync("Start Founder Hub.cmd", "utf8");

    expect(script).toContain("3030");
    expect(script).toContain("3031");
    expect(script).toContain("next dev -p");
    expect(script).not.toContain("npm run dev");
  });
});

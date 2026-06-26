import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("OpenNext Worker patch", () => {
  it("inserts the Plausible script route into the generated Worker fetch handler", () => {
    const cwd = mkdtempSync(join(tmpdir(), "forgeko-worker-patch-"));
    const workerDir = join(cwd, ".open-next");
    const workerPath = join(workerDir, "worker.js");

    try {
      mkdirSync(workerDir);
      writeFileSync(
        workerPath,
        `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    return new Response("next");
  },
};
`
      );

      execFileSync(process.execPath, [resolve("scripts/patch-open-next-worker.mjs")], {
        cwd,
        stdio: "pipe"
      });

      const patchedWorker = readFileSync(workerPath, "utf8");

      expect(patchedWorker).toContain("Forgeko Plausible script proxy patch");
      expect(patchedWorker).toContain(
        'if (url.pathname === "/p/js/script" || url.pathname === "/p/js/script.js")'
      );
      expect(patchedWorker).toContain(
        "return handleForgekoPlausibleScriptRequest(env);"
      );

      execFileSync(process.execPath, [resolve("scripts/patch-open-next-worker.mjs")], {
        cwd,
        stdio: "pipe"
      });

      const repatchedWorker = readFileSync(workerPath, "utf8");
      const routeReturns =
        repatchedWorker.match(/return handleForgekoPlausibleScriptRequest\(env\);/g) ??
        [];

      expect(routeReturns).toHaveLength(1);
    } finally {
      rmSync(cwd, { force: true, recursive: true });
    }
  });
});

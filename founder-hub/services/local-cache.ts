import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { FounderHubSnapshot } from "@/types/founder-hub";

export function getDefaultLocalCachePath() {
  return join(process.cwd(), ".local", "founder-hub-snapshot.json");
}

export async function readLocalFounderHubSnapshot(filePath = getDefaultLocalCachePath()): Promise<FounderHubSnapshot | null> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as FounderHubSnapshot;
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }
}

export async function writeLocalFounderHubSnapshot(snapshot: FounderHubSnapshot, filePath = getDefaultLocalCachePath()) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

function isMissingFile(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

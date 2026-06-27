const readOnlyMethods = new Set(["GET", "HEAD"]);

export function assertReadOnlyHttpMethod(method: string) {
  if (!readOnlyMethods.has(method.toUpperCase())) {
    throw new Error("Founder Hub external services are read-only");
  }
}

export function isLocalFounderHubHost(host: string | null | undefined) {
  if (!host) {
    return false;
  }

  const normalized = host.toLowerCase();
  return (
    normalized.startsWith("localhost") ||
    normalized.startsWith("127.0.0.1") ||
    normalized.startsWith("[::1]") ||
    normalized.startsWith("::1")
  );
}

export function clampScore(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

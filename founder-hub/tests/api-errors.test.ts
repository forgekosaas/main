import { describe, expect, it } from "vitest";

import { publicErrorMessage } from "@/lib/api-errors";

describe("API error messages", () => {
  it("turns missing Founder Hub tables into an actionable local message", () => {
    const message = publicErrorMessage(new Error("Could not find the table 'public.founder_hub_sources' in the schema cache"));

    expect(message).toBe("Founder Hub database schema is missing. Run founder-hub/database/schema.sql in Supabase.");
  });

  it("does not echo long provider payloads back to the UI", () => {
    const message = publicErrorMessage(new Error(`Provider failed: ${"x".repeat(600)}`));

    expect(message.length).toBeLessThanOrEqual(260);
  });
});

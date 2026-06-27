export function publicErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);

  if (raw.includes("Could not find the table") || raw.includes("PGRST205")) {
    return "Founder Hub database schema is missing. Run founder-hub/database/schema.sql in Supabase.";
  }

  return raw.length > 260 ? `${raw.slice(0, 257)}...` : raw;
}

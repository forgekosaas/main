import { createSupabaseServiceClient } from "@/lib/supabase";
import type { WaitlistInsert } from "@/lib/waitlist";

export async function upsertWaitlist(row: WaitlistInsert) {
  const supabase = createSupabaseServiceClient();

  const { data: existing, error: selectError } = await supabase
    .from("waitlist")
    .select("id, confirmed")
    .eq("email", row.email)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing?.confirmed) {
    return { status: "confirmed_duplicate" as const };
  }

  if (existing) {
    await refreshPendingWaitlistSignup(existing.id, row);
    return { status: "pending_duplicate" as const };
  }

  const { error } = await supabase.from("waitlist").insert(row);

  if (error) {
    if (error.code === "23505") {
      return upsertWaitlist(row);
    }

    throw error;
  }

  return { status: "created" as const };
}

async function refreshPendingWaitlistSignup(id: string, row: WaitlistInsert) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from("waitlist")
    .update({
      source: row.source,
      country: row.country,
      user_agent: row.user_agent,
      consent_marketing: row.consent_marketing,
      confirmed: row.confirmed,
      confirmed_at: row.confirmed_at,
      resend_message_id: null,
      metadata: row.metadata,
      updated_at: row.confirmed_at ?? new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function recordWaitlistEmailSent(email: string, messageId: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from("waitlist")
    .update({
      resend_message_id: messageId,
      updated_at: new Date().toISOString()
    })
    .eq("email", email);

  if (error) {
    throw error;
  }
}

export async function insertPageEvent({
  eventType,
  sessionId,
  metadata
}: {
  eventType: string;
  sessionId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("page_events").insert({
    event_type: eventType,
    session_id: sessionId ?? null,
    metadata: metadata ?? {}
  });

  if (error) {
    throw error;
  }
}

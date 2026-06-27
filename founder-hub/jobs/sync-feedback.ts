import { createGeminiAnalysisClient } from "@/ai/client";
import { classifyFeedbackEmail } from "@/ai/feedback-agent";
import type { FounderHubEnv } from "@/lib/env";
import { isActionableFeedbackEmail, presentFeedbackEmail } from "@/lib/signal-cleaning";
import { defaultFounderHubSettings } from "@/settings/defaults";
import { fetchFounderHubEmails } from "@/services/gmail";
import { createFounderHubSupabase, saveFeedbackEmails } from "@/services/supabase";

export async function syncGmailFeedback(env: FounderHubEnv) {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleRefreshToken) {
    return { configured: false, emails: [] };
  }

  const emails = await fetchFounderHubEmails({
    credentials: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      refreshToken: env.googleRefreshToken
    },
    query: defaultFounderHubSettings.gmailQuery
  });
  const client = env.geminiApiKey ? createGeminiAnalysisClient({ apiKey: env.geminiApiKey }) : undefined;
  const classified = [];

  for (const email of emails) {
    if (!isActionableFeedbackEmail(email)) continue;
    classified.push(presentFeedbackEmail(await classifyFeedbackEmail(presentFeedbackEmail(email), client)));
  }

  await saveFeedbackEmails(createFounderHubSupabase(env), classified);
  return { configured: true, emails: classified };
}

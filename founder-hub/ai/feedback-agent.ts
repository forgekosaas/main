import type { AnalysisClient } from "@/ai/client";
import { feedbackPrompt } from "@/prompts/feedback";
import type { FeedbackEmail } from "@/types/founder-hub";

export async function classifyFeedbackEmail(
  email: FeedbackEmail,
  client?: AnalysisClient
): Promise<FeedbackEmail> {
  if (!client) {
    return email;
  }

  try {
    const result = await client.analyzeJson<Pick<FeedbackEmail, "category" | "summary" | "painPoint">>({
      instructions: feedbackPrompt,
      input: email
    });

    return { ...email, ...result };
  } catch {
    return email;
  }
}

import type { FeedbackEmail, FounderHubSnapshot } from "@/types/founder-hub";

export function presentFeedbackEmail(email: FeedbackEmail): FeedbackEmail {
  if (isNewWaitlistNotification(email)) {
    const source = extractField(email.summary, "Source") || "unknown source";
    const country = extractField(email.summary, "Country");
    return {
      ...email,
      category: "Waitlist",
      summary: `New waitlist signup from ${source}${country ? ` in ${country}` : ""}.`,
      snippet: `Source: ${source}${country ? `, country: ${country}` : ""}`,
      painPoint: "waitlist intent"
    };
  }

  const cleaned = cleanTechnicalEmailText(email.summary || email.snippet);
  return {
    ...email,
    summary: cleaned || email.summary,
    snippet: cleanTechnicalEmailText(email.snippet) || cleaned || email.snippet
  };
}

export function isActionableFeedbackEmail(email: FeedbackEmail) {
  const text = `${email.subject} ${email.summary} ${email.snippet}`.toLowerCase();
  if (text.includes("confirm my email")) return false;
  if (email.subject.toLowerCase().includes("you're on the forgeko waitlist")) return false;
  return true;
}

export function reliableWaitlistCount(snapshot: Pick<FounderHubSnapshot, "feedback">) {
  const seen = new Set<string>();
  for (const email of snapshot.feedback) {
    if (!isActionableFeedbackEmail(email) || email.category !== "Waitlist") continue;
    seen.add(extractField(email.summary, "Email") || extractField(email.snippet, "Email") || email.id);
  }
  return seen.size;
}

export function actionableFeedbackCount(snapshot: Pick<FounderHubSnapshot, "feedback">) {
  return snapshot.feedback.filter((email) => isActionableFeedbackEmail(email) && email.category !== "Waitlist").length;
}

function isNewWaitlistNotification(email: FeedbackEmail) {
  return email.subject.toLowerCase().includes("a new user joined the forgeko waitlist");
}

function cleanTechnicalEmailText(value: string) {
  return decodeEntities(value)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\bEmail:\s*\S+/gi, "")
    .replace(/\bUser agent:\s*.*?(?=(Submitted|Source:|Country:|$))/gi, "")
    .replace(/\bSubmitted at:\s*\S+/gi, "")
    .replace(/\bSubmitted\b/gi, "")
    .replace(/\bCountry:\s*[A-Z]{2}\b/gi, "")
    .replace(/\bSource:\s*[\w-]+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 260);
}

function extractField(value: string, field: string) {
  const match = value.match(new RegExp(`${field}:\\s*([^\\s]+)`, "i"));
  return match?.[1]?.trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

import type { CommunityItem } from "@/types/founder-hub";

export function normalizeCommunityCopy(item: CommunityItem): CommunityItem {
  return {
    ...item,
    userLanguage: normalizeUserLanguage(item.userLanguage, item),
    postAngle: item.postAngle?.trim() || postAngleForPainPoint(item.painPoint, item.title),
    suggestedReply: normalizeSuggestedReply(item.suggestedReply, item.painPoint, item.title)
  };
}

export function normalizeSuggestedReply(reply: string | undefined, painPoint: string, title: string) {
  const trimmed = reply?.trim() ?? "";
  const lower = trimmed.toLowerCase();
  const generic =
    !trimmed ||
    lower.includes("share a short") ||
    lower.includes("ask one clarifying") ||
    lower.startsWith("you could") ||
    lower.startsWith("suggest");

  return generic ? draftReplyForPainPoint(painPoint, title) : trimmed;
}

export function draftReplyForPainPoint(painPoint: string, title: string) {
  if (painPoint.includes("validation")) {
    return "I’d separate this into two signals: what people say they want, and what they actually try to do next. What have you already tested: a landing page, a waitlist, or direct conversations with the people who would use it?";
  }

  if (painPoint.includes("roadmap")) {
    return `One thing that helps is ranking the next feature by evidence, not excitement: repeated user pain, clear willingness to try it, and whether it removes a real blocker. What signal is currently pushing "${title}" to the top of your list?`;
  }

  if (painPoint.includes("launch")) {
    return "For a small launch I’d keep the goal narrow: one audience, one promise, one place to measure intent. Are you trying to get feedback, waitlist signups, or first users from this launch?";
  }

  if (painPoint.includes("growth")) {
    return "I’d start by making the channel signal visible before changing the channel. Which source brought the most qualified visitors, and what page or CTA did they hit next?";
  }

  return "This sounds like the hard part is not doing more work, but deciding which signal deserves attention first. What would make this feel clearly solved: more user replies, clearer analytics, or a smaller next step?";
}

export function postAngleForPainPoint(painPoint: string, title: string) {
  if (painPoint.includes("validation")) {
    return "X post: Most founders do not need more validation rituals. They need one sharper signal: did a real user try to solve this problem today?";
  }

  if (painPoint.includes("roadmap")) {
    return "X post: A roadmap gets easier when every feature is tied to a customer quote, a behavior signal, or a blocked workflow.";
  }

  if (painPoint.includes("launch")) {
    return "X post: A launch is not one announcement. It is a week of reading which promise, channel, and objection actually moved people.";
  }

  if (painPoint.includes("growth")) {
    return "X post: Growth advice is noisy until you can see which traffic source brought people who cared enough to click the next step.";
  }

  return `X post: The hidden cost of solo building is context switching between product, feedback, analytics, and distribution. Example signal: "${title}".`;
}

function normalizeUserLanguage(language: string[] | undefined, item: CommunityItem) {
  const values = Array.isArray(language) ? language.map((value) => value.trim()).filter(Boolean).slice(0, 4) : [];
  if (values.length > 0) return values;

  return [item.title, item.summary]
    .flatMap((text) => text.split(/[.!?;]/))
    .map((part) => part.trim())
    .filter((part) => part.length >= 12 && part.length <= 90)
    .slice(0, 4);
}

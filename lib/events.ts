export const allowedEventTypes = [
  "CTA_Hero_Click",
  "CTA_Solution_Click",
  "Scroll_HowItWorks",
  "Scroll_SocialProof",
  "Feedback_FormFocus",
  "Feedback_Submit",
  "Waitlist_FormFocus",
  "Waitlist_Submit",
  "Waitlist_Confirmed"
] as const;

export type AllowedEventType = (typeof allowedEventTypes)[number];

const allowedEventSet = new Set<string>(allowedEventTypes);

export function isAllowedEventType(eventType: string): eventType is AllowedEventType {
  return allowedEventSet.has(eventType);
}

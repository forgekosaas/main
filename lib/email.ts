import { Resend } from "resend";

import { getServerEnv } from "@/lib/env";

export async function sendConfirmationEmail({
  email,
  confirmUrl
}: {
  email: string;
  confirmUrl: string;
}) {
  const env = getServerEnv();
  const resend = new Resend(env.resendApiKey);

  const result = await resend.emails.send({
    from: `Forgeko <${env.resendFromEmail}>`,
    to: email,
    subject: "You're on the Forgeko waitlist.",
    text: [
      "You're in.",
      "",
      "We'll reach out when private beta opens — no spam, no pitch decks, just a real update when something is ready.",
      "",
      "In the meantime, confirm your email so we know it's really you.",
      "",
      `Confirm my email: ${confirmUrl}`,
      "",
      "— The Forgeko team"
    ].join("\n"),
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111111">
        <p>You're in.</p>
        <p>We'll reach out when private beta opens — no spam, no pitch decks, just a real update when something is ready.</p>
        <p>In the meantime, confirm your email so we know it's really you.</p>
        <p><a href="${confirmUrl}" style="color:#4F46E5">Confirm my email →</a></p>
        <p>— The Forgeko team</p>
      </div>
    `
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { id: result.data?.id };
}

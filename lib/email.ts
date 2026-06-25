import { Resend } from "resend";

import { getServerEnv } from "@/lib/env";
import type { WaitlistSource } from "@/lib/waitlist";

export async function sendWaitlistWelcomeEmail({ email }: { email: string }) {
  const env = getServerEnv();
  const resend = new Resend(env.resendApiKey);

  const result = await resend.emails.send({
    from: `Forgeko <${env.resendFromEmail}>`,
    replyTo: env.resendReplyToEmail,
    to: email,
    subject: "You're on the Forgeko waitlist.",
    text: [
      "You're in.",
      "",
      "Thanks for joining the Forgeko waitlist.",
      "",
      "We'll let you know when the first version is ready.",
      "",
      "If another solo founder comes to mind, feel free to share https://forgeko.com.",
      "",
      "— The Forgeko team"
    ].join("\n"),
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111111">
        <p>You're in.</p>
        <p>Thanks for joining the Forgeko waitlist.</p>
        <p>We'll let you know when the first version is ready.</p>
        <p>If another solo founder comes to mind, feel free to share <a href="https://forgeko.com" style="color:#4F46E5">forgeko.com</a>.</p>
        <p>— The Forgeko team</p>
      </div>
    `
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { id: result.data?.id };
}

export async function sendNewWaitlistUserEmail({
  email,
  source,
  country,
  userAgent
}: {
  email: string;
  source: WaitlistSource;
  country: string | null;
  userAgent: string | null;
}) {
  const env = getServerEnv();
  const resend = new Resend(env.resendApiKey);
  const submittedAt = new Date().toISOString();

  const result = await resend.emails.send({
    from: `Forgeko <${env.resendFromEmail}>`,
    replyTo: env.resendReplyToEmail,
    to: env.forgekoAdminEmail,
    subject: "A NEW USER joined the Forgeko waitlist",
    text: [
      "A NEW USER joined the Forgeko waitlist.",
      "",
      `Email: ${email}`,
      `Source: ${source}`,
      `Country: ${country ?? "unknown"}`,
      `User agent: ${userAgent ?? "unknown"}`,
      `Submitted at: ${submittedAt}`
    ].join("\n"),
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111111">
        <h1 style="font-size:20px;margin:0 0 16px">A NEW USER</h1>
        <p>A new user joined the Forgeko waitlist.</p>
        <ul>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Source:</strong> ${escapeHtml(source)}</li>
          <li><strong>Country:</strong> ${escapeHtml(country ?? "unknown")}</li>
          <li><strong>User agent:</strong> ${escapeHtml(userAgent ?? "unknown")}</li>
          <li><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</li>
        </ul>
      </div>
    `
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { id: result.data?.id };
}

export async function sendFeedbackEmail({
  email,
  message,
  source,
  country,
  userAgent
}: {
  email: string;
  message: string;
  source: string;
  country: string | null;
  userAgent: string | null;
}) {
  const env = getServerEnv();
  const resend = new Resend(env.resendApiKey);
  const submittedAt = new Date().toISOString();

  const result = await resend.emails.send({
    from: `Forgeko <${env.resendFromEmail}>`,
    replyTo: email,
    to: env.forgekoAdminEmail,
    subject: `New Forgeko feedback from ${email}`,
    text: [
      "New Forgeko feedback.",
      "",
      `From: ${email}`,
      `Source: ${source}`,
      `Country: ${country ?? "unknown"}`,
      `User agent: ${userAgent ?? "unknown"}`,
      `Submitted at: ${submittedAt}`,
      "",
      "Message:",
      message
    ].join("\n"),
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111111">
        <h1 style="font-size:20px;margin:0 0 16px">New Forgeko feedback</h1>
        <p><strong>From:</strong> ${escapeHtml(email)}</p>
        <p><strong>Source:</strong> ${escapeHtml(source)}<br/>
        <strong>Country:</strong> ${escapeHtml(country ?? "unknown")}<br/>
        <strong>User agent:</strong> ${escapeHtml(userAgent ?? "unknown")}<br/>
        <strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</p>
        <hr style="border:none;border-top:1px solid #dddddd;margin:20px 0"/>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { id: result.data?.id };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

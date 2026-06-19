import Link from "next/link";

export default function SecurityPage() {
  return (
    <main className="mx-auto min-h-screen max-w-copy px-5 py-16 sm:px-6">
      <Link href="/" className="focus-ring text-sm text-neutral-400 hover:text-forgeko-text">
        ← Back to Forgeko
      </Link>
      <h1 className="mt-10 text-4xl font-semibold text-forgeko-text">Security</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-neutral-300">
        <p>Forgeko is designed around least-privilege data access, server-side secret handling, and explicit user approval for major actions.</p>
        <p>The waitlist stores email addresses and confirmation metadata in Supabase with Row Level Security enabled. Service-role operations stay server-side.</p>
        <p>Confirmation links use hashed tokens. Raw confirmation tokens are sent by email and are not stored in the database.</p>
        <p>To report a security issue, contact hello@forgeko.com with a concise description and reproduction steps. Please do not publicly disclose issues before we have had time to respond.</p>
      </div>
    </main>
  );
}

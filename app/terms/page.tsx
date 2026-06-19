import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-copy px-5 py-16 sm:px-6">
      <Link href="/" className="focus-ring text-sm text-neutral-400 hover:text-forgeko-text">
        ← Back to Forgeko
      </Link>
      <h1 className="mt-10 text-4xl font-semibold text-forgeko-text">Terms of Service</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-neutral-300">
        <p>Forgeko is currently in private development. Joining the waitlist does not create a paid account or guarantee access to the private beta.</p>
        <p>Updates sent to waitlist members are informational. Product capabilities, pricing, and access timing may change before launch.</p>
        <p>Forgeko may describe compliance preparation workflows and legal document templates. Forgeko is not a law firm and does not provide legal advice.</p>
        <p>Do not use the waitlist form for abuse, spam, security testing without permission, or attempts to disrupt the service.</p>
        <p>These base terms are intended for pre-release validation and should be reviewed before public launch.</p>
      </div>
    </main>
  );
}

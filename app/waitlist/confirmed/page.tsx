import Link from "next/link";

export default function WaitlistConfirmedPage({
  searchParams
}: {
  searchParams?: { status?: string };
}) {
  const status = searchParams?.status;
  const isError = Boolean(status);

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="max-w-xl border border-forgeko-border bg-forgeko-section p-8">
        <h1 className="text-3xl font-semibold text-forgeko-text">
          {isError ? "Confirmation link expired." : "Email confirmed."}
        </h1>
        <p className="mt-5 text-base leading-7 text-neutral-300">
          {isError
            ? "The confirmation link is invalid or has already been used. You can join the waitlist again from the landing page if needed."
            : "You're confirmed on the Forgeko waitlist. We'll send updates when private beta access is ready."}
        </p>
        <Link className="focus-ring mt-8 inline-flex text-sm font-medium text-forgeko-text underline underline-offset-4" href="/">
          Back to Forgeko
        </Link>
      </div>
    </main>
  );
}

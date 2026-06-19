import Link from "next/link";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Forgeko collects the email address you submit to join the waitlist, the consent state attached to that submission, basic technical request metadata, and confirmation status.
      </p>
      <p>
        We use this information to manage the private beta waitlist, send product updates you requested, prevent abuse, and measure whether the landing page is working.
      </p>
      <p>
        Marketing email is based on consent. You can unsubscribe from future updates at any time using the link included in Forgeko emails or by contacting hello@forgeko.com.
      </p>
      <p>
        Privacy-conscious analytics and session tools are loaded only after analytics consent. Forgeko does not sell personal data.
      </p>
      <p>
        Forgeko is developed from Italy/EU with a GDPR-first posture. This pre-release policy is a base document and should be reviewed before public launch.
      </p>
    </LegalPage>
  );
}

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-copy px-5 py-16 sm:px-6">
      <Link href="/" className="focus-ring text-sm text-neutral-400 hover:text-forgeko-text">
        ← Back to Forgeko
      </Link>
      <h1 className="mt-10 text-4xl font-semibold text-forgeko-text">{title}</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-neutral-300">{children}</div>
    </main>
  );
}

export const metadata = {
  title: "Forgeko API Documentation",
  description: "Public API documentation for Forgeko waitlist and event endpoints."
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen px-5 py-20 sm:px-6">
      <article className="mx-auto max-w-copy copy-prose">
        <h1 className="text-4xl font-semibold tracking-normal text-forgeko-text">Forgeko API</h1>
        <p className="mt-6 text-lg leading-8 text-neutral-300">
          Forgeko exposes a small public API for waitlist signup and first-party page events. Machine-readable discovery is available through the API catalog and OpenAPI document.
        </p>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-forgeko-text">Discovery</h2>
          <ul className="mt-4 space-y-3 text-neutral-300">
            <li>
              API catalog: <a className="underline underline-offset-4" href="/.well-known/api-catalog">/.well-known/api-catalog</a>
            </li>
            <li>
              OpenAPI: <a className="underline underline-offset-4" href="/openapi.json">/openapi.json</a>
            </li>
          </ul>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-forgeko-text">POST /api/waitlist</h2>
          <p className="mt-4 text-neutral-300">Creates or refreshes a waitlist signup after explicit marketing consent.</p>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-forgeko-text">POST /api/events</h2>
          <p className="mt-4 text-neutral-300">Records allowlisted landing page events for conversion analysis.</p>
        </section>
      </article>
    </main>
  );
}

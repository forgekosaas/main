# Security and File Structure

This project is a Next.js App Router application deployed through OpenNext on Cloudflare Workers. The most important rule for file exposure is simple:

> Everything inside `public/` is public by design and can be requested directly by URL.

If a file should not be visible at `https://forgeko.com/file-name`, it must not be placed in `public/`.

## Public vs Private Files

Use this structure:

```text
public/              Only files intended to be reachable by URL
assets/              Source assets used by the project, not served directly
docs/                Project documentation safe to publish in the repository
docs/specs/          Product and landing specifications safe for maintainers
supabase/migrations/ Database schema and migrations
private/             Local-only private material, ignored by Git
secrets/             Local-only credentials or exported secrets, ignored by Git
local/               Local notes, scratch files, experiments, ignored by Git
```

## What Can Live in `public/`

Good candidates:

- favicon files;
- manifest;
- robots and sitemap files;
- public brand images;
- Open Graph images;
- public `llms.txt`, `humans.txt`, and `security.txt`.

Examples in this project:

```text
public/favicon.ico
public/favicon-48.png
public/manifest.json
public/robots.txt
public/sitemap.xml
public/logo-on-dark.png
public/logo-on-light.png
```

## What Must Not Live in `public/`

Never put these in `public/`:

- `.env` files;
- API keys;
- Supabase service-role keys;
- Resend API keys;
- private business notes;
- unreleased strategy documents;
- customer exports;
- database dumps;
- CSVs with emails;
- private PDFs;
- screenshots containing dashboards, tokens, or personal data.

If one of these files is placed in `public/`, it can be downloaded by anyone who knows or guesses the URL.

## Where Private Files Should Go

Use one of the ignored local folders:

```text
private/
secrets/
local/
```

These folders are ignored by `.gitignore`, so they stay local and do not get committed to GitHub.

Example:

```text
private/founder-notes.md
private/customer-export.csv
secrets/resend-api-key.txt
local/scratch.md
```

Do not import files from these folders in production code. They are for local reference only.

## Handling Environment Variables

Keep real secrets in deployment provider variables and local `.env.local` files.

Safe to commit:

```text
.env.example
```

Never commit:

```text
.env
.env.local
.env.production
.dev.vars
```

Current sensitive variables:

- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `FOUNDER_HUB_ANALYTICS_TOKEN`

These are server-only. They must never be exposed in client components or `NEXT_PUBLIC_*` variables.

## Client-Visible Variables

Any variable prefixed with `NEXT_PUBLIC_` can be bundled into client-side JavaScript.

Only use `NEXT_PUBLIC_` for values that are safe for visitors to see, such as:

- public site URL;
- public Supabase anon key;
- public Cloudflare Turnstile site key.

Do not create variables like:

```text
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_RESEND_API_KEY
```

## API Routes for Private Operations

Private operations should happen in server routes under `app/api/`.

Current examples:

- `app/api/waitlist/route.ts`
- `app/api/feedback/route.ts`
- `app/api/events/route.ts`
- `app/p/umami/send/route.ts`

The browser sends a request to the API route. The API route uses server-side environment variables. The secret never reaches the browser.

## Pre-Commit Security Checklist

Before committing:

```bash
git status --short
git diff --check
git ls-files | rg "(^|/)(\\.env$|\\.env\\.(local|development|production|preview|staging|test)|\\.dev\\.vars)|secret|password|private|\\.pem$|\\.key$|\\.p12$|\\.pfx$"
```

Expected:

- no real `.env` files tracked;
- no private keys tracked;
- no private exports in `public/`;
- no unexpected generated files staged.

If a secret was committed accidentally, removing it in a later commit is not enough. Rotate the secret in the provider and purge history if required.

## Practical Rule

When adding a new file, ask:

1. Should a visitor be able to download this by URL?
2. Should this be visible on GitHub?
3. Does it contain credentials, customer data, private strategy, or unreleased information?

If the answer to 1 is no, do not put it in `public/`.

If the answer to 2 is no, put it in `private/`, `secrets/`, or `local/`.

If the answer to 3 is yes, never commit it.

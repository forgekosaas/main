# Forgeko Landing

Forgeko is a pre-release landing and waitlist site for an AI startup operating system built for solo SaaS founders.

The site is designed to validate demand, explain the product positioning, collect waitlist signups, receive feedback, and expose clean public discovery files for search engines and AI agents.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Supabase for waitlist and event storage
- Resend for waitlist welcome, feedback, and admin notification emails
- Microsoft Clarity and first-party Plausible proxy for analytics
- OpenNext Cloudflare for Worker deployment
- Vitest and ESLint for verification

## Project Structure

```text
app/                 Next.js routes, metadata, API handlers, legal pages
components/          Landing sections, forms, and client UI
lib/                 Waitlist, feedback, analytics, Supabase, and email helpers
public/              Public files served directly by URL
assets/brand/        Source logo exports and brand assets not served directly
supabase/migrations/ Database schema and migrations
tests/               Vitest coverage for waitlist, feedback, analytics, and discovery
docs/                Project documentation safe to publish in the repository
docs/specs/          Product and landing specifications
```

Important security rule:

> Files inside `public/` are public. Anything private must stay outside `public/` and outside Git.

See [docs/SECURITY_AND_FILE_STRUCTURE.md](docs/SECURITY_AND_FILE_STRUCTURE.md) for the file safety policy.

## Local Development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill the required values in `.env.local`, then start the app:

```bash
npm run dev
```

Open `http://127.0.0.1:3000`.

## Environment Variables

`.env.example` documents the expected configuration. Real values must live in `.env.local` locally and in Cloudflare environment variables for production.

Required server-side secrets:

```bash
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

These values must never be exposed through `NEXT_PUBLIC_*` variables or committed to Git.

Public configuration:

```bash
NEXT_PUBLIC_SITE_URL=https://forgeko.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLARITY_PROJECT_ID=x98rtg96a8
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=forgeko.com
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=/p/js/script.js
NEXT_PUBLIC_PLAUSIBLE_ENDPOINT=/p/event
```

Email configuration:

```bash
RESEND_FROM_EMAIL=hello@forgeko.com
RESEND_REPLY_TO_EMAIL=forgeko.saas@gmail.com
FORGEKO_ADMIN_EMAIL=forgeko.saas@gmail.com
```

Plausible proxy configuration:

```bash
PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/pa-ujaKFMibRz2V4FE8Cum9M.js
PLAUSIBLE_ORIGIN=https://plausible.io
```

## Database

Apply the Supabase migrations before testing real waitlist flows:

```text
supabase/migrations/*.sql
```

The migrations create waitlist storage, page event storage, indexes, and RLS policies.

## Verification

Run the full local verification suite before committing or deploying:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run cf:build
```

Useful security check before committing:

```bash
git status --short
git ls-files | rg "(^|/)(\.env$|\.env\.(local|development|production|preview|staging|test)|\.dev\.vars)|secret|password|private|\.pem$|\.key$|\.p12$|\.pfx$"
```

Expected: no real environment files, private keys, password files, or private exports are tracked.

## Deployment

The production target is Cloudflare Workers through OpenNext:

```bash
npm run deploy
```

The deployment script runs:

```bash
opennextjs-cloudflare build && opennextjs-cloudflare deploy --keep-vars
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full deployment checklist.

## Public Routes and Files

Key pages:

- `/`
- `/privacy`
- `/terms`
- `/security`
- `/docs/api`

Key API routes:

- `POST /api/waitlist`
- `POST /api/feedback`
- `POST /api/events`
- `GET /p/js/script.js`
- `POST /p/event`

Public discovery files:

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/llms-full.txt`
- `/humans.txt`
- `/security.txt`
- `/.well-known/api-catalog`
- `/openapi.json`

## Documentation

- [Deployment](docs/DEPLOYMENT.md)
- [Security and File Structure](docs/SECURITY_AND_FILE_STRUCTURE.md)
- [Growth Marketing Plan](docs/FORGEKO_GROWTH_MARKETING_PLAN.md)
- [Landing Spec](docs/specs/FORGEKO_LANDING_SPEC.md)
- [Master Spec](docs/specs/FORGEKO_MASTER_SPEC.md)

# Forgeko Landing

Pre-release waitlist landing for Forgeko, an AI-guided operating system for solo SaaS builders.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase for waitlist and event storage
- Resend for double opt-in email
- OpenNext Cloudflare for deployment

## Project Structure

```text
app/                 Next.js routes, metadata, API handlers, legal pages
components/          Landing sections and client UI
lib/                 Waitlist, analytics, Supabase, email, crypto helpers
public/              SEO, AI SEO, manifest, icons, OG image, optimized logo
supabase/migrations/ Waitlist and event database schema
tests/               Vitest coverage for waitlist and confirmation behavior
docs/specs/          Source product and landing specifications
assets/brand/        Source logo exports
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run cf:build
```

## Environment

Copy `.env.example` to `.env.local` and fill the production provider values:

```bash
NEXT_PUBLIC_SITE_URL=https://forgeko.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@forgeko.com
RESEND_REPLY_TO_EMAIL=forgeko.saas@gmail.com
NEXT_PUBLIC_CLARITY_PROJECT_ID=x98rtg96a8
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=forgeko.com
NEXT_PUBLIC_PLAUSIBLE_API_HOST=
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/pa-ujaKFMibRz2V4FE8Cum9M.js
```

Run `supabase/migrations/001_waitlist.sql` before testing the real waitlist flow.

## Deploy

The deploy target is Cloudflare via OpenNext:

```bash
npm run cf:build
npm run cf:deploy
```

See `docs/DEPLOYMENT.md` for the deployment checklist.

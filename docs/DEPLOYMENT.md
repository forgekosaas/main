# Forgeko Landing Deployment

## Required Services

- Cloudflare account with `forgeko.com` configured.
- Supabase project with `supabase/migrations/001_waitlist.sql` applied.
- Resend account with the sending domain verified.
- Optional Microsoft Clarity project id.
- Optional self-hosted Plausible endpoint.

## Environment Variables

Configure these in Cloudflare before deploy:

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

Do not expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to the client.
Use `hello@forgeko.com` only after verifying `forgeko.com` in Resend. Keep `forgeko.saas@gmail.com` as the reply-to inbox.

## Pre-Deploy Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run cf:build
```

Expected result: all commands pass. OpenNext currently prints a Windows compatibility warning; use WSL or CI/Linux for production deployment if Cloudflare runtime issues appear.

## Cloudflare Workers Builds

`wrangler.jsonc` includes a `build.command` that runs `npm run cf:build`, so Wrangler generates `.open-next` before uploading the Worker. This prevents `Could not find compiled Open Next config` when Cloudflare executes `npx wrangler deploy`.

Recommended Cloudflare build settings:

```bash
Install command: npm clean-install --progress=false
Build command:   leave empty
Deploy command:  npx wrangler deploy
```

`npm run deploy` is equivalent for local usage because it calls `wrangler deploy`.

For preview/non-production upload flows, use:

```bash
npm run upload
```

## Database

Apply:

```text
supabase/migrations/001_waitlist.sql
```

The migration creates:

- `waitlist`
- `page_events`
- indexes for confirmation and reporting
- RLS policies for public inserts and service-role operations

## Runtime QA

Before public launch:

- Submit a waitlist email with explicit consent.
- Confirm that Resend sends the confirmation email.
- Click the confirmation URL and verify `confirmed=true`.
- Verify `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/humans.txt`, and `/security.txt`.
- Verify `/privacy`, `/terms`, and `/security`.
- Check desktop and mobile layouts.

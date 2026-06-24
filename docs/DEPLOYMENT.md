# Forgeko Landing Deployment

## Required Services

- Cloudflare account with `forgeko.com` configured.
- Supabase project with `supabase/migrations/001_waitlist.sql` applied.
- Resend account with the sending domain verified.
- Optional Microsoft Clarity project id.
- Plausible script URL from your Plausible project, proxied through the Forgeko Cloudflare Worker.

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
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=/p/js/script.js
NEXT_PUBLIC_PLAUSIBLE_ENDPOINT=/p/event
PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/pa-ujaKFMibRz2V4FE8Cum9M.js
PLAUSIBLE_ORIGIN=https://plausible.io
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to the client.
Use `hello@forgeko.com` only after verifying `forgeko.com` in Resend. Keep `forgeko.saas@gmail.com` as the reply-to inbox.
Keep Plausible first-party in the browser: `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` must stay on `/p/js/script.js`, and `NEXT_PUBLIC_PLAUSIBLE_ENDPOINT` must stay on `/p/event`. If you run a self-hosted Plausible instance, point server-side `PLAUSIBLE_SCRIPT_URL` and `PLAUSIBLE_ORIGIN` to that instance; do not expose that origin as a public client script URL.

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

Use the npm deploy script so OpenNext builds `.open-next` before uploading the Worker. Do not use `npx wrangler deploy` directly in Cloudflare Workers Builds; Wrangler's OpenNext autodetect can call deploy before `.open-next` exists.

Recommended Cloudflare build settings:

```bash
Install command: npm clean-install --progress=false
Build command:   leave empty
Deploy command:  npm run deploy
```

`npm run deploy` runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`.

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
- Verify `/favicon.ico` and `/favicon-48.png` return `200`, and that the homepage includes both favicon links. Google may need a recrawl before the favicon appears in `site:forgeko.com`; request indexing in Search Console after deploy if needed.
- Verify `curl -I https://forgeko.com/` includes `Link: </.well-known/api-catalog>; rel="api-catalog"`.
- If Cloudflare Markdown for Agents is enabled on the zone, verify `curl -H "Accept: text/markdown" https://forgeko.com/` returns `Content-Type: text/markdown`.
- Verify `/p/js/script.js` returns JavaScript and `/p/event` forwards Plausible events from the Cloudflare Worker.
- Verify `/privacy`, `/terms`, and `/security`.
- Check desktop and mobile layouts.

# Forgeko Landing Deployment

## Required Services

- Cloudflare account with `forgeko.com` configured.
- Supabase project with all SQL files in `supabase/migrations/` applied.
- Resend account with the sending domain verified.
- Umami Cloud tracking for public website analytics.

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
FORGEKO_ADMIN_EMAIL=forgeko.saas@gmail.com
FOUNDER_HUB_ANALYTICS_TOKEN=
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to the client.
Use `hello@forgeko.com` only after verifying `forgeko.com` in Resend. Keep `forgeko.saas@gmail.com` as the reply-to and admin notification inbox unless a dedicated mailbox is configured.
Keep `FOUNDER_HUB_ANALYTICS_TOKEN` secret. It protects `/api/analytics/summary`, which Founder Hub uses for private funnel reporting.

## Umami Analytics

The root layout loads Umami Cloud directly:

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="87379995-b261-45d8-b9fc-e4c83cc3f4a6"></script>
```

No Umami environment variable or Cloudflare Worker proxy is required. The Content Security Policy must allow `https://cloud.umami.is` for script loading and event delivery.

After deploy, verify the homepage contains the Umami script:

```bash
curl -s https://forgeko.com/ | grep "cloud.umami.is/script.js"
```

Expected result: the HTML includes the Umami script and the browser console does not report CSP violations for `cloud.umami.is`.

## First-Party Funnel Analytics

The landing page also records allowlisted product funnel events through `/api/events` into Supabase `page_events`. This is separate from Umami and powers private Founder Hub reporting.

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
supabase/migrations/*.sql
```

The migration creates:

- `waitlist`
- `page_events`
- indexes for waitlist reporting
- RLS policies for public inserts and service-role operations

## Runtime QA

Before public launch:

- Submit a waitlist email with explicit consent.
- Confirm that Resend sends the short welcome email.
- Confirm that `FORGEKO_ADMIN_EMAIL` receives the "A NEW USER" notification for a newly created waitlist signup.
- Submit the contact feedback form and confirm the message reaches `FORGEKO_ADMIN_EMAIL`.
- Verify `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/humans.txt`, and `/security.txt`.
- Verify `/favicon.ico` and `/favicon-48.png` return `200`, and that the homepage includes both favicon links. Google may need a recrawl before the favicon appears in `site:forgeko.com`; request indexing in Search Console after deploy if needed.
- Verify `curl -I https://forgeko.com/` includes `Link: </.well-known/api-catalog>; rel="api-catalog"`.
- If Cloudflare Markdown for Agents is enabled on the zone, verify `curl -H "Accept: text/markdown" https://forgeko.com/` returns `Content-Type: text/markdown`.
- Verify the homepage includes the Umami script and that `/api/events` accepts allowlisted landing events.
- Verify `/privacy`, `/terms`, and `/security`.
- Check desktop and mobile layouts.

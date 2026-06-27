# Founder Hub

Founder Hub is a private, local-only decision dashboard for Forgeko.

Run it separately from the public Forgeko product:

```bash
cd founder-hub
npm install
npm run dev
```

Open `http://127.0.0.1:3030`.

On Windows you can also double-click `Start Founder Hub.cmd`. To create a desktop shortcut, double-click `Create Founder Hub Desktop Shortcut.cmd`.

Real API keys belong only in `founder-hub/.env.local`. The tracked `.env.example` contains placeholders only.

Data flow:

- Dashboard reads the latest saved Founder Hub snapshot from Supabase.
- `Update data` refreshes Forgeko first-party analytics, Supabase waitlist/page events, Gmail, Reddit, secondary Hacker News, and insights.
- Gmail messages are classified/summarized with AI and saved as feedback rows.
- Reddit reads selected subreddits only when Reddit API credentials are configured.
- Manual Reddit/X/IH items are analyzed with AI and saved as community items.
- Insights read saved community, analytics, waitlist, and feedback rows, then create cross-source pain point notes.
- `Check Data Flow` calls `/api/debug/flow` and shows counts plus recent route-level events.

If all dashboard numbers are zero, first apply `database/schema.sql` in Supabase, then run the sync buttons again.

External service posture:

- Reddit: official API, read-only listing/search requests only.
- Gmail: read-only message fetches only.
- Forgeko analytics: protected summary API read-only.
- X and Indie Hackers: manual URL/content input in V1.
- Gemini: server-side Interactions API only, using `gemini-3.5-flash` with `GEMINI_API`.

Founder Hub never posts, comments, sends email, charges users, or modifies external service data.

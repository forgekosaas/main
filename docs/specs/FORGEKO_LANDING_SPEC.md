# FORGEKO — LANDING PAGE SPEC
### Documento di specifica completo — Waitlist Pre-Launch
*Versione 1.0 — 19 Giugno 2026*

---

## 0. META

**Scopo del documento:** specifica completa e definitiva della landing page di waitlist per Forgeko. Copre contenuti, design, architettura tecnica, SEO classico, AI SEO, pubblicazione e analytics. Pensato per essere eseguito da un developer o da un'AI di sviluppo (Cursor, Claude Code, ecc.) senza ulteriori decisioni strategiche da prendere.

**Status:** Pre-sviluppo. Nessuna riga di codice ancora scritta. Questo documento è l'input per la Fase di build.

**Tipo di landing:** Waitlist (raccolta email pre-lancio, prodotto non ancora disponibile)

**Target primario (ICP Fase 1):** Developer / PM / Designer tech-adjacent — utenti che sanno valutare un tool tecnico, scettici verso il marketing, apprezzano trasparenza e precisione.

**Target secondario:** Solopreneur non tecnico — non è il focus della pagina, ma il prodotto è progettato per accoglierlo in futuro. Nessuna sezione è dedicata esplicitamente a lui in questa versione.

**Kill metric:** 50 email confermate in 7 giorni dal lancio.

---

## 1. STRATEGIA & COPY

Lingua: **Inglese**. Tono: diretto, onesto, tecnico ma accessibile. Zero hype, zero superlativi, zero urgency artificiale.

### Sezione 1 — Hero

**Headline:**
> Stop building. Start launching.

**Subheadline:**
> Forgeko turns your SaaS idea into a running business — validation, landing, payments, growth analytics. AI-guided, fully yours, and it never forgets where you left off.

**Micro-CTA:**
> *Sounds like what you've been looking for? Join the waitlist — takes 10 seconds.*
> (anchor link → Sezione 7)

---

### Sezione 2 — Il Problema

> Building a SaaS solo is not a creativity problem.
> It's a coordination problem.
>
> You validate an idea in Notion. Build a landing in Bolt. Set up payments manually in Stripe. Figure out compliance yourself. Track growth in a spreadsheet.
>
> Five tools. No shared context. No memory of what you decided last week.
>
> Every time you start a new session — with an AI or with yourself — you're rebuilding context from scratch.
>
> *That's the overhead that kills solo projects. Not the code.*

---

### Sezione 3 — La Soluzione

**Intro:**
> Forgeko is a single environment where your SaaS project lives from day one to traction.
>
> Not a code generator. Not another no-code builder.
> A system that holds the full context of your project — and uses it at every step.

**Tre pilastri:**

**One project. One place. Full context.**

**→ From idea to launch, guided.**
Validation, landing page, payments, domain — each step builds on the previous one. No context switching, no setup from scratch.

**→ AI that knows your project.**
Every decision you approve becomes part of your Project Memory. The AI doesn't start over every session — it picks up exactly where you left off.

**→ Growth built in, not bolted on.**
Weekly reports, conversion analytics, and optimization suggestions — generated from your actual data, not generic advice.

**Micro-CTA:**
> *Sounds like what you've been looking for?*
> [Join the waitlist →] (anchor link)

---

### Sezione 4 — Come Funziona

**Intro:**
> You start with an idea. Forgeko walks you through the rest.

**① Validate**
*You describe your idea. Forgeko stress-tests it — market, competitors, positioning. You end up with a strategic canvas, not just a hype doc.*

**② Build**
*Landing page, brand identity, core features — generated from your canvas, not from a blank prompt. Every component is yours to edit, approve, or reject.*

**③ Ship**
*Payments, domain, SSL — connected and configured inside Forgeko. No jumping between dashboards. No manual DNS nightmares.*

**④ Grow**
*Weekly growth reports, conversion data, optimization suggestions — all generated from your project's actual history. Forgeko remembers what you built and why.*

**Closing line:**
> At every step, your decisions are saved.
> That's your Project Memory — the context no other tool carries forward.

**Nota implementativa:** questa sezione richiede un elemento visivo forte (vedi Sezione 2 — Design System, Signature Element). Non va implementata come lista testuale piatta.

---

### Sezione 5 — Perché Forgeko È Diverso

**Opening:**
> There are great tools for generating code fast.
> Forgeko is not one of them.

**Code generators give you a starting point.**
*Forgeko gives you a system. The difference shows up 3 months in, not 3 hours in.*

**Most AI tools have no memory.**
*Every session starts from a blank slate. Forgeko accumulates context — your decisions, your approvals, your project history — and carries it forward indefinitely.*

**Shipping code is one step.**
*Validation, payments, compliance, growth — those come after. Forgeko is built for after.*

**Closing line:**
> If you need a quick prototype, use whatever works.
> If you're building something you intend to grow — Forgeko is where that project lives.

**Nota:** nessuna menzione esplicita di competitor (Bolt, Lovable, ecc.). Posizionamento per categoria, non per confronto diretto.

---

### Sezione 6 — Social Proof (Onesta)

> Forgeko is in private development.
> No fake testimonials. No vanity metrics.
> Just a small group of founders who got tired of the same coordination problems and decided to build the system they wished existed.

**What we're building toward:**

→ Private beta — limited seats, real feedback, direct access to the team
→ No lock-in — your code is always exportable, your data always yours
→ Built in public — progress updates to everyone on the waitlist

> We'd rather ship something honest than market something perfect.
> If that sounds like your kind of tool — you're in the right place.

**Nota implementativa:** stile visivo leggermente differenziato dal resto della pagina (vedi Design System) — è la sezione "umana".

---

### Sezione 7 — CTA Finale

**Opening:**
> You've read this far.
> You probably recognize the problem.

**Heading:**
> **Join the waitlist.**

**Subtext:**
> *Be among the first to access Forgeko when private beta opens.*
> *No spam. No pitch decks. Just updates when something real is ready.*

**Form:** `[ Your email ]` `[ Join waitlist → ]`

**Early access bullet:**
> Early access members get:
> → Direct line to the founding team
> → Influence over the roadmap
> → First seat when beta opens

**Closing line:**
> *We're building Forgeko because we needed it ourselves.
> If you're building solo and tired of the coordination overhead — we'll see you inside.*

**Nota:** unico form reale della pagina. La micro-CTA in Sezione 1 e 3 sono anchor link verso questo form, non form duplicati.

---

## 2. DESIGN SYSTEM

**Palette**
| Ruolo | Valore |
|---|---|
| Background primario | `#0A0A0A` |
| Background secondario (Sezione 6) | `#141414` |
| Testo primario | `#F5F5F5` |
| Accento unico | `#4F46E5` (indigo) |
| Border/divider | `#1F1F1F` |

**Tipografia**
- Display / Headline: **Geist**
- Body: **Inter**
- Accenti tecnici / monospace: **Geist Mono**
- Caricamento font: locale via `next/font` (mai Google Fonts CDN — evita richieste esterne, migliora LCP)

**Layout**
- Larghezza massima contenuto: 760px, centrata — tono "documento", non homepage larga
- Eccezione: Sezione 4 (Come Funziona) → full-width

**Signature Element**
Sezione 4: timeline orizzontale connessa — 4 cerchi numerati collegati da una linea sottile color accento. Animazione di illuminazione sequenziale allo scroll (Framer Motion). È l'unico elemento animato della pagina — il resto è statico, per coerenza con il tono "disciplinato" del brand.

---

## 3. ARCHITETTURA TECNICA

**Stack**
- Framework: **Next.js 14** (App Router)
- Hosting: **Cloudflare Pages** (con adapter `@cloudflare/next-on-pages`)
- Database: **Supabase**
- Styling: **Tailwind CSS**
- Animazioni: **Framer Motion** (solo Sezione 4)
- Email transazionale: **Resend**
- Dominio + DNS: **Cloudflare Registrar**

**Struttura progetto**

```
forgeko-landing/
├── app/
│   ├── page.tsx
│   ├── layout.tsx              # meta tag, fonts, OG, JSON-LD
│   ├── api/
│   │   ├── waitlist/
│   │   │   ├── route.ts        # POST — iscrizione
│   │   │   └── confirm/
│   │   │       └── route.ts    # GET — doppio opt-in
│   │   └── events/
│   │       └── route.ts        # POST — tracking eventi custom
├── components/
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── Solution.tsx
│   ├── HowItWorks.tsx          # timeline animata
│   ├── Differentiators.tsx
│   ├── SocialProof.tsx
│   ├── CTAFinal.tsx
│   └── FAQ.tsx                 # collassata, per AI SEO (vedi sez. 5)
├── lib/
│   └── supabase.ts
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── sitemap-index.xml
│   ├── llms.txt
│   ├── llms-full.txt
│   ├── humans.txt
│   ├── security.txt
│   ├── og-image.png
│   └── manifest.json
└── next.config.js
```

**Database — Supabase**

```sql
create table waitlist (
  id          uuid default gen_random_uuid() primary key,
  email       text unique not null,
  created_at  timestamptz default now(),
  source      text,                    -- 'hero' | 'solution' | 'cta_final'
  country     text,
  user_agent  text,
  confirmed   boolean default false,
  metadata    jsonb
);

create table page_events (
  id          uuid default gen_random_uuid() primary key,
  event_type  text not null,
  created_at  timestamptz default now(),
  session_id  text,
  metadata    jsonb
);
```

**RLS Policies**

```sql
create policy "Public insert" on waitlist
  for insert with check (true);

create policy "Service role read" on waitlist
  for select using (auth.role() = 'service_role');
```

**API Routes**

| Endpoint | Metodo | Funzione |
|---|---|---|
| `/api/waitlist` | POST | Valida email, salva su Supabase, invia conferma via Resend |
| `/api/events` | POST | Salva eventi comportamentali su `page_events`, fire-and-forget |

**Email transazionale (Resend)**

Subject: `You're on the Forgeko waitlist.`

```
You're in.

We'll reach out when private beta opens — no spam, no pitch decks,
just a real update when something is ready.

We'll let you know when the first version is ready.

[Confirm my email →]

— The Forgeko team
```

---

## 4. SEO CLASSICO

**Meta tag (`layout.tsx`)**

```typescript
export const metadata = {
  title: "Forgeko — The Operating System for Your SaaS",
  description: "From idea validation to first revenue. Forgeko guides solo builders through validation, landing, payments, and growth — in one environment that never forgets where you left off.",
  canonical: "https://forgeko.com",

  openGraph: {
    title: "Forgeko — Stop Building. Start Launching.",
    description: "The AI-guided environment for solo SaaS builders. Validation, landing, payments, growth — one system, full context.",
    url: "https://forgeko.com",
    siteName: "Forgeko",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Forgeko — Stop Building. Start Launching.",
    description: "The AI-guided environment for solo SaaS builders.",
    images: ["/og-image.png"],
  },
}
```

**Schema JSON-LD**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Forgeko",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "AI-guided operating system for solo SaaS builders. Validation, landing page, payments, growth analytics in one environment.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
  "url": "https://forgeko.com"
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Forgeko",
  "url": "https://forgeko.com",
  "logo": "https://forgeko.com/logo.png",
  "sameAs": []
}
```

**`robots.txt`**

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://forgeko.com/sitemap.xml
```

**`sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://forgeko.com</loc>
    <lastmod>2026-06-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Performance — vincoli di sviluppo**

- LCP < 2.5s — og-image in WebP, niente hero image pesanti
- CLS = 0 — font via `next/font`, nessun layout shift
- INP < 100ms — Framer Motion solo su Sezione 4
- Font locali, zero richieste CDN esterne

**Keyword strategy**

| Tipo | Keyword |
|---|---|
| Primary | solopreneur SaaS builder, AI SaaS operating system |
| Secondary | validate SaaS idea, launch SaaS solo, SaaS without coding |
| Long tail | how to launch a SaaS without a team, AI tool for solo founders |

Placement: H1, H2, prima frase di ogni sezione, alt tag og-image, meta description. Nessun keyword stuffing.

---

## 5. AI SEO

**`llms.txt`**

```markdown
# Forgeko

> Forgeko is an AI-guided operating system for solo SaaS builders.
> It covers the full journey from idea validation to growth analytics
> in a single environment with persistent Project Memory.

## What Forgeko does

- Validates SaaS ideas with AI-driven market and competitor analysis
- Generates landing pages, brand identity, and core features from a strategic canvas
- Configures payments, domain, and SSL without manual setup
- Tracks growth with weekly AI-generated reports based on actual project history
- Maintains Project Memory — every decision, approval, and milestone, carried forward indefinitely

## Who it's for

Solo builders, developers, PMs, and designers who want to launch a SaaS
without managing the coordination overhead of validation, compliance,
payments, and analytics across separate tools.

## What makes it different

Most AI tools have no memory. Every session starts from a blank slate.
Forgeko accumulates context across the entire lifecycle of a project —
not just the code, but the decisions behind it.

## Status

Currently in private development. Waitlist open at https://forgeko.com

## Contact

hello@forgeko.com
```

**`llms-full.txt`** — versione estesa, contiene l'intero copy della landing (Sezione 1 di questo documento) in Markdown puro, senza HTML.

**Regole di struttura semantica**

- Ogni sezione ha un `<h2>` descrittivo, non creativo (es. "How Forgeko works", non "The journey")
- La risposta alla domanda implicita della sezione sta nella prima frase
- "Forgeko" compare esplicitamente almeno una volta per sezione
- Nessuna metafora che richieda interpretazione

**FAQ strutturata (componente `FAQ.tsx`)**

Presente nel DOM, collassata visivamente — indicizzabile da LLM e Google:

```
Q: What is Forgeko?
A: Forgeko is an AI-guided operating system for solo SaaS builders...

Q: How is Forgeko different from code generators?
A: Code generators give you a starting point. Forgeko gives you a system...

Q: What is Project Memory?
A: Project Memory is Forgeko's persistent context layer...

Q: How much does Forgeko cost?
A: Forgeko offers a free tier, a Founder plan at €19/month...

Q: Who is Forgeko for?
A: Forgeko is built for solo developers, PMs, and designers...
```

**Strategia di citazioni esterne (al lancio)**

| Canale | Azione |
|---|---|
| IndieHackers | Post "Building Forgeko in public" — stesso linguaggio della landing |
| HackerNews | "Show HN: Forgeko — an AI operating system for solo SaaS builders" |
| Dev.to / Hashnode | Articolo tecnico sullo stack, Forgeko come caso d'uso |
| Twitter/X | Thread "Building in public: day 1" |

Questi canali sono sia distribuzione sia segnale semantico per gli LLM con browsing.

---

## 6. PUBBLICAZIONE

**Dominio**

- Prima scelta: `forgeko.com`
- Alternativa coerente con lo spec prodotto: `forgeko.app`
- Evitare `.io` — sovrasaturato, nessun vantaggio
- Registrar: **Cloudflare Registrar** (prezzo a costo, DNS nativo)

> ⚠️ Dominio non ancora confermato dall'utente al momento della stesura — da finalizzare prima del deploy.

**Hosting — Cloudflare Pages**

Scelto al posto di Vercel per: CDN globale più veloce, bandwidth illimitata gratuita, Workers senza cold start, tutto centralizzato in un unico pannello (dominio + DNS + hosting).
Richiede adapter `@cloudflare/next-on-pages` per il supporto Next.js 14 App Router.

**Configurazione sicurezza (headers)**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
        }
      ]
    }
  ],
  "redirects": [
    { "source": "/www", "destination": "https://forgeko.com", "permanent": true }
  ]
}
```

**Variabili d'ambiente**

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://forgeko.com
```

**DNS — sequenza di configurazione**

1. Acquisto dominio su Cloudflare Registrar
2. Collegamento dominio a Cloudflare Pages
3. SSL/TLS su Cloudflare → **Full (strict)**
4. Certificato SSL gestito automaticamente

**Supabase setup**

- RLS attivo con policy descritte in Sezione 3
- Conferma email gestita via token custom + Resend (non Supabase Auth)
- Backup automatici giornalieri abilitati dal giorno zero (piano Pro)

---

## 7. ANALYTICS & TRACKING

**Stack analytics**

| Tool | Scopo | Costo |
|---|---|---|
| Umami Cloud | Pageview, eventi aggregati, sorgenti traffico | €0 |
| Supabase (`page_events`) | Query custom, correlazione eventi/iscrizioni | €0 |

**Eventi custom tracciati**

```javascript
trackEvent('CTA_Hero_Click')
trackEvent('CTA_Solution_Click')
trackEvent('Scroll_HowItWorks')
trackEvent('Scroll_SocialProof')
trackEvent('Waitlist_FormFocus')
trackEvent('Waitlist_Submit')
```

**Query di monitoraggio kill metric**

```sql
select count(*) as confirmed_signups
from waitlist
where confirmed = true
and created_at > now() - interval '7 days';
```

---

## 8. APPENDICE — CHECKLIST ESECUTIVA

Ordine di esecuzione consigliato per chi sviluppa:

```
SETUP
□ Confermare dominio finale (forgeko.com o forgeko.app)
□ Registrare dominio su Cloudflare Registrar
□ Creare progetto Supabase, eseguire schema SQL (Sezione 3)
□ Attivare RLS policies
□ Creare account Resend, configurare dominio mittente
□ Creare progetto Cloudflare Pages, collegare repo

SVILUPPO
□ Scaffolding Next.js 14 (App Router) + Tailwind + Framer Motion
□ Implementare layout.tsx con font locali, meta tag, schema JSON-LD
□ Costruire le 7 sezioni component-by-component (copy da Sezione 1)
□ Implementare timeline animata Sezione 4
□ Implementare componente FAQ collassato (Sezione 5 AI SEO)
□ Costruire API routes (waitlist, confirm, events)
□ Collegare Supabase client
□ Integrare Resend per email di conferma

FILE SEO/AI SEO
□ robots.txt
□ sitemap.xml + sitemap-index.xml
□ llms.txt + llms-full.txt
□ humans.txt
□ security.txt
□ og-image.png (1200x630, WebP)
□ manifest.json

ANALYTICS
□ Integrare Umami Cloud
□ Verificare CSP per cloud.umami.is
□ Implementare i 7 eventi custom

PRE-LAUNCH QA
□ Form waitlist testato end-to-end (submit → welcome email → admin notification)
□ robots.txt, sitemap.xml, llms.txt accessibili pubblicamente
□ OG image testata su opengraph.xyz
□ Schema JSON-LD validato su Google Rich Results Test
□ Core Web Vitals testati (target: LCP<2.5s, CLS=0, INP<100ms)
□ Mobile testato su iOS Safari + Android Chrome
□ DNS propagato, SSL attivo (Full strict)
□ Redirect www → naked domain funzionante
□ Dashboard Umami + funnel interno raggiungibili

LANCIO
□ Deploy production su Cloudflare Pages
□ Post IndieHackers pubblicato
□ Show HN pubblicato
□ Thread Twitter/X pubblicato
□ Monitoraggio kill metric attivo (50 email confermate / 7 giorni)
```

---

*Fine documento. Pronto per essere passato a un'AI di sviluppo (Cursor, Claude Code) o a un developer per l'implementazione.*

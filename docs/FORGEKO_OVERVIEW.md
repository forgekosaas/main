# Forgeko — Overview

**Versione:** 1.0  
**Data:** 28 Giugno 2026  
**Scopo:** documento di sintesi che descrive Forgeko in ogni aspetto rilevante — prodotto, business, tecnologia e stato attuale — senza sostituire le specifiche di dettaglio.

---

## 1. Executive Summary

**Forgeko** è un sistema operativo AI per solo SaaS founders: un ambiente unico che accompagna un progetto dalla validazione dell'idea alla crescita post-lancio, mantenendo memoria persistente di ogni decisione.

Il problema che risolve non è la creatività o la velocità di generazione del codice. È la **coordinazione**: troppi tool (Notion, Bolt, Stripe, analytics, AI chat) senza contesto condiviso, con ogni sessione che riparte da zero.

Il differenziatore principale è la **Project Memory** — l'accumulo progressivo di documenti di stato, decisioni approvate e analytics storiche che rende Forgeko difficile da sostituire dopo mesi di utilizzo.

**Stato attuale:** prodotto in sviluppo privato. Live oggi: landing pre-release con waitlist su [forgeko.com](https://forgeko.com) e Founder Hub, dashboard interna per i founder.

**Posizionamento:** *The AI launch OS for solo SaaS founders.*

---

## 2. Visione e Posizionamento

### Cosa Forgeko è — e cosa non è

| Forgeko **è** | Forgeko **non è** |
| :--- | :--- |
| Sistema operativo verticale per solopreneur | Code generator tipo Bolt, Lovable o v0 |
| Percorso multifase: idea → lancio → crescita | Tool monofase che termina al deploy |
| Ambiente con memoria persistente del progetto | Chat AI senza contesto tra sessioni |
| Sistema che gestisce compliance, pagamenti, analytics | Boilerplate o template statico |

### Posizionamento nel mercato

Il mercato è affollato di strumenti che promettono velocità (Lovable, Bolt, Replit, v0), boilerplate SaaS (ShipFast, MakerKit) e tool di validazione (ValidatorAI, IdeaProof). Forgeko occupa lo spazio **tra** questi mondi: non solo costruzione, non solo validazione, ma un sistema operativo che mantiene il contesto nel tempo.

Quasi tutti promettono velocità. Forgeko promette **continuità**.

### USP

> *Forgeko non ti dà il codice. Ti dà l'azienda — dalla validazione dell'idea alla compliance GDPR, dal primo pagamento al report di crescita settimanale, in un unico ambiente che non ti abbandona dopo il deploy e ricorda ogni decisione che hai preso.*

### Moat: Project Memory

Il vero vantaggio difendibile non è il Legal Kit (replicabile da competitor in settimane) ma la **Project Memory**: dopo 3–6 mesi di utilizzo, migrare altrove significa lasciare indietro l'intera storia decisionale del business, non solo un documento legale.

### Confronto rapido

| Dimensione | Bolt / Lovable | Forgeko |
| :--- | :--- | :--- |
| Output principale | Codice React/Node | Business digitale end-to-end |
| Orizzonte temporale | Sessione singola | Ciclo di vita del business |
| Compliance | Assente | Nativa (Legal Kit dinamico) |
| Pagamenti | Integrazione manuale | Integrazione guidata |
| Analytics | Nessuna | Dashboard crescita AI-driven |
| Project Memory | Nessuna | Storia completa decisionale |

---

## 3. Il Problema e la Soluzione

### Il problema: coordinazione, non codice

Costruire un SaaS da solo non è un problema di creatività. È un problema di coordinazione.

L'esperienza tipica del target:

- validi l'idea in Notion;
- costruisci la landing in Bolt;
- configuri i pagamenti manualmente in Stripe;
- gestisci compliance da solo;
- tracci la crescita in un foglio di calcolo;
- ogni chat AI dimentica le decisioni precedenti.

Cinque tool. Nessun contesto condiviso. Nessuna memoria di cosa hai deciso la settimana scorsa. Ogni sessione — con un'AI o con te stesso — richiede di ricostruire il contesto da zero. **È questo overhead che uccide i progetti solo, non il codice.**

### La soluzione: un ambiente, contesto completo

Forgeko è un unico ambiente dove il progetto SaaS vive dal giorno uno alla trazione. Non un code generator, non un altro no-code builder: un sistema che detiene il contesto completo del progetto e lo usa ad ogni step.

**Tre pilastri:**

1. **One project. One place. Full context.** — Validazione, landing, pagamenti, dominio: ogni step costruisce sul precedente. Zero context switching.
2. **AI that knows your project.** — Ogni decisione approvata entra nella Project Memory. L'AI non riparte da zero: riprende esattamente da dove hai lasciato.
3. **Growth built in, not bolted on.** — Report settimanali, analytics di conversione, suggerimenti di ottimizzazione generati dai dati reali del progetto, non consigli generici.

### Il journey in 4 fasi

```
Validate  →  Build  →  Ship  →  Grow
```

| Fase | Cosa succede |
| :--- | :--- |
| **Validate** | Descrivi l'idea. Forgeko la stress-testa — mercato, competitor, positioning. Ottieni un canvas strategico, non un hype doc. |
| **Build** | Landing page, brand identity, feature core — generate dal canvas, non da un prompt vuoto. Ogni componente è tuo: edit, approva o rifiuta. |
| **Ship** | Pagamenti, dominio, SSL — connessi e configurati dentro Forgeko. Niente salti tra dashboard, niente incubi DNS. |
| **Grow** | Report settimanali, dati di conversione, suggerimenti di ottimizzazione — generati dalla storia reale del progetto. |

---

## 4. Target e Personas

### ICP Fase 1 — Lancio (mesi 1–6)

**"Il Builder Tech-Frustrato"**

Developer, PM, designer o growth marketer tech-adjacent con un'idea di business ma senza voglia di gestire compliance, domini, legal e infrastruttura ogni volta. È chi si trova su Indie Hackers, Hacker News, Reddit, X. Sa scrivere codice o capisce le basi, ma non vuole gestire DNS, GDPR, webhook Stripe e certificati SSL per ogni nuova idea.

### ICP Fase 2 — Crescita (mesi 7+)

**"Il Builder Non-Tecnico"**

Consulente, coach, marketer, creator o imprenditore tradizionale che vuole digitalizzarsi. Si raggiunge con canali diversi: LinkedIn, newsletter di business, community creator. Richiede onboarding più semplificato.

> **Nota:** non mischiare i due ICP nello stesso lancio. Messaggi che cercano di parlare a entrambi non parlano bene a nessuno.

### Casi d'uso principali

1. **Serial Validator** — Testa 3–5 idee in 2 mesi. Usa validazione + Fast Lane per landing rapide, raccoglie email, uccide le idee perdenti prima del backend.
2. **Service-to-Product Pivot** — Consulente/freelancer trasforma la metodologia in prodotto digitale. Costruisce, poi vende.
3. **Side-Project Monetizer** — Dipendente tech-adjacent costruisce micro-SaaS nel tempo libero. Forgeko gestisce infrastruttura e compliance.

### Anti-persona (chi escludere)

| Anti-persona | Perché |
| :--- | :--- |
| Sviluppatore senior con stack proprio | Troverà i vincoli limitanti |
| Team >5 persone | Manca RBAC, collaboration, audit log enterprise |
| Hobbista no-revenue | Non giustifica €19–29/mese |
| Cercatore di AI magic | Vuole risultati zero-click senza input strategico |
| Enterprise/B2B complex | Richiede SOC2, SSO SAML, DPA custom |

### Trigger di attivazione

- Ha già abbandonato 2–3 idee o side project mai andati live
- Ha un'idea e vuole testarla questo weekend
- Ha 15 tab aperte (Notion, Figma, Vercel, Stripe, Mailchimp) che non si parlano
- Ha una landing ma non sa se vende; ha un MVP ma mancano pagamenti, analytics o feedback loop

---

## 5. Il Prodotto: Architettura Funzionale

> **Stato:** 🔲 Pianificato — descritto nel Master Spec, non ancora implementato nel prodotto core.

### 5.1 I 4 dipartimenti e gli 8 step

Il prodotto è organizzato in 4 dipartimenti logici, ciascuno con 2 step operativi. La struttura riflette l'architettura dei dati e la sequenzialità dei Document-State generati.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DIPARTIMENTO 1          DIPARTIMENTO 2          DIPARTIMENTO 3         │
│  Validazione             Progettazione           Sviluppo               │
│  Step 1: Validazione     Step 3: Landing         Step 5: Feature Gen  │
│  Step 2: Canvas          Step 4: Brand           Step 6: Integrazioni   │
├─────────────────────────────────────────────────────────────────────────┤
│  DIPARTIMENTO 4                                                         │
│  Lancia & Analizza                                                      │
│  Step 7: Audit & Ottimizzazione                                         │
│  Step 8: Growth Dashboard & Legal Kit                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Dipartimento 1 — Validazione & Strategia

| Step | Input | Output | Completamento |
| :--- | :--- | :--- | :--- |
| **1. Validazione Idea** | Testo libero sull'idea, problema, target | `validation_brief.md` con assunzioni, rischi, risposte | Utente risponde ad almeno 3 domande e approva |
| **2. Strategic Canvas** | Dati Step 1 + input su monetizzazione e canali | `strategic_canvas.json` — Master Context per tutti gli step successivi | Canvas approvato |

#### Dipartimento 2 — Progettazione & Branding

| Step | Input | Output | Completamento |
| :--- | :--- | :--- | :--- |
| **3. Landing Page** | Canvas strategico + brief validazione | Codice HTML/Tailwind/React + preview PNG | Utente approva il design |
| **4. Brand Identity** | Preferenze stile e settore | `brand_guidelines.json` (colori, font, tone of voice) | Variante preferita selezionata |

#### Dipartimento 3 — Sviluppo & Costruzione

| Step | Input | Output | Completamento |
| :--- | :--- | :--- | :--- |
| **5. Feature Generator** | Descrizione feature in linguaggio naturale | Snippet React/Next.js + query Supabase integrati | Test positivo in staging |
| **6. Integrazioni Backend** | Wizard connessione servizi (Stripe, Resend, ecc.) | Token cifrati in Vault, handler generati | Health check verde su tutte le integrazioni |

#### Dipartimento 4 — Lancia & Analizza

| Step | Input | Output | Completamento |
| :--- | :--- | :--- | :--- |
| **7. Audit & Ottimizzazione** | Richiesta audit | `audit_report.json` con score a11y, SEO, UX | Fix applicati o ignorati consapevolmente |
| **8. Growth & Legal Kit** | Config dominio, analytics, legal | Privacy/ToS/Cookie dinamici + dashboard metriche + report settimanale AI | Deploy attivo con dominio custom |

#### Fast Lane

Per utenti con idea già chiara, Step 1–2 sono opzionali. La **Fast Lane** porta direttamente allo Step 3 con un wizard di 3 domande (nome progetto, problema, target). Time-to-value: ~10–15 minuti invece di ~45. Step 1–2 restano accessibili in qualsiasi momento per migliorare la qualità dell'output AI.

### 5.2 Project Memory e architettura multi-agente

Il problema delle app AI conversazionali è la saturazione del context window. Forgeko lo risolve con **Document-State** e **agenti specializzati**:

**Flusso multi-agente per ogni operazione complessa:**

1. **Agente Archivista** (Gemini) — Legge i Document-State degli step precedenti, riconosce flag Fast Lane, produce un Meta-Prompt sintetico (~1.000 token).
2. **Agente Esecutore** (Claude Opus) — Riceve il Meta-Prompt + input utente, genera l'output dello step corrente.
3. **Fallback automatico** — Se Opus supera il budget cap o è offline, routing su Gemini.

**Document-State chiave:**

- `validation_brief.md`
- `strategic_canvas.json`
- `brand_guidelines.json`
- `audit_report.json`
- Snapshot versionati del codice progetto

Ogni approvazione utente viene versionata e alimenta la timeline Project Memory visibile nell'UI.

### 5.3 Feature per area

| Area | Feature principali |
| :--- | :--- |
| **Validazione** | Stress-test idea, analisi competitor, canvas strategico Lean |
| **Build** | Generazione landing, brand identity, feature generator |
| **Ship** | Stripe, dominio custom, SSL auto-provisioning, integrazioni OAuth |
| **Compliance** | Legal Kit dinamico (Privacy/ToS/Cookie basati su integrazioni attive) |
| **Growth** | Report settimanali AI, analytics funnel, suggerimenti ottimizzazione |

---

## 6. Modello di Business

> **Stato:** 🔲 Pianificato — pricing definito nel Master Spec, billing non ancora implementato.

### Piani tariffari

| Feature | FREE | FOUNDER (€19/mese) | PRO (€29/mese) |
| :--- | :--- | :--- | :--- |
| Crediti AI / mese | 50 | 500 | 2.000 |
| Progetti per workspace | 1 | 3 | Illimitati |
| Dominio custom | ❌ (`.forgeko.app`) | 1 incluso | Illimitati |
| Claude Opus | ❌ (solo Gemini) | ✅ (cap €10/mese) | ✅ (cap €25/mese) |
| Project Memory | Ultimi 30gg | Completa | Completa + Export |
| Report settimanale AI | ❌ | ✅ Base | ✅ Avanzato |
| Legal Kit dinamico | ❌ | ✅ Base | ✅ Completo |
| Export codice (GitHub) | ❌ | ❌ | ✅ |
| Integrazioni terze parti | 2 max | 5 max | Illimitate |

Piani annuali disponibili con ~17% di sconto (Founder €190/anno, Pro €290/anno).

### Logica di upgrade

- **Free → Founder:** genera 2–3 landing, vuole dominio custom. €19 = "costo di un pranzo fuori".
- **Founder → Pro:** business avviato, serve compliance completa + export codice. €10 delta giustificato da valore legale e Project Memory export.

### Unit economics (sintesi)

- Costi fissi infrastruttura: ~€47/mese (Vercel, Supabase, servizi satellite)
- Break-even: ~11 utenti Founder attivi
- Costo per MAU: Free €0.10, Founder €1.30, Pro €4.20

### Kill metrics

Metriche binarie che guidano pivot o shutdown — nessuna eccezione emotiva.

| Fase | Metrica | Soglia minima | Azione sotto soglia |
| :--- | :--- | :--- | :--- |
| Pre-build (mesi 1–2) | Email qualificate in 7gg | 50 | Riscrivi copy, cambia canale. Dopo 3 iterazioni → pivot |
| Beta (mesi 3–4) | Activation rate (signup → Step 3 in 7gg) | >40% | Redesign onboarding. <20% → pivot core loop |
| Launch (mesi 5–6) | Conversione Free → Paid (30gg) | >3% | Test pricing. <1% → pivot modello |
| Launch (mesi 5–6) | MRR dopo 60gg pubblici | >€2.000 | Valuta shutdown o acquisizione asset |

---

## 7. Stato Attuale del Progetto

Distinzione netta tra ciò che esiste oggi nel codice e ciò che è pianificato.

```
[✅ Landing + Waitlist]  →  [✅ Founder Hub]  →  [🔲 Core Product]  →  [🔲 Billing]  →  [🔲 Public Launch]
```

### 7.1 Landing pre-release — LIVE

> **Stato:** ✅ Live su [forgeko.com](https://forgeko.com)

Sito di waitlist pre-lancio che valida domanda, spiega il posizionamento, raccoglie iscrizioni e feedback.

**Stack:**

- Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- Supabase — waitlist ed eventi analytics first-party
- Resend — email benvenuto waitlist, feedback, notifiche admin
- Cloudflare Turnstile — protezione form
- OpenNext Cloudflare — deploy su Cloudflare Workers

**Funzionalità live:**

- Sezioni landing: Hero, Problem, Solution, How It Works, Differentiators, FAQ, Waitlist, Feedback
- Form waitlist con double opt-in
- Form feedback con categorizzazione
- Analytics first-party (`/api/events`) verso Supabase e Founder Hub
- Pagine legali: `/privacy`, `/terms`, `/security`
- Documentazione API pubblica: `/docs/api`
- Discovery per motori e agenti AI: `llms.txt`, `openapi.json`, agent skills, `humans.txt`

**API principali:**

- `POST /api/waitlist`
- `POST /api/feedback`
- `POST /api/events`

### 7.2 Founder Hub — LIVE (interno)

> **Stato:** ✅ Live — dashboard locale, non pubblica

Applicazione Next.js separata (`founder-hub/`, porta 3030) — decision dashboard privata per i founder.

**Funzionalità:**

| Modulo | Cosa fa |
| :--- | :--- |
| **Analytics** | Snapshot da Supabase, eventi first-party e spiegazione AI dei trend |
| **Community** | Sync Reddit e Hacker News, analisi AI pain point e reply suggerite |
| **Feedback** | Sync Gmail, classificazione AI (Waitlist, Bug, Feature Request, ecc.) |
| **Insights** | Note cross-source su pain point da community, analytics, waitlist, feedback |
| **Marketing** | Daily brief e export markdown |
| **Settings** | Configurazione integrazioni e sync |

**Posture verso servizi esterni:** read-only. Founder Hub non posta, commenta, invia email, addebita utenti o modifica dati esterni. Gemini (server-side) per classificazione e sintesi.

### 7.3 Prodotto core — PIANIFICATO

Gli 8 step, l'architettura multi-agente, il Legal Kit dinamico, il deploy dei progetti utente, il billing Lemon Squeezy e la Project Memory UI sono definiti nel Master Spec ma **non ancora implementati** nel codice applicativo principale.

---

## 8. Architettura Tecnica

### 8.1 Repository attuale (landing)

```
app/                 Routes Next.js, metadata, API handlers, pagine legali
components/          Sezioni landing, form, UI client
lib/                 Waitlist, feedback, analytics, Supabase, email
public/              File serviti direttamente (robots, sitemap, llms.txt)
supabase/migrations/ Schema waitlist, eventi, RLS
tests/               Vitest per waitlist, feedback, analytics, discovery
founder-hub/         Dashboard interna (app separata)
docs/                Documentazione progetto
```

Deploy produzione: Cloudflare Workers via OpenNext (`npm run deploy`).

### 8.2 Architettura prodotto target

| Layer | Tecnologia |
| :--- | :--- |
| Frontend | Next.js su Vercel |
| Database & Auth | Supabase (PostgreSQL, Auth, Vault, Storage) |
| AI | Claude Opus 4.8 + Gemini 3.x con routing e fallback |
| Rendering | Browserless.io (preview landing) |
| Email | Resend |
| Analytics | Eventi first-party; provider esterno opzionale solo se necessario |
| Pagamenti utente | Stripe (OAuth + webhook handler generati) |
| Billing Forgeko | Lemon Squeezy |
| Rate limiting | Redis (Upstash) |
| Sicurezza | RLS Supabase, cifratura token in Vault, rate limiting API |

**Principio architetturale:** Document-State al posto di conversazioni monolitiche. Ogni step produce artefatti versionati che alimentano gli step successivi via Agente Archivista, riducendo costi AI (~40%) e allucinazioni da context overflow.

---

## 9. Go-to-Market

> **Stato:** ✅ Piano definito, esecuzione in corso (fase waitlist)

### Posizionamento messaging

**Usare:**

- "Most AI tools help you generate. Forgeko helps you continue."
- "Your SaaS project needs one home, not five tabs."
- "Project Memory — because your business decisions matter."

**Evitare:**

- "Build your startup in 5 minutes."
- "10x your SaaS with AI."
- "No-code app builder."

### Canali Fase 1 (ICP tech-adjacent)

- Indie Hackers, Hacker News, Reddit (r/SaaS, r/indiehackers, r/startups)
- X/Twitter — thread su coordination problem e Project Memory
- SEO long-tail — "solo SaaS launch checklist", "AI tools with memory"
- Content — articoli che mostrano il problema della frammentazione, non demo di generazione

### Metriche GTM attuali

| Metrica | Target |
| :--- | :--- |
| Email qualificate in 7gg dal lancio | 50 |
| Costo per email (CPE) | <€5 |
| Ore founder per email qualificata | <2h |

Mercato prioritario: internazionale, inglese. Tono: premium, professionale, vicino agli utenti — chiarezza senza hype aggressivo.

---

## 10. Governance, Rischi e Decisioni

### SWOT operativa (sintesi)

**Strengths:** Project Memory come moat; architettura multi-agente a basso contesto (−40% costi AI); resilienza multi-provider; Fast Lane per ridurre frizione onboarding.

**Weaknesses:** Complessità manutenzione (8 step interdipendenti); lock-in percepito da dev senior; onboarding cognitivo (abbandono pre-attivazione atteso 30–40%).

**Opportunities:** Saturazione vibe-coding (codice AI senza architettura = non manutenibile); AI Act e compliance globale; crescita solopreneur post-2024.

**Threats:** Verticalizzazione provider AI (Anthropic/Google lanciano tool solopreneur); raddoppio pricing API; regolamentazione documenti legali AI-generated.

### Protocollo pivot/shutdown

Se al mese 6: MRR < €2k **AND** conversione < 1% **AND** retention < 50% → riunione fondatori obbligatoria. Opzioni: pivot radicale, acquisizione asset, shutdown ordinato con refund pro-rata.

### Governance documenti

Il **Master Spec** (`docs/specs/FORGEKO_MASTER_SPEC.md`) resta la single source of truth vincolante per architettura, pricing, sicurezza e workflow. Qualsiasi deviazione richiede Amendment formale approvato. Questo overview riassume e rimanda — non sostituisce il Master Spec.

---

## Appendice — Dove approfondire

| Argomento | Documento |
| :--- | :--- |
| Visione completa, pricing dettagliato, schema DB, prompt contract | `docs/specs/FORGEKO_MASTER_SPEC.md` |
| Landing live — copy, design system, SEO, analytics | `docs/specs/FORGEKO_LANDING_SPEC.md` |
| Piano marketing organico e canali | `docs/FORGEKO_GROWTH_MARKETING_PLAN.md` |
| Checklist deploy Cloudflare Workers | `docs/DEPLOYMENT.md` |
| Policy sicurezza file e struttura repo | `docs/SECURITY_AND_FILE_STRUCTURE.md` |
| Setup dev landing | `README.md` |
| Setup Founder Hub | `founder-hub/README.md` |

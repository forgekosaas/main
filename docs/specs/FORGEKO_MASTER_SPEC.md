# FORGEKO — MASTER TECHNICAL & BUSINESS SPECIFICATION
### Documento unico di riferimento architettonico, strategico e operativo

```yaml
codice_documento: FORGEKO-MTS-2026-v1.4
classificazione: Riservato / Team Fondatori + Lead Engineering
data_compilazione: 16 Giugno 2026
data_ultima_revisione: 16 Giugno 2026
maintainer: CTO / Head of Product
revision_schedule: Trimestrale (o dopo ogni pivot validato da Kill Metrics)
formato: Markdown 1.1 (compatibile con Obsidian, VS Code, Notion, Git)
stato: APPROVATO - READY FOR DEVELOPMENT
versione: 1.4.0
tipo_documento: Documento unico integrale
fonte_verita: true
approvato_da: DA COMPILARE PRIMA DELL'APPROVAZIONE FINALE
```

---

> **Nota operativa landing — 28 Giugno 2026**
>
> Questo Master Spec resta la visione tecnica e business del prodotto completo. La landing pre-release attualmente live è documentata in `docs/specs/FORGEKO_LANDING_SPEC.md` e usa Next.js 16, OpenNext Cloudflare Workers, Cloudflare Turnstile, Resend, Supabase e analytics first-party `/api/events`. I riferimenti storici a Vercel, Next.js 14, Cloudflare Pages, PostHog o Umami nel Master Spec descrivono direzioni/prodotto o assunzioni precedenti, non lo stato operativo della landing live.

## INTRODUZIONE E SCOPO DEL DOCUMENTO

Questo documento rappresenta la **single source of truth** per lo sviluppo, il posizionamento e l'operatività di Forgeko. Non è un pitch deck, non è un documento di marketing, non è una roadmap temporale. È una **specifica tecnica e strategica vincolante** che definisce:

1. **Cosa Forgeko È** e, altrettanto importante, **cosa Forgeko NON È**.
2. **Come deve essere costruito** a livello di infrastruttura, database, logica AI e sicurezza.
3. **Come deve essere monetizzato** con matematica precisa dei costi diretti.
4. **Come deve essere difeso** legalmente sia come piattaforma sia nei confronti degli utenti.
5. **Quando deve essere ucciso o pivotato**, con metriche binarie non negoziabili.

Ogni membro del team (sviluppatori, designer, growth, legali) deve considerare questo documento come contrattuale. Qualsiasi deviazione deve essere proposta come *Amendment* formale, discusso e approvato, con conseguente aggiornamento della versione del documento.

---

### Contratto di Completezza

Questo file è il documento integrale di riferimento. Non esistono parti esterne da unire, sezioni implicite o appendici separate necessarie per interpretarlo.

| Categoria | Regola vincolante |
| :--- | :--- |
| **Decisioni vincolanti** | Architettura, pricing, crediti, sicurezza, RLS, workflow, prompt contract, legal kit, metriche e checklist qui descritti sono requisiti di prodotto fino ad Amendment approvato. |
| **Ipotesi operative** | Market sizing, impatto atteso, target di conversione e previsioni economiche sono ipotesi da validare con dati; restano operative finché una Kill Metric non impone revisione. |
| **Amendment obbligatorio** | Qualsiasi cambio a piani tariffari, modello crediti, stack infrastrutturale, confini ICP, compliance, schema dati o sequenza degli 8 Step richiede aggiornamento formale del documento. |
| **Non implementazione** | I blocchi SQL, prompt e pseudocodice definiscono contratti tecnici e criteri di accettazione; non sostituiscono migrazioni, test automatizzati o codice applicativo versionato. |
| **Campi amministrativi mancanti** | I valori non disponibili al momento della revisione sono marcati esplicitamente come `DA COMPILARE PRIMA DELL'APPROVAZIONE FINALE`. Nessun placeholder narrativo è ammesso. |

---

### Glossario Tecnico Standardizzato

Per evitare ambiguità semantiche durante lo sviluppo, i seguenti termini hanno definizioni rigide:

| Termine | Definizione Tecnica |
| :--- | :--- |
| **Workspace** | Entità di billing e contenitore di crediti AI. 1 Utente registrato = 1 Workspace. |
| **Progetto** | Singola iniziativa imprenditoriale (SaaS, landing, micro-business) contenuta in un Workspace. Un Workspace può contenere N Progetti. |
| **MoR (Merchant of Record)** | Entità legale che vende il prodotto all'utente finale, assumendosi la responsabilità fiscale (IVA/VAT/Sales Tax). Per Forgeko: Lemon Squeezy. |
| **Agente Archivista** | LLM orchestratore che legge i `project_documents` e genera Meta-Prompt per gli agenti esecutori. |
| **Agente Esecutore** | LLM specializzato (Opus/Gemini) che riceve un Meta-Prompt e produce output per uno Step specifico. |
| **Golden Master Repository** | Repo GitHub privato e versionato contenente lo scheletro Next.js + Supabase + Tailwind pulito, usato come base per l'Export Codice. |
| **Document-State** | File `.md` o `.json` persistente su Supabase che rappresenta lo stato approvato di uno Step. Sostituisce la memoria conversazionale. |
| **Snapshot** | Istantanea JSONB immutabile dell'intero stato di un Progetto, usata per Undo/Redo e version history. |
| **Credito AI** | Unità di misura normalizzata del consumo LLM, disaccoppiata dal costo reale dei token per stabilità UX. |
| **Kill Metric** | Metrica binaria con soglia predefinita che, se non raggiunta, triggera protocollo di pivot o shutdown automatico. |
| **Fast Lane** | Percorso di onboarding accelerato che permette di saltare Step 1-2 e accedere direttamente alla generazione landing (Step 3). |
| **Project Memory** | Layer di visualizzazione dell'intera storia decisionale del progetto (Document-State accumulati, snapshot, analytics). Principale switching cost. |

---

## 🎯 PARTE 1: VISION, STRATEGIA E METRICHE

### 1.1 Il Paradigma del "Sistema Operativo Verticale"

**Posizionamento Dichiarato:** Forgeko è il primo *Sistema Operativo Verticale per Solopreneur*.

**Differenziazione Architetturale dai Competitor:**
Il mercato attuale dei "Vibe Coders" (Bolt.new, Lovable.dev, v0.dev) risolve un singolo problema: *trasformare un prompt in codice frontend funzionante*. Questo è un tool **orizzontale** (utile a chiunque, per qualsiasi scopo) e **monofase** (il valore termina al momento del deploy).

Forgeko risolve un problema di ordine superiore: *trasformare un'idea imprenditoriale in un business digitale funzionante, compliant e monitorabile*. Questo è un tool **verticale** (specifico per solopreneur) e **multifase** (il valore persiste e cresce nel tempo).

**Tabella Comparativa di Posizionamento:**

| Dimensione | Bolt / Lovable | Forgeko |
| :--- | :--- | :--- |
| **Core Output** | Codice React/Node | Business digitale end-to-end |
| **Orizzonte Temporale** | Sessione singola (minuti/ore) | Ciclo di vita del business (mesi/anni) |
| **Gestione Compliance** | Assente | Nativa (Legal Kit Dinamico) |
| **Gestione Pagamenti** | L'utente integra manualmente | Integrazione guidata + MoR |
| **Gestione Dominio** | L'utente configura DNS | Auto-provisioning + SSL |
| **Analytics** | Nessuna | Dashboard Crescita AI-driven |
| **Target Utente** | Sviluppatori + Designer | Solopreneur non-tecnici |
| **Modello Ricavo** | Subscription per generazione | Subscription per business gestito |
| **Project Memory** | Nessuna | Storia completa decisionale del progetto |

> **Decisione operativa — Il vero moat è la Project Memory, non il Legal Kit**
>
> La versione precedente identificava il Legal Kit Dinamico come principale switching cost e differenziatore difendibile. Questa valutazione è parzialmente errata. Il Legal Kit è replicabile da competitor (Termly, Iubenda) in poche settimane aggiungendo semplicemente il rilevamento delle integrazioni attive.
>
> **Il vero moat è la Project Memory:** l'accumulo progressivo di Document-State, snapshot, decisioni approvate, analytics storiche che solo Forgeko possiede per ogni progetto. Dopo 3-6 mesi di utilizzo, un utente che vuole migrare altrove deve fare i conti con il fatto di lasciare indietro l'intera storia decisionale del suo business, non solo un documento legale.
>
> **Implicazioni operative:**
> - Aggiungere una sezione "Project Memory" nell'UI (sempre visibile, timeline decisionale)
> - Comunicare esplicitamente nel marketing: *"Forgeko ricorda ogni decisione del tuo business. Tu no."*
> - Il Legal Kit rimane una feature di valore, ma non il principale argomento di retention nel messaging

**Unique Selling Proposition (USP) Formalizzata:**
> *"Forgeko non ti dà il codice. Ti dà l'azienda. Dalla validazione dell'idea alla compliance GDPR, dal primo pagamento al report di crescita settimanale, in un unico ambiente integrato che non ti abbandona dopo il deploy — e che ricorda ogni decisione che hai preso lungo il cammino."*

---

### 1.2 Matrice SWOT Operativa (Non Teorica)

Questa SWOT non è un esercizio accademico. Ogni elemento ha un impatto diretto sulle decisioni architetturali.

**STRENGTHS (Vantaggi Strutturali)**

1. **Moat della Project Memory:** L'accumulo progressivo di Document-State, snapshot e analytics crea uno switching cost profondo e difficilmente replicabile. Più a lungo l'utente usa Forgeko, più costoso diventa migrare.
2. **Legal Kit Dinamico (Vantaggio Secondario):** Nessun competitor offre generazione contestuale di Privacy/ToS basata sulle integrazioni attive. Contribuisce allo switching cost ma non è il fattore primario.
3. **Architettura Multi-Agente a Basso Contesto:** L'uso di Document-State invece di conversazioni monolitiche riduce i costi AI del ~40% rispetto ai competitor e elimina le allucinazioni da context overflow.
4. **Resilienza Multi-Provider:** Il routing Opus/Gemini con fallback automatico garantisce uptime >99.5% anche durante outage di Anthropic.
5. **Struttura 4 Dipartimenti / 8 Step + Fast Lane:** Riduce la paralisi da scelta per chi non sa da dove partire, ma non blocca chi ha già le idee chiare (Fast Lane).

**WEAKNESSES (Debolezze Intrinseche)**

1. **Complessità di Manutenzione:** 8 step interdipendenti + 4 dipartimenti = superficie di bug 4x superiore a un generatore single-step.
2. **Lock-in Percepito:** Gli utenti tecnici potrebbero percepire la piattaforma come "walled garden". Mitigato dalla feature Export Codice (Piano Pro) e dalla comunicazione trasparente.
3. **Dipendenza da Sub-processor Critici:** Anthropic (Opus), Google (Gemini), Vercel (Hosting), Supabase (DB), Browserless (Rendering). Outage di uno = degradazione servizio.
4. **Onboarding Cognitivo:** 8 step richiedono impegno iniziale. Tasso di abbandono pre-attivazione atteso: 30-40%. Mitigato dalla Fast Lane.

**OPPORTUNITIES (Finestre di Mercato)**

1. **Saturazione del Vibe-Coding:** Utenti stanno scoprendo che codice AI-generated senza architettura è non-manutenibile. Forgeko offre struttura.
2. **AI Act e Compliance Globale:** Nuove normative (GDPR enforcement, AI Act EU, CCPA amendments) rendono la compliance automatizzata un bisogno urgente, non opzionale.
3. **Crescita Post-2024 dei Solopreneur:** Trend macroeconomico verso micro-imprenditorialità digitale (remote work, creator economy, indie hacking).
4. **Consolidamento Provider AI:** Accordi come Lovable-Google Cloud creano dipendenze pericolose. Forgeko multi-provider è hedging strategico.

**THREATS (Minacce Esistenziali)**

1. **Verticalizzazione dei Provider:** Anthropic o Google potrebbero lanciare "Anthropic for Solopreneurs" con pricing predatorio.
2. **Cambiamenti Pricing API:** Raddoppio costi token Opus renderebbe insostenibile il piano Founder a €19. Mitigato da fallback Gemini + Budget Cap.
3. **Regolamentazione AI-Generated Legal Docs:** Possibile futura normativa che richieda revisione umana obbligatoria per documenti legali AI-generated. Mitigato da feature "Prompt per Avvocato Umano".
4. **Acquisizione Competitor:** Se Bolt acquisisce un legal-tech (es. Termly), il moat del Legal Kit si erode. Il moat della Project Memory rimane intatto.

---

### 1.3 ICP (Ideal Customer Profile) e Psicografia

> **Decisione operativa — Risoluzione del conflitto ICP vs canali GTM**
>
> **Problema identificato:** La versione precedente dichiarava come ICP primario il "solopreneur non tecnico" ma pianificava il lancio su HackerNews e IndieHackers, dove il 90% degli utenti sono developer o tech-adjacent. Questa contraddizione avrebbe portato ad attrarre esattamente l'Anti-Persona "Sviluppatore Senior" (che trova i vincoli limitanti) invece dell'ICP dichiarato.
>
> **Soluzione:** Biforcazione dell'ICP in due fasi temporali distinte.
>
> **ICP Fase 1 — Lancio (Mesi 1-6):** Developer/PM/Designer con idea di business ma senza voglia di gestire compliance, domini, legal, infrastruttura. È tech-literate ma non vuole occuparsi di tutto il contorno tecnico. Questo è chi trovi realmente su IndieHackers, HackerNews, Twitter/X. Il copy, il tone of voice e le feature highlight devono essere calibrati su questo profilo.
>
> **ICP Fase 2 — Crescita (Mesi 7+):** Solopreneur non tecnico (business, marketing, creator, consulente). Si raggiunge con canali diversi: LinkedIn, newsletter di business, community creator, YouTube tutorial. Richiede onboarding più semplificato e supporto più robusto.
>
> **Non mischiare i due ICP nello stesso lancio.** Messaggi che cercano di parlare a entrambi non parlano bene a nessuno.

**Profilo ICP Fase 1 — "Il Builder Tech-Frustrato"**

*   **Età:** 25-38 anni
*   **Background:** Developer, PM, Designer, Growth Marketer con competenze tecniche base
*   **Reddito:** €40k-€120k annui (lavoro principale) + vuole side revenue
*   **Residenza:** Paesi OCSE con alta digital literacy (USA, Canada, UK, Germania, Olanda, Svezia, Australia, Italia)
*   **Lingue:** Inglese fluente

**Psicografia:**
*   Sa scrivere codice o capisce le basi, ma non vuole gestire DNS, GDPR, Stripe webhooks, certificati SSL **ogni volta** che testa una nuova idea
*   Ha già lanciato 1-2 side project che non sono mai andati live per "troppa roba da fare prima di iniziare"
*   Valore del tempo alto: €50-€150/ora. €29/mese per risparmiare 15 ore è no-brainer
*   Pattern decisionale: Research-heavy. Legge documentazione tecnica, guarda video demo, chiede su IndieHackers/Discord prima di comprare

**Profilo ICP Fase 2 — "Il Builder Non-Tecnico"**

*   **Età:** 28-45 anni
*   **Background:** Consulente, coach, marketer, creator, imprenditore tradizionale che vuole digitalizzarsi
*   **Trauma Passato:** Ha speso €3k-€10k per un'agency che ha consegnato un sito WordPress non-funzionale, O ha provato a imparare Next.js abbandonando per frustrazione
*   **Valore Tempo vs Denaro:** €19/mese è "costo di un pranzo fuori"

**Casi d'Uso Primari:**

1. **Serial Validator (ICP Fase 1):** Testa 3-5 idee in 2 mesi. Usa Step 1-3 + Fast Lane per generare landing page diverse rapidamente, raccoglie email, uccide idee perdenti prima di scrivere backend.
2. **Service-to-Product Pivot (ICP Fase 1 + 2):** Consulente/freelancer trasforma metodologia in prodotto digitale. Usa Step 4-6 per costruire, Step 7-8 per vendere.
3. **Side-Project Monetizer (ICP Fase 1):** Dipendente tech-adjacent costruisce micro-SaaS nel tempo libero. Usa Forgeko per la parte infrastrutturale e di compliance che non vuole gestire.

**Anti-Persona (Chi NON è in Target — Escludere Attivamente):**

| Anti-Persona | Perché Escludere | Come Riconoscere |
| :--- | :--- | :--- |
| **Sviluppatore Senior con stack proprio** | Troverà vincoli limitanti; preferirà stack proprietario | "Posso ejectare?", "Dove sono le API?", "Posso usare il mio DB?" |
| **Team >5 persone** | Manca RBAC, collaboration, audit log enterprise | "Posso invitare il mio co-founder?", "Come gestiamo i ruoli?" |
| **Hobbista No-Revenue** | Non giustifica €19-29/mese | "È solo per il mio blog personale", "Non penso di monetizzare" |
| **Cercatore di AI Magic** | Vuole risultati zero-click senza input strategico | "Perché mi fai domande? Genera e basta" |
| **Enterprise/B2B Complex** | Richiede custom compliance, SLA, on-premise | "Avete SOC2 Type II?", "Serve SSO SAML", "Possiamo firmare DPA custom?" |

**Trigger di Attivazione:**
1. **Fallimento Progetto Precedente:** "Ho speso mesi su un side project che non è mai andato live"
2. **Validazione Idea Urgente:** "Ho avuto un'idea ieri e voglio testarla questo weekend"
3. **Transizione Carriera:** "Ho lasciato il lavoro corporate e voglio lanciare il mio business"
4. **Frustrazione Tool Attuali:** "Ho 15 tab aperte (Notion, Figma, Vercel, Stripe, Mailchimp) e non si parlano"

⚠️ **Nota per il Team Growth:** I trigger sopra sono ipotesi basate su research qualitativa. Devono essere validati quantitativamente nei primi 30 giorni tramite survey post-signup (NPS + domanda aperta "Cosa ti ha portato qui oggi?").

---

### 1.4 Market Sizing: TAM, SAM, SOM con Metodologia Bottom-Up

**TAM (Total Addressable Market) — Teorico Massimo**

*   **Definizione:** Tutti i solopreneur, freelancer e micro-imprese digitali globali che potrebbero beneficiare di un sistema operativo.
*   **Calcolo:**
    *   Popolazione globale 15-65 anni: ~5.1 miliardi (World Bank 2024)
    *   % Self-employed/global: ~34% (ILO 2024) = 1.73 miliardi
    *   % con accesso internet + digital literacy: ~45% = 780 milioni
    *   % in fascia età 25-45: ~35% = **273 milioni (TAM Grezzo)**
*   **Rilevanza per Forgeko:** Bassa. Troppo eterogeneo. Non actionabile.

**SAM (Serviceable Available Market) — Raggiungibile con GTM Attuale**

*   **Definizione:** Solopreneur e builder digitali in paesi OCSE, anglofoni o alta digital literacy, attivi su piattaforme tech.
*   **Calcolo:**
    *   TAM Grezzo filtrato per paesi target: ~18% = 49 milioni
    *   % "Digital Builders" (tech-adjacent, online business): ~8% = 3.9 milioni
    *   % attivi su community tech + disposti a pagare per SaaS: ~60% = **2.34 milioni (SAM)**

**SOM (Serviceable Obtainable Market) — Realistico Anno 1**

*   **Calcolo:**
    *   SAM: 2.34M
    *   Penetrazione mercato realistica anno 1: 0.1% - 0.3%
    *   **SOM: 2.340 - 7.020 utenti paganti**
*   **Revenue Projection Anno 1:**
    *   ARPU medio (mix 80% Free / 15% Founder / 5% Pro): €4.30/MAU
    *   MRR target conservativo: €10.062/mese → **ARR: ~€120k**
    *   MRR target ottimistico: €30.186/mese → **ARR: ~€362k**

---

### 1.5 Kill Metrics & Disciplina di Pivot/Shutdown

**Principio Fondante:** Le emozioni non guidano le decisioni. I dati sì. Ogni metrica ha una soglia binaria. Sotto soglia = azione predefinita. Nessuna eccezione.

**FASE 1: Pre-Build Validation (Mesi 1-2)**

| Metrica | Soglia Minima | Metodo Misurazione | Azione Sotto Soglia |
| :--- | :--- | :--- | :--- |
| **Email Raccolte in 7gg** | 50 qualificate | Form landing page (Resend/ConvertKit) | Riscrivere copy + testare 2 canali diversi. Se dopo 3 iterazioni <50 → **KILL idea attuale, PIVOT** |
| **Costo per Email (CPE)** | <€5 | Calcolato | Se CPE > €5 → canale sbagliato, cambiare strategia |
| **Tasso Apertura Email Benvenuto** | >60% | Resend analytics | Se <40% → problema deliverability o subject line |

> **Decisione operativa — Kill Metric aggiuntiva: costo reale di acquisizione**
>
> La versione precedente non includeva una metrica vincolante sul CAC organico, assumendo implicitamente che il tempo dei founder valesse €0. Questa omissione crea un rischio di sunk cost non monitorato.

| Metrica | Soglia | Metodo | Azione Sotto Soglia |
| :--- | :--- | :--- | :--- |
| **Ore Founder per Email Qualificata** | <2h/email | Time tracking (Toggl/manuale) | Se >4h/email dopo 2 iterazioni → canale sbagliato. Stop organico, valuta €500 in paid per test comparativo. Se paid CPE < organico → pivot su paid. |

**FASE 2: Beta Chiusa (Mesi 3-4)**

| Metrica | Soglia Minima | Metodo Misurazione | Azione Sotto Soglia |
| :--- | :--- | :--- | :--- |
| **Activation Rate** (Signup → Step 3 completato entro 7gg) | >40% | PostHog funnel | Se <40% → onboarding troppo complesso. Redesign flow. Se <20% dopo fix → **PIVOT su target o core loop** |
| **Time-to-Value** (Signup → prima landing generata) | <45 minuti | PostHog timestamp diff | Se >90min → frizione eccessiva, semplificare Step 1-2, verificare che Fast Lane sia funzionante |
| **NPS Beta Users** | >40 | Survey in-app (Typeform) | Se <20 → problema product-market fit, interviste qualitative obbligatorie |
| **Bug Critici per Utente** | <2 | Sentry + user reports | Se >5 → freeze feature, focus stability |

**FASE 3: Public Launch (Mesi 5-6)**

| Metrica | Soglia Minima | Metodo Misurazione | Azione Sotto Soglia |
| :--- | :--- | :--- | :--- |
| **Conversione Free → Paid** (entro 30gg) | >3% | Lemon Squeezy + cohort analysis | Se <3% → pricing sbagliato o value gap. Se <1% dopo 3 test → **PIVOT pricing model** |
| **Mese 1 Retention** (% paid users attivi dopo 30gg) | >70% | DB query active users | Se <70% → churn precoce, migliorare Report Settimanale + features engagement |
| **MRR dopo 60gg pubblici** | >€2.000 | Lemon Squeezy dashboard | Se <€2k → traction insufficiente, valutare **SHUTDOWN** o acquisizione asset |
| **Viral Coefficient (K-factor)** | >0.3 | Referral tracking | Se <0.1 → prodotto non virale, investire in paid acquisition o content marketing |

**Protocollo di Shutdown Formale:**
Se al Mese 6: MRR < €2k AND Conversione <1% AND Retention <50% → riunione fondatori obbligatoria. Opzioni:
1. **Pivot Radicale:** Cambiare ICP, pricing, o core feature. Richiede nuovo Pre-Build Validation.
2. **Acquisizione Asset:** Vendere codice, design, lista email a competitor o strategic buyer.
3. **Shutdown Ordinato:** Comunicare agli utenti 30gg prima, refund pro-rata, valutare open-source del codice.

**Il sunk cost fallacy uccide più startup della concorrenza. Nessuna eccezione emotiva.**

---

## 💰 PARTE 2: UNIT ECONOMICS, PRICING E GESTIONE CREDITI

### 2.1 Matrice dei Piani Tariffari

Il modello è progettato per massimizzare la penetrazione (Free tier generoso) e guidare upgrade naturali basati su bisogno emergente, non su frustrazione artificiale.

> **Decisione operativa — Piani annuali e rimozione del watermark visibile**
>
> Due modifiche sostanziali rispetto alla versione precedente:
>
> **1. Piani Annuali:** La versione precedente prevedeva solo billing mensile. Per un tool che l'utente usa per "mesi/anni" (come dichiarato nel posizionamento), l'assenza di piani annuali era un'occasione persa su tre fronti: cash flow anticipato, riduzione churn involontario, segnale di commitment da parte dell'utente.
>
> **2. Rimozione Watermark Visibile:** Il watermark "Built with Forgeko" nel piano Free era trattato come leva di marketing virale. In realtà è una barriera psicologica: un solopreneur che vuole apparire professionale percepisce il watermark come un segnale di "prodotto economico", non come endorsement. Viene sostituito con un sistema di incentivi positivi (crediti bonus in cambio di link opzionale) e con il watermark steganografico invisibile per protezione IP.

**Tabella Completa Piani — Billing Mensile:**

| Feature | FREE | FOUNDER (€19/mese) | PRO (€29/mese) |
| :--- | :--- | :--- | :--- |
| **Crediti AI / mese** | 50 | 500 | 2.000 |
| **Progetti per Workspace** | 1 | 3 | Illimitati |
| **Dominio Custom** | ❌ (solo `.forgeko.app`) | 1 incluso | Illimitati |
| **Watermark Visibile** | ❌ Rimosso (link opzionale) | ❌ | ❌ |
| **Link "Powered by Forgeko" opzionale** | +20 crediti/mese se attivo | N/A | N/A |
| **Accesso Claude Opus 4.8** | ❌ (solo Gemini Pro) | ✅ (cap €10/mese) | ✅ (cap €25/mese) |
| **Fallback Automatico Gemini** | ✅ (sempre) | ✅ (dopo cap Opus) | ✅ (dopo cap Opus) |
| **Fast Lane Onboarding** | ✅ | ✅ | ✅ |
| **Project Memory Timeline** | Ultimi 30gg | Completa | Completa + Export |
| **Report Settimanale AI** | ❌ | ✅ Base | ✅ Avanzato + Proattivo |
| **Integrazioni Terze Parti** | 2 max | 5 max | Illimitate |
| **Legal Kit Dinamico** | ❌ (solo template generici) | ✅ (Privacy + ToS base) | ✅ (Completo + Cookie + GDPR) |
| **Export Codice Sorgente (GitHub)** | ❌ | ❌ | ✅ (Golden Master push) |
| **Version History (Snapshots)** | Ultimi 3 | Ultimi 20 | Illimitati |
| **Supporto** | Community Forum | Email (48h) | Priority Email + Chat (24h) |
| **Analytics Dashboard** | Base (visite, conversioni) | Avanzata (funnel, cohort) | Custom + Export CSV |
| **Team Members** | 1 (solo owner) | 1 | 3 (read-only collaborators) |

**Tabella Piani Annuali (Default consigliato nella pricing page):**

| Piano | Prezzo Mensile Equivalente | Prezzo Annuale | Sconto | Note |
| :--- | :--- | :--- | :--- | :--- |
| **FOUNDER Annuale** | €15.83/mese | **€190/anno** | ~17% | Risparmio €38/anno vs mensile |
| **PRO Annuale** | €24.17/mese | **€290/anno** | ~17% | Risparmio €58/anno vs mensile |

**Nota UI:** Nella pricing page, i piani annuali sono presentati come default (toggle "Annuale / Mensile" con annuale preselezionato). Il risparmio è evidenziato con badge "Risparmia €38/anno". Il mensile è disponibile come alternativa visibile ma non enfatizzata.

**Logiche di Sblocco Progressivo (Psychological Triggers):**

1. **Free → Founder:** Utente genera 2-3 landing page (consuma ~40 crediti), vuole testare dominio custom. €19 è "costo di un pranzo fuori". Il watermark rimosso abbassa ulteriormente la frizione psicologica rispetto alla versione precedente.
2. **Founder → Pro:** Utente ha business avviato, necessita compliance legale completa, vuole esportare codice. €10 delta è giustificato da valore legale + export + Project Memory completa.
3. **Downgrade Prevention:** Se utente Pro downgrada a Founder, mantengono i progetti esistenti ma perdono export + legal kit avanzato + Project Memory export. Questo crea switching cost reale.
4. **Annuale → Mensile Downgrade:** Se utente annuale vuole cancellare, riceve automaticamente offerta: "Passa al mensile e mantieni tutti i dati per altri 3 mesi a €0" (ovvero, l'equivalente del pro-rata non usato viene convertito in mesi gratuiti).

---

### 2.2 Unit Economics Diretti: Break-Even Analysis Rigorosa

**Principio:** Questa analisi considera **SOLO costi diretti variabili e fissi infrastrutturali**. Esclude deliberatamente: sviluppo, marketing, supporto umano, overhead aziendale, stipendi fondatori. L'obiettivo è determinare la sostenibilità marginale pura del prodotto.

**Costi Fissi Mensili (Infrastruttura Base):**

| Servizio | Tier | Costo Mensile | Note |
| :--- | :--- | :--- | :--- |
| **Vercel Pro** | Hosting/Middleware/Edge Functions | €20 | Include 1TB bandwidth, serverless functions |
| **Supabase Pro** | DB PostgreSQL + Auth + Vault + Storage | €25 | 8GB DB, 250MB Storage, 50k MAU Auth |
| **Browserless.io** | Rendering Headless (Puppeteer) | €0 (free tier 1000 req/mese) | Scala a €30/mese se >1000 req |
| **Resend** | Email Transactional | €0 (free tier 3k email/mese) | Scala a €20/mese se >3k email |
| **Domain Renewals** | `.app`, `.com` | €2 (prorated) | ~€24/anno |
| **Redis (Upstash)** | Rate Limiting + Queue | €0 (free tier 10k req/giorno) | Scala a €10/mese se >10k req/giorno |
| **TOTALE COSTI FISSI** | | **€47/mese** | Scenario conservativo con Supabase Pro |

**Costi Variabili per MAU (Monthly Active User):**

| Piano | Consumo Medio Crediti | Costo Token (mix Opus/Gemini) | Hosting Marginal | **Totale Costo/MAU** |
| :--- | :--- | :--- | :--- | :--- |
| **FREE** | 30 crediti | €0.08 | €0.02 | **€0.10** |
| **FOUNDER** | 300 crediti | €0.80 | €0.50 | **€1.30** |
| **PRO** | 1.200 crediti | €3.20 | €1.00 | **€4.20** |

**Dettaglio Costo Token (Pricing API Q2 2026):**
*   **Claude Opus 4.8:** $15/M input tokens, $75/M output tokens
*   **Gemini 3.1 Pro:** $1.25/M input tokens, $5/M output tokens
*   **Mix Ponderato Founder:** 30% Opus (cap €10) + 70% Gemini = ~€0.80/300 crediti
*   **Mix Ponderato Pro:** 50% Opus (cap €25) + 50% Gemini = ~€3.20/1200 crediti

**Calcolo Break-Even Diretto (Mix Realistico Mese 6):**

```
Mix: 80% Free / 15% Founder / 5% Pro

ARPU = (0.80 × €0) + (0.15 × €19) + (0.05 × €29) = €4.30/MAU
Costo = (0.80 × €0.10) + (0.15 × €1.30) + (0.05 × €4.20) = €0.485/MAU
Margine Contributivo = €4.30 - €0.485 = €3.815/MAU

Break-Even Point = €47 / €3.815 = ~13 MAU
```

**Scenario Stress Test — Mix Pessimistico (95% Free / 4% Founder / 1% Pro):**

```
ARPU = (0.95 × €0) + (0.04 × €19) + (0.01 × €29) = €1.05/MAU
Costo = (0.95 × €0.10) + (0.04 × €1.30) + (0.01 × €4.20) = €0.189/MAU
Margine = €1.05 - €0.189 = €0.861/MAU
BEP = €47 / €0.861 = ~55 MAU
```

**Conclusione critica:** Monitorare il **Free-to-Paid Conversion Rate** come metrica operativa quotidiana. Se <3%, il modello diventa insostenibile a scala. È la singola metrica più importante per la sostenibilità del business.

---

### 2.3 Motore dei Crediti AI e Fallback: Architettura Tecnica

**Principio:** 1 Credito AI ≠ 1 Token. È un'unità di misura normalizzata e stabile nel tempo, disaccoppiata dai costi reali dei token per garantire UX prevedibile.

**Mappatura Consumi per Operazione:**

| Operazione | Step | Crediti | Modello Preferito | Note |
| :--- | :--- | :--- | :--- | :--- |
| **Validazione Idea** | 1 | 5 | Gemini Pro | Query socratiche |
| **Dashboard Strategica** | 2 | 8 | Gemini Pro | Aggregazione dati |
| **Generazione Landing Page** | 3 | 20-25 | Claude Opus | Generazione per componente (vedi Appendice A) |
| **Brand Identity** | 4 | 6 | Gemini Pro | Palette, typography |
| **Generatore Funzionalità** | 5 | 10 | Claude Opus | Snippet codice |
| **Integrazione Backend** | 6 | 12 | Claude Opus | Codice API integration |
| **Test & Ottimizzazione** | 7 | 8 | Gemini Pro | Audit UX |
| **Report Settimanale** | 8 | 10 | Claude Opus | Analisi dati + narrativa |
| **Chat Libera / Refinement** | Any | 1 | Gemini Pro | Iterazioni rapide |
| **Legal Kit Generation** | Any | 20 | Claude Opus | Documenti complessi |

> **Decisione operativa — Step 3 da 15 a 20-25 crediti**
> La generazione della landing page viene ora eseguita per componente separato (Hero, Features, Pricing, CTA) invece che in un'unica chiamata. Questo aumenta leggermente il costo in crediti ma elimina il rischio di output troncati e migliora significativamente la qualità per componente. Vedi Appendice A per dettagli implementativi.

**Totale Crediti per Ciclo Completo (Step 1-8):** ~99-104 crediti
*   Piano Free (50 cr): ~0.5 cicli → sufficiente per testare
*   Piano Founder (500 cr): ~5 cicli → sufficiente per validare + lanciare 1 progetto
*   Piano Pro (2000 cr): ~20 cicli → sufficiente per serial validation

**Architettura Tecnica del Sistema Crediti:**

```typescript
interface CreditTransaction {
  userId: UUID;
  workspaceId: UUID;
  projectId: UUID;
  operation: OperationType;
  creditsRequested: number;
  modelUsed: 'claude-opus-4.8' | 'gemini-3.1-pro';
  tokensIn: number;
  tokensOut: number;
  costEur: number;
  timestamp: Date;
}

async function consumeCredits(
  userId: UUID,
  operation: OperationType,
  estimatedTokens: { in: number; out: number }
): Promise<{ success: boolean; remainingCredits: number }> {

  const workspace = await db.workspaces.get(userId);
  const creditsNeeded = CREDIT_MAP[operation];

  if (workspace.credits_balance < creditsNeeded) {
    throw new InsufficientCreditsError(workspace.credits_balance, creditsNeeded);
  }

  let model: AIModel;
  if (operation.requiresOpus && workspace.opus_budget_eur < OPUS_CAP[workspace.plan]) {
    model = 'claude-opus-4.8';
  } else {
    model = 'gemini-3.1-pro';
  }

  const aiResponse = await aiEngine.call(model, operation.prompt);
  const actualTokens = {
    in: aiResponse.usage.input_tokens,
    out: aiResponse.usage.output_tokens
  };

  const costEur = calculateCost(model, actualTokens);

  await db.transaction(async (tx) => {
    await tx.workspaces.decrementCredits(workspace.id, creditsNeeded);
    if (model === 'claude-opus-4.8') {
      await tx.workspaces.incrementOpusBudget(workspace.id, costEur);
    }
    await tx.ai_generations.insert({
      userId,
      workspaceId: workspace.id,
      operation,
      creditsUsed: creditsNeeded,
      modelUsed: model,
      tokensIn: actualTokens.in,
      tokensOut: actualTokens.out,
      costEur,
      timestamp: new Date()
    });
  });

  return {
    success: true,
    remainingCredits: workspace.credits_balance - creditsNeeded
  };
}
```

**Budget Cap €10 su Claude Opus 4.8 (Piano Founder):**

*   **Implementazione:** Counter Redis per-workspace, incrementato atomicamente a ogni chiamata Opus.
*   **Logica Fallback:** Quando `opus_budget_eur >= 10.00`, tutte le richieste successive vengono deviate silenziosamente a Gemini 3.1 Pro.
*   **UX:** Nessun errore, nessun avviso intrusivo. Indicatore UI discreto: "Modalità Ottimizzata Attiva" (tooltip: "Hai raggiunto il budget Opus per questo mese. Le richieste sono gestite da Gemini Pro per garantirti continuità.").
*   **Reset:** Counter resettato il 1° di ogni mese (cron job).

---

### 2.4 Fair Use, Rate Limiting e Anti-Abuse

**Layer 1: Rate Limiting Per-Utente (Redis + Edge Functions)**

```typescript
const RATE_LIMITS = {
  free: {
    requestsPerMinute: 5,
    requestsPerHour: 50,
    requestsPerDay: 200
  },
  founder: {
    requestsPerMinute: 10,
    requestsPerHour: 150,
    requestsPerDay: 1000
  },
  pro: {
    requestsPerMinute: 20,
    requestsPerHour: 300,
    requestsPerDay: 3000
  }
};

async function checkRateLimit(userId: UUID, plan: PlanTier): Promise<boolean> {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const key = `ratelimit:${userId}:${windowMs}`;

  await redis.zadd(key, now, `${now}`);
  await redis.zremrangebyscore(key, 0, now - windowMs);
  const count = await redis.zcard(key);
  await redis.expire(key, Math.ceil(windowMs / 1000));

  return count <= RATE_LIMITS[plan].requestsPerMinute;
}
```

**Layer 2: Content Filtering e Prompt Injection Prevention**

```typescript
function sanitizeUserInput(input: string): string {
  let sanitized = input.replace(PII_PATTERNS, '[REDACTED]');
  sanitized = sanitized.slice(0, 10000);

  if (PROMPT_INJECTION_PATTERNS.test(sanitized)) {
    throw new PromptInjectionError('Input contains suspicious patterns');
  }

  return sanitized;
}

const PROMPT_INJECTION_PATTERNS = /ignore previous instructions|you are now|forget everything|system prompt/i;
const PII_PATTERNS = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
```

**Layer 3: Credit Expiry e Hoarding Prevention**

*   **Regola:** Crediti non usati NON si accumulano oltre 30 giorni (per utenti mensili).
*   **Eccezione piani annuali:** I crediti degli utenti annuali hanno un pool trimestrale (non mensile), per riconoscere il commitment dell'utente.
*   **Implementazione:** Cron job mensile che resetta `credits_balance` al valore base del piano.
*   **UX:** Avviso email 3 giorni prima del reset: "Hai X crediti non usati che scadranno il [data]. Usali ora!"

**Layer 4: Fair Use Clause nei ToS**

```markdown
Sezione 7 — Fair Use Policy

Forgeko è progettato per supportare solopreneur nella creazione e gestione
di business digitali. Ci riserviamo il diritto di sospendere o terminare
account che:

1. Consumano >3x la media dei crediti della loro cohort senza 
   giustificazione business valida
2. Utilizzano automazioni/script per generare richieste in loop infiniti
3. Rivendono o redistribuiscono l'accesso a Forgeko a terzi non autorizzati
4. Generano contenuti illegali, hate speech, o che violano diritti di IP

In caso di sospetto abuso, riceverai notifica email con richiesta di 
chiarimenti entro 48 ore. La mancata risposta risulterà in sospensione
temporanea dell'account.
```

**Monitoring e Alerting:**
*   Dashboard interna (Metabase/Grafana): credit consumption per user, costo AI per MAU, anomaly detection
*   Alert automatici: spike >200% vs media 7gg → Slack; user consuma 100% crediti in <24 ore → flag per review manuale; costo AI/user/hour > €2 → auto-pause + notifica founder

---

## 🧠 PARTE 3: CORE LOGIC, MULTI-AGENTE E USER JOURNEY

### 3.1 I 4 Dipartimenti e gli 8 Step: Flussi Sequenziali e Criteri di Validazione

L'architettura del prodotto è organizzata in 4 Dipartimenti logici, ciascuno contenente 2 Step operativi. Questa struttura non è solo un'interfaccia utente, ma riflette l'architettura dei dati e la sequenzialità dei Document-State generati.

> **Decisione operativa — Fast Lane: Step 1-2 opzionali per utenti con idea chiara**
>
> **Problema identificato:** La versione precedente imponeva un percorso sequenziale obbligatorio su tutti gli 8 Step. Un utente che arriva con idea già chiara era costretto a completare validazione e canvas strategico prima di accedere alla generazione landing, creando frizione inutile e aumentando il Time-to-Value ben oltre i 45 minuti target.
>
> **Soluzione: Fast Lane**
> All'inizio del flusso, l'utente vede due opzioni:
>
> **Opzione A — Percorso Guidato (Consigliato):** "Ho un'idea ma voglio strutturarla" → Step 1 → Step 2 → Step 3 → ... Step 8
>
> **Opzione B — Fast Lane:** "Ho già un'idea chiara, voglio subito la landing page" → Step 3 direttamente, con `strategic_canvas.json` pre-popolato da un breve wizard di 3 domande (nome progetto, problema che risolve, target). L'utente può tornare a completare Step 1-2 in qualsiasi momento.
>
> **Impatto atteso:** Time-to-Value scende da ~45 minuti a ~10-15 minuti per gli utenti Fast Lane. Activation Rate atteso in aumento di 8-12 punti percentuali. Step 1-2 vengono comunque promossi come "migliora la qualità dell'output AI" per incoraggiarne il completamento successivo.
>
> **Implementazione:** Il `strategic_canvas.json` generato dal wizard Fast Lane è marcato come `source: fast_lane` e ha campi meno dettagliati. L'Agente Archivista riconosce questo flag e aggiunge un layer di inferenza contestuale per compensare la minore granularità dei dati.

---

#### DIPARTIMENTO 1: VALIDAZIONE & STRATEGIA
*Obiettivo: Trasformare un'idea vaga in un documento strategico strutturato e validato.*

**Step 1: Validazione Idea** *(Opzionale se Fast Lane attiva)*

*   **Input Utente:** Testo libero (max 2000 caratteri) descrivendo l'idea, il problema percepito e il target ipotizzato.
*   **Processo AI (Agente Esecutore):** Analizza l'idea rispetto a pattern di business noti (SaaS, Marketplace, E-commerce, Content). Genera 5-7 domande socratiche per identificare rischi e assunzioni non validate.
*   **Output:** Documento `validation_brief.md` contenente: Idea Core, Assunzioni Chiave, Rischi Identificati, Risposte Utente.
*   **Criterio di Completamento:** Utente risponde ad almeno 3 domande chiave e clicca "Approva Brief".
*   **Vincolo tecnico:** Il sistema non permette di procedere allo Step 2 (percorso guidato) senza un `validation_brief.md` salvato e versionato. Fast Lane bypassa questo controllo.

**Step 2: Dashboard Strategica (Strategic Canvas)** *(Opzionale se Fast Lane attiva)*

*   **Input Utente:** Revisione e integrazione dei dati dello Step 1 + input manuali su modello di monetizzazione e canali di acquisizione.
*   **Processo AI:** Aggrega i dati e genera un Lean Canvas strutturato in JSON.
*   **Output:** Documento `strategic_canvas.json` (Pitch 30s, Problema, Soluzione, Target, Pricing, Canali). Questo JSON diventa il "Master Context" per tutti i dipartimenti successivi.
*   **Fast Lane Fallback:** Se attivata, il `strategic_canvas.json` viene generato dal wizard 3 domande con flag `source: fast_lane`. I campi mancanti vengono inferiti dall'Agente Archivista a ogni chiamata successiva.

---

#### DIPARTIMENTO 2: PROGETTAZIONE & BRANDING
*Obiettivo: Tradurre la strategia in asset visivi e strutturali.*

**Step 3: Generazione Landing Page**

*   **Input Utente:** Prompt di refinement (opzionale) o approvazione diretta del brief.
*   **Processo AI:** Legge `strategic_canvas.json` + `validation_brief.md` (se disponibile). Genera codice HTML/Tailwind/React per una landing page completa.
*   **Output:** Codice sorgente salvato in `project_files` + Preview immagine PNG tramite Browserless.io (architettura Opaque — vedi Sezione 3.3).
*   **Componenti Generati:** Hero, Features, Social Proof, Pricing, CTA Footer.
*   **Criterio di Completamento:** Utente clicca "Approva Design". Il codice viene versionato come base per Step 5.

**Step 4: Brand Identity**

*   **Input Utente:** Preferenze di stile (es. "Minimal", "Corporate", "Playful") e settore di riferimento.
*   **Processo AI:** Genera palette colori (HEX), tipografia (Google Fonts), tone of voice.
*   **Output:** Documento `brand_guidelines.json` (Colori, Font, Tone of Voice).
*   **Criterio di Completamento:** Selezione della variante preferita. I colori vengono iniettati retroattivamente nel CSS della Landing Page (Step 3) tramite sostituzione variabili CSS.

---

#### DIPARTIMENTO 3: SVILUPPO & COSTRUZIONE
*Obiettivo: Aggiungere funzionalità dinamiche e connettere servizi esterni.*

**Step 5: Generatore Funzionalità**

*   **Input Utente:** Descrizione in linguaggio naturale delle feature (es. "Aggiungi un form di contatto che salva su database", "Crea un'area riservata con login").
*   **Processo AI:** Legge il codice della Landing Page (Step 3) + `brand_guidelines.json`. Genera snippet di codice React/Next.js e query Supabase.
*   **Output:** Moduli di codice integrati nel repository del progetto.
*   **Criterio di Completamento:** Test positivo della feature in ambiente di staging (preview).

**Step 6: Integrazione Backend**

*   **Input Utente:** Wizard guidato per connessione servizi (Stripe, Mailchimp, Resend, Supabase, altri).
*   **Processo Tecnico:** OAuth flow per ottenere token. I token vengono cifrati e salvati in Supabase Vault. Forgeko genera il codice di integrazione (es. Stripe Checkout session, webhook handler).
*   **Output:** Servizi connessi, variabili d'ambiente configurate, codice handler generato.
*   **Criterio di Completamento:** Health check verde su tutte le integrazioni attive (es. test webhook Stripe riuscito).

---

#### DIPARTIMENTO 4: LANCIA & ANALIZZA
*Obiettivo: Preparare al lancio, garantire compliance e monitorare la crescita.*

**Step 7: Test & Ottimizzazione (Audit)**

*   **Input Utente:** Richiesta di audit.
*   **Processo AI:** Analizza il codice generato e la struttura della landing page per valutare Accessibilità (a11y), SEO base, e UX (chiarezza CTA, leggibilità, mobile).
*   **Output:** Report `audit_report.json` con score e suggerimenti di fix. Score minimo consigliato: 80/100.
*   **Criterio di Completamento:** Utente applica i fix ("Auto-Fix") o ignora consapevolmente.

**Step 8: Dashboard Crescita & Legal Kit**

*   **Input Utente:** Configurazione finale domini, analytics, documenti legali.
*   **Processo AI:**
    1. Genera il **Legal Kit Dinamico** leggendo le integrazioni attive (Step 6) + `strategic_canvas.json`.
    2. Configura la Dashboard di Growth collegando analytics first-party e, se necessario in futuro, un provider analytics esterno.
    3. Attiva il **Report Settimanale AI** (cron job).
*   **Output:** Documenti legali (Privacy, ToS, Cookie) + Dashboard metriche attiva + dominio custom configurato.
*   **Criterio di Completamento:** Deploy su Vercel e attivazione dominio custom. Il progetto entra in stato `active`.

---

### 3.2 Architettura della Memoria: Document-State, Multi-Agente e Project Memory

Il problema principale delle applicazioni AI conversazionali è la **saturazione del Context Window** e il **decadimento della qualità** quando la cronologia della chat diventa troppo lunga. Forgeko risolve questo problema con un'architettura basata su **Documenti di Stato (Document-State)** e **Agenti Specializzati**.

#### Il Flusso Multi-Agente

Invece di un singolo LLM che "ricorda" tutto, utilizziamo due agenti distinti per ogni operazione complessa:

**1. Agente Archivista (Archivist Agent)**
*   *Modello:* Gemini 3.1 Pro (basso costo, alto context window, eccellente nel summarization).
*   *Compito:* Leggere i Document-State degli step precedenti (`validation_brief.md`, `strategic_canvas.json`, `brand_guidelines.json`, etc.). Riconoscere il flag `source: fast_lane` e integrare inferenze contestuali quando i dati sono parziali.
*   *Output:* Un **Meta-Prompt** (max 1.000 token) che sintetizza solo le informazioni necessarie per lo step corrente, formattato come YAML o JSON strutturato.

**2. Agente Esecutore (Executor Agent)**
*   *Modello:* Claude Opus 4.8 (ragionamento superiore, eccellente nel coding).
*   *Compito:* Riceve il Meta-Prompt generato dall'Archivista + l'input specifico dell'utente per lo step corrente.
*   *Output:* Codice, testo o analisi richiesta.

**Vantaggi Tecnici:**
*   **Costi Ridotti:** L'Archivista (Gemini) costa ~10x meno dell'Esecutore (Opus) per token di input. Invece di pagare Opus per leggere 50.000 token di cronologia, paghiamo Gemini per sintetizzarli in 1.000 token puliti.
*   **Qualità Costante:** L'Esecutore lavora sempre su un contesto "pulito" e focalizzato, riducendo allucinazioni.
*   **Auditability:** Meta-Prompt e Document-State salvati su DB. Se l'AI genera un errore, possiamo vedere esattamente quali informazioni le sono state fornite.

**Implementazione (Pseudocodice):**

```typescript
async function executeStep(projectId: UUID, stepId: number, userInput: string) {
  // 1. Recupera tutti i Document-State approvati per questo progetto
  const documents = await db.project_documents.findMany({
    where: { project_id: projectId, status: 'approved' }
  });

  // 2. Verifica se il canvas è Fast Lane e aggiunge istruzioni specifiche
  const canvas = documents.find(d => d.doc_type === 'strategic_canvas');
  const isFastLane = canvas?.metadata?.source === 'fast_lane';

  // 3. AGENTE ARCHIVISTA: Genera il Meta-Prompt
  const archivistPrompt = `
    Sei un archivista. Analizza i seguenti documenti di stato del progetto:
    ${documents.map(d => `--- ${d.doc_type} ---\n${d.content_md}`).join('\n')}
    
    ${isFastLane ? `NOTA: Il canvas strategico è stato generato via Fast Lane con 
    dati parziali. Inferisci i dettagli mancanti dal contesto disponibile e 
    segnala le assunzioni fatte nel Meta-Prompt.` : ''}
    
    Genera un Meta-Prompt sintetico (max 1000 token) con SOLO le informazioni
    necessarie per lo Step ${stepId}. Formato: oggetto YAML strutturato.
  `;

  const metaPrompt = await aiEngine.call('gemini-3.1-pro', archivistPrompt);

  // 4. AGENTE ESECUTORE: Esegue lo step
  const executorPrompt = `
    CONTESTO DEL PROGETTO (Archivista):
    ${metaPrompt}
    
    RICHIESTA UTENTE — STEP ${stepId}:
    ${userInput}
    
    ISTRUZIONI: Esegui la richiesta generando l'output richiesto.
  `;

  const finalOutput = await aiEngine.call('claude-opus-4.8', executorPrompt);

  // 5. Salva il nuovo Document-State
  await db.project_documents.create({
    project_id: projectId,
    step_id: stepId,
    doc_type: `step_${stepId}_output`,
    content_md: finalOutput,
    status: 'pending_review'
  });

  return finalOutput;
}
```

---

#### Project Memory: Il Vero Switching Cost

> **Decisione operativa — Project Memory come layer di prodotto esplicito**
>
> Il vero lock-in di Forgeko non è tecnico (il codice è esportabile) né legale (i template sono replicabili). È **cognitivo e storico**: l'accumulo progressivo di ogni decisione presa nel tempo, organizzato e consultabile.
>
> **Implementazione UI — Timeline Decisionale:**
> Una sidebar sempre visibile in ogni progetto mostra la storia completa:
> - Data e contenuto di ogni Document-State approvato
> - Snapshot con label (es. "Versione lanciata 15 Giugno", "Prima iterazione pricing")
> - Analytics storiche settimana per settimana
> - Highlight AI: "Hai cambiato il pricing 3 volte. La versione di Aprile aveva il CTR più alto."
>
> **Implementazione UI — Project Memory Export (solo Piano Pro):**
> L'utente può esportare l'intera Project Memory come PDF navigabile o JSON strutturato. Questo non è un "backup" ma un documento di business vivo, utilizzabile per presentazioni a investitori, brief ad agenzie, onboarding di collaboratori.
>
> **Comunicazione Marketing:**
> "Forgeko ricorda ogni decisione del tuo business. Tu no." → headline principale per retention e anti-churn messaging.

---

### 3.3 Motore di Generazione Landing Page e Protezione IP

La generazione di codice frontend (Step 3) espone al rischio di furto di IP se il codice HTML/CSS/JS viene servito direttamente al browser durante la preview. Forgeko implementa un'architettura **Opaque Rendering** che non espone mai il codice sorgente in fase di iterazione.

#### Architettura Opaque Rendering

1. **Generazione Server-Side:** L'Agente Esecutore genera il codice componente per componente (vedi Appendice A). Il codice viene salvato in `project_files` ma **non** inviato al client.

2. **Watermark Steganografico:** Prima di inviare il codice a Browserless, un middleware inietta un watermark invisibile nel CSS/meta tag contenente `user_id` + `timestamp`. Permette di risalire alla fonte in caso di leak.

3. **Rendering via Browserless.io:**
```typescript
const response = await fetch(
  'https://chrome.browserless.io/screenshot?token=API_KEY',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'data:text/html,' + encodeURIComponent(generatedHTML),
      options: { fullPage: true, type: 'png' }
    })
  }
);
const screenshotBuffer = await response.buffer();
```

4. **Il client riceve solo il PNG.** Nessun codice sorgente, nessun bundle JS, nessun CSS leggibile. L'utente interagisce con l'immagine e chiede modifiche in chat.

5. **Deploy Finale:** Solo quando l'utente approva il design e completa Step 6 (o paga il piano adeguato), il codice viene sbloccato, deployato su Vercel e servito come normale sito web.

> **Decisione operativa — Nessun watermark visibile nella preview**
>
> La versione precedente prevedeva un watermark visibile nella preview. Rimosso in linea con la modifica alla Sezione 2.1: il watermark visibile danneggia la percezione del prodotto. Il watermark steganografico invisibile è sufficiente per la protezione IP e non impatta l'esperienza di design.

**Vantaggi dell'architettura Opaque:**
*   **Protezione IP:** Impossibile copiare il codice sorgente dalla preview.
*   **Performance:** Il client non scarica bundle JS pesanti in fase iterativa; riceve solo un'immagine ottimizzata.
*   **Cross-Browser Consistency:** La preview è identica per tutti, renderizzata da Chrome headless standardizzato.

---

### 3.4 Versioning e Time-Machine (Snapshot JSONB)

#### Soluzione: Snapshot JSONB su Supabase

Ogni volta che l'utente clicca "Approva" alla fine di uno Step, il sistema crea uno Snapshot dell'intero stato del progetto.

**Struttura dello Snapshot:**
```json
{
  "snapshot_id": "uuid-v4",
  "project_id": "uuid-v4",
  "created_at": "2026-06-16T10:00:00Z",
  "trigger": "user_approved_step_3",
  "label": "",
  "state": {
    "documents": { "...tutti i project_documents approvati..." },
    "files": { "...tutti i file di codice generati..." },
    "integrations": { "...configurazioni attive..." }
  }
}
```

**Implementazione:**
*   **Tabella `project_snapshots`:** Contiene `id`, `project_id`, `snapshot_data` (JSONB), `label` (stringa editabile dall'utente), `created_at`.
*   **Trigger:** Alla fine di ogni Step, Edge Function serializza lo stato e inserisce nella tabella.
*   **Label Automatica:** Se l'utente non nomina lo snapshot, il sistema genera un label contestuale (es. "Dopo approvazione landing page — 16 Giugno").

**Limiti per Piano:**
*   *Free:* Ultimi 3 snapshot (coda FIFO)
*   *Founder:* Ultimi 20 snapshot
*   *Pro:* Illimitati (retention 90 giorni attivi, poi Cold Storage S3)

**Funzione di Restore:** Il sistema legge il JSONB dello snapshot selezionato e sovrascrive `project_documents` e `project_files`. Operazione istantanea, nativa del database, senza dipendenze esterne.

---

## 🛠️ PARTE 4: INFRASTRUTTURA, DATABASE E SICUREZZA

### 4.1 Stack Tecnologico e Gerarchia Multi-Tenant

*   **Frontend / Backend API:** Next.js 14+ (App Router). Server Components per performance, Route Handlers per API. TypeScript rigoroso su tutto il codebase.
*   **Database & Auth:** Supabase. PostgreSQL gestito, Autenticazione (social login + magic link), Storage per asset, Vault per segreti.
*   **Hosting & Edge:** Vercel. Deploy automatico da GitHub, Edge Functions per middleware, CDN globale.
*   **Styling:** Tailwind CSS + shadcn/ui. Design system coerente, accessibile, ottimizzato per generazione AI.
*   **Background Jobs:** Inngest (o Supabase Edge Functions + pg_cron) per task asincroni.
*   **Rendering Preview:** Browserless.io (headless Chrome API).
*   **Caching & Rate Limiting:** Redis via Upstash.

#### Gerarchia Multi-Tenant: Workspace vs Progetti

*   **Workspace:** Rappresenta l'Utente/Cliente. È l'entità che paga, possiede i Crediti AI e gestisce il piano di abbonamento.
*   **Progetto:** Rappresenta il Business/SaaS creato dall'utente. Un Workspace può avere N Progetti.
    *   I Crediti AI sono condivisi (pool) tra tutti i progetti del Workspace.
    *   Domini Custom, Legal Kit e File di Codice sono isolati a livello di Progetto.
    *   La Project Memory è per-Progetto.

---

### 4.2 Modello Dati SQL Completo

```sql
-- Abilita estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Per futuri utilizzi RAG

-- 1. WORKSPACES (Entità di Billing e Crediti)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  plan_tier VARCHAR(20) DEFAULT 'free'
    CHECK (plan_tier IN ('free', 'founder', 'pro')),
  billing_cycle VARCHAR(10) DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly', 'annual')),
  credits_balance INT DEFAULT 50,
  opus_budget_used_eur DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROJECTS (Entità di Prodotto, isolata)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
    -- Valori: draft, active, archived
  current_step INT DEFAULT 1,
  onboarding_mode VARCHAR(20) DEFAULT 'guided',
    -- Valori: guided, fast_lane
  config_jsonb JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROJECT DOCUMENTS (Memoria Multi-Agente / Document-State)
CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  step_id INT NOT NULL,
  doc_type VARCHAR(50) NOT NULL,
    -- Valori: validation_brief, strategic_canvas, brand_guidelines, ...
  content_md TEXT,
  metadata JSONB DEFAULT '{}',
    -- Contiene flags come source: fast_lane, versione, etc.
  status VARCHAR(20) DEFAULT 'pending',
    -- Valori: pending, approved, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROJECT FILES (Codice Generato)
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  component_type VARCHAR(50),
    -- Valori: hero, features, pricing, cta, layout, etc.
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECT SNAPSHOTS (Time-Machine + Project Memory)
CREATE TABLE project_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  label VARCHAR(255),
  trigger_event VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AI GENERATIONS (Logging e Monitoring Costi)
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  operation VARCHAR(50) NOT NULL,
  model_used VARCHAR(50) NOT NULL,
  tokens_in INT NOT NULL,
  tokens_out INT NOT NULL,
  credits_used INT NOT NULL,
  cost_eur DECIMAL(10,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at); -- Partizionamento mensile per performance

-- 7. INTEGRATIONS (API Keys Cifrate)
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  service_name VARCHAR(50) NOT NULL,
  encrypted_credentials TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  UNIQUE(project_id, service_name)
);

-- 8. WEBHOOK EVENTS PROCESSED (Idempotenza)
CREATE TABLE webhook_events_processed (
  event_id VARCHAR(255) PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per Performance
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_documents_project ON project_documents(project_id);
CREATE INDEX idx_documents_status ON project_documents(project_id, status);
CREATE INDEX idx_generations_workspace ON ai_generations(workspace_id);
CREATE INDEX idx_snapshots_project ON project_snapshots(project_id, created_at DESC);
```

---

### 4.3 Row Level Security (RLS): Isolamento Totale dei Dati

La sicurezza multi-tenant è imposta a livello di database tramite le policy RLS di PostgreSQL. Anche in caso di vulnerabilità XSS o SQL Injection nel frontend, un utente non può mai leggere i dati di un altro workspace.

```sql
-- Abilita RLS su tutte le tabelle
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- POLICY: WORKSPACES
CREATE POLICY "Users can view own workspace" ON workspaces
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can update own workspace" ON workspaces
  FOR UPDATE USING (auth.uid() = owner_id);

-- POLICY: PROJECTS
CREATE POLICY "Isola Progetti per Workspace" ON projects
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- POLICY: DOCUMENTS
CREATE POLICY "Isola Documenti per Workspace" ON project_documents
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.owner_id = auth.uid()
    )
  );

-- POLICY: FILES
CREATE POLICY "Isola Files per Workspace" ON project_files
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.owner_id = auth.uid()
    )
  );

-- POLICY: SNAPSHOTS
CREATE POLICY "Isola Snapshots per Workspace" ON project_snapshots
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.owner_id = auth.uid()
    )
  );

-- POLICY: AI GENERATIONS (Read-Only per l'utente)
CREATE POLICY "Users can view own generations" ON ai_generations
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- POLICY: INTEGRATIONS
CREATE POLICY "Isola Integrazioni per Workspace" ON integrations
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.owner_id = auth.uid()
    )
  );
```

---

### 4.4 AI Engine, Routing, Circuit Breaker e Code Asincrone

#### Circuit Breaker e Fallback

```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly FAILURE_THRESHOLD = 5;
  private readonly RECOVERY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minuti

  async call(provider: 'opus' | 'gemini', prompt: string) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.RECOVERY_TIMEOUT_MS) {
        this.state = 'HALF_OPEN';
      } else {
        return this.fallbackCall(prompt); // Forza Gemini
      }
    }

    try {
      const result = await this.executeCall(provider, prompt);
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      return this.fallbackCall(prompt);
    }
  }

  private recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.state = 'OPEN';
    }
  }

  private reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private async fallbackCall(prompt: string) {
    return this.executeCall('gemini', prompt);
  }
}
```

**Logica di apertura circuito:** Se le chiamate a Opus falliscono >10% in 5 minuti (timeout, 500 errors), il circuito si apre. Dopo 10 minuti entra in stato half-open e invia una singola richiesta di test. Se ha successo, si richiude e il traffico riprende normalmente.

#### Code Asincrone (Inngest)

Le operazioni pesanti (Generazione Landing Page completa, Report Settimanale, Export Codice GitHub) non vengono eseguite nella richiesta HTTP sincrona. Vengono delegate a Inngest:

1. L'API Next.js inserisce un job nella coda: `inngest.send({ name: 'project/generate-landing', data: { projectId } })`.
2. Restituisce immediatamente `202 Accepted` al client.
3. Il worker Inngest processa il job, chiama l'AI Engine, salva i risultati su DB.
4. Il client riceve aggiornamenti real-time tramite Supabase Realtime (WebSocket).

---

### 4.5 Sicurezza e Data Vault: Encrypted Credentials Architecture

Gli utenti collegano servizi critici (Stripe, Mailchimp, GitHub). Le API Key sono il bersaglio più prezioso per un attaccante. Forgeko implementa un'architettura di **credenziali cifrate con decifratura server-side just-in-time**: le credenziali sono cifrate a riposo, decifrate solo in memoria per la durata strettamente necessaria all'operazione autorizzata, mai inviate al client e mai loggate.

Questa architettura non deve essere comunicata come "zero-knowledge" in senso crittografico stretto: Forgeko può tecnicamente decifrare le credenziali lato server per eseguire integrazioni. Il claim corretto è **encrypted credentials with just-in-time server-side decryption**.

#### Supabase Vault (pgsodium)

1. **Inserimento:** L'utente inserisce la chiave nel frontend. Viaggio su HTTPS.
2. **Cifratura Server-Side:** La Route Handler chiama `supabase.vault.encrypt()`.
3. **Storage:** Solo il ciphertext è nel DB. La chiave in chiaro non viene mai persistita.
4. **Utilizzo:** La Edge Function decifra la chiave *in memoria* solo per la durata della richiesta.
5. **Zerizzazione:** La variabile viene sovrascritta e garbage-collected immediatamente. Non viene mai loggata (né in Sentry né in console.log).

```sql
-- Inserimento sicuro
INSERT INTO integrations (project_id, service_name, encrypted_credentials)
VALUES (
  'uuid-progetto',
  'stripe',
  (SELECT supabase.vault.encrypt('sk_live_...'))
);

-- Recupero sicuro (in-memory, mai loggato)
SELECT supabase.vault.decrypt(encrypted_credentials) AS api_key
FROM integrations
WHERE project_id = 'uuid-progetto' AND service_name = 'stripe';
```

---

### 4.6 Export Codice Sorgente: Il Pattern "Golden Master"

Per gli utenti Piano Pro, Forgeko offre l'esportazione completa del codice sorgente su GitHub personale.

#### Architettura dell'Export

1. **Il Golden Master:** Repository privato `forgeko/golden-master-nextjs` con scheletro Next.js 14 perfettamente configurato (App Router, Tailwind, Supabase Client, ESLint, Prettier, TypeScript strict). Mantenuto manualmente e aggiornato mensilmente.

2. **Trigger Export:** Utente clicca "Esporta su GitHub" nella Dashboard Progetto.

3. **Worker Asincrono (Inngest):**
   - Autentica tramite GitHub Token OAuth dell'utente
   - Crea nuovo repository privato sull'account utente (es. `user/my-forgeko-saas`)
   - Clona il Golden Master in memoria
   - Sovrascrive i file placeholder con i file reali da `project_files`
   - Genera `.env.local` con le variabili decifrate dal Vault (file fornito separatamente, **non pushato su GitHub**)
   - Esegue `git commit` + `git push` sul nuovo repo

4. **Risultato:** Link al repository GitHub pronto per essere clonato o collegato a Vercel/Netlify per deploy indipendente.

**Garanzia qualità:** L'utente non riceve un dump di file disorganizzati, ma un progetto Next.js professionale, conforme agli standard di industria.

---

## 📈 PARTE 5: INTEGRAZIONI, MARKETING E COMPLIANCE

### 5.1 Architettura delle Integrazioni: Webhook-First con Polling Fallback

#### Pattern Webhook-Driven

```typescript
// Esempio: Validazione Webhook Stripe
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Controlla idempotenza
    const alreadyProcessed = await db.webhook_events_processed.findOne({
      where: { event_id: event.id }
    });
    if (alreadyProcessed) {
      return new Response(JSON.stringify({ received: true, skipped: true }), { status: 200 });
    }

    // Processa evento e registra
    await handleStripeEvent(event);
    await db.webhook_events_processed.create({
      event_id: event.id,
      source: 'stripe'
    });

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }
}
```

**Processing Idempotente:** Ogni evento ha un `event_id` univoco. Prima di processare, il sistema verifica che non sia già stato gestito (tabella `webhook_events_processed`) per evitare duplicati in caso di retry.

**Code Asincrone:** Gli eventi webhook vengono inseriti in coda (Inngest/Redis) e processati da worker dedicati, non nella richiesta HTTP sincrona.

#### Polling come Fallback

Per servizi senza webhook affidabili:
*   **Cron Jobs:** Supabase `pg_cron` ogni 15 minuti per sincronizzare stati critici.
*   **Backoff Esponenziale:** In caso di `429 Too Many Requests`: 1min → 2min → 4min → 8min.
*   **Dead Letter Queue:** Event webhook che falliscono 5 retry → DLQ + alert Slack per review manuale.

#### Resilienza e Monitoring
*   **Health Checks:** Ogni integrazione ha un health check periodico. Se fallisce 3 volte consecutive → marcata `degraded` + notifica utente.
*   **Feature Flags:** Ogni integrazione è dietro feature flag. In caso di outage critico, disabilitabile globalmente senza deploy.

---

### 5.2 Il Doppio Binario dei Pagamenti: Lemon Squeezy (MoR) + Stripe (OAuth)

#### Binario 1: Abbonamenti Forgeko (Lemon Squeezy come MoR)

**Perché Lemon Squeezy:**
*   **Responsabilità Fiscale Globale:** Lemon Squeezy calcola e versa automaticamente IVA UE, Sales Tax USA stato per stato, e tasse digitali globali. Forgeko riceve solo il netto mensile.
*   **Compliance PCI-DSS:** Lemon Squeezy gestisce l'intero flusso di pagamento, riducendo il perimetro PCI di Forgeko a SAQ A.
*   **Fatturazione Automatica:** Fatture conformi emesse automaticamente, note di credito e rimborsi gestiti.
*   **Customer Portal:** Gestione self-service abbonamenti (cambio piano, cancellazione, update carta) riduce carico supporto.

**Flusso Tecnico:**
1. Utente clicca "Upgrade". Next.js reindirizza a checkout Lemon Squeezy.
2. Lemon Squeezy invia webhook per eventi critici: `subscription_created`, `subscription_updated`, `subscription_expired`, `subscription_payment_success`, `subscription_payment_failed`.
3. Il webhook handler aggiorna `workspaces.plan_tier`, resetta crediti, attiva feature.

**Gestione Piani Annuali:**
*   Lemon Squeezy supporta nativamente billing annuale. Configurare prodotti separati per mensile/annuale.
*   Il campo `workspaces.billing_cycle` traccia il tipo di billing per logiche interne (es. credit expiry trimestrale per annuali vs mensile per mensili).

#### Binario 2: Pagamenti nei Progetti Utenti (Stripe OAuth)

**Flusso OAuth:**
1. Utente clicca "Connetti Stripe" nel wizard Step 6.
2. Forgeko reindirizza a `https://connect.stripe.com/oauth/authorize` con scope `read_write`.
3. Utente autorizza Forgeko sul suo account Stripe.
4. Stripe reindirizza a Forgeko con `authorization_code`.
5. Forgeko scambia il codice per `access_token` + `stripe_user_id`.
6. `access_token` cifrato con Supabase Vault. `stripe_user_id` salvato in chiaro.
7. I pagamenti dei clienti finali vanno **direttamente** sul conto Stripe dell'utente. Forgeko non tocca questi fondi.

**Disclaimer Obbligatorio (visualizzato prominentemente in Step 6):**
> *"Connettendo Stripe, i pagamenti dei tuoi clienti andranno direttamente sul tuo conto Stripe. Tu sei responsabile della gestione fiscale, delle fatture e della compliance nella tua giurisdizione. Forgeko non agisce come intermediario finanziario."*

---

### 5.3 Strategia GTM, Retention e Anti-Churn Loops

> **Decisione operativa — GTM allineato all'ICP Fase 1**
>
> Il playbook di lancio organico è stato ricalibrato per l'ICP Fase 1 (developer/PM/designer tech-adjacent) invece del "solopreneur non tecnico" originale. Il copy, i canali e il messaging riflettono questo allineamento. I canali per l'ICP Fase 2 (non tecnici) vengono attivati solo dopo il raggiungimento delle Kill Metrics di Fase 3.

#### Playbook di Lancio Organico (30 Giorni, Budget €0 Cash / ~40h Founder Time)

**Fase 1: Preparazione (Giorni 1-7)**

*   **Giorni 1-2:** Landing page copy calibrata su ICP Fase 1. Headline: "Dal side project al business: tutto ciò che non vuoi gestire, in un posto solo." Sub-headline: "Compliance, domini, legal kit, analytics — mentre tu scrivi codice." Setup form email (Resend o ConvertKit free tier).
*   **Giorni 3-4:** Creazione 3 contenuti pillar:
    1. Thread X/Twitter: "8 cose che ogni solopreneur deve configurare prima del lancio (e che Forgeko automatizza)"
    2. Post IndieHackers: "Come ho ridotto l'overhead pre-lancio da 3 settimane a 3 ore" (case study ipotetico o beta user story)
    3. Video Loom (3 min): Demo Fast Lane — dalla landing alla preview in <10 minuti.
*   **Giorni 5-7:** Identificazione 20 community/canali target:
    *   IndieHackers (forum, commenti prodotti correlati)
    *   Hacker News (Show HN — martedì/mercoledì 9AM PST)
    *   Twitter/X (search "building saas", "side project", "launched today")
    *   Discord: Buildspace, WIP.co, MakerLog
    *   Reddit: r/SaaS, r/IndieHackers, r/webdev

**Fase 2: Lancio Soft (Giorni 8-14)**

*   **Giorno 8:** Post simultaneo su IndieHackers + HN Show. Risposta attiva a ogni commento nelle prime 2 ore (algoritmo di ranking sensibile all'engagement iniziale).
*   **Giorni 9-10:** Outreach diretto a 50 prospect (builder attivi identificati da post recenti). Template con variabili formali: *"Ciao {{prospect_first_name}}, ho visto che stai costruendo {{prospect_project_name}}. Sto testando uno strumento che automatizza {{specific_contextual_pain}}. Vuoi essere tra i primi 20 tester? Nessun acquisto richiesto."*
*   **Giorni 11-14:** Raccolta feedback qualitativo. Iterare copy se conversione form <5%. Pivot canale se CPE (misurato in ore founder) >4h/email.

**Fase 3: Amplificazione (Giorni 15-30)**

*   Pubblicazione contenuti pillar.
*   Referral semplice: "Invita 3 builder → early access Pro + 500 crediti bonus".
*   Analisi metriche giornaliere. Se volume organico plateau → test €500 paid (Meta o Twitter Ads targetizzate su interessi "indie hacker", "SaaS", "solopreneur").

**Metriche Successo Pre-Build (Kill Metrics Fase 1 — vedi Sezione 1.5).**

---

#### Retention: Il "Rituale del Lunedì" (Report Settimanale AI)

**Architettura del Report:**

1. **Trigger:** Cron job ogni Domenica alle 23:00 UTC.
2. **Data Collection:** Query su analytics first-party:
   *   Visite totali + trend vs settimana precedente
   *   Tasso di conversione visitatori → email/signup
   *   Revenue (se Stripe connesso)
   *   Top referrers
3. **Generazione AI:** Agente Archivista legge metriche + `strategic_canvas.json`. Agente Esecutore genera report narrativo con:
   *   **Headline:** "La tua SaaS è cresciuta del 15% questa settimana!" o "Attenzione: il tasso di abbandono è aumentato."
   *   **3 Insight Chiave** (max, non di più — qualità > quantità)
   *   **1 Azione Suggerita** concreta e specifica
   *   **1 Domanda Provocatoria** basata sui dati
4. **Consegna:** Email Lunedì 9:00 AM (timezone utente) via Resend + notifica in-app.
5. **CTA:** "Esplora il report completo in dashboard" → drive re-engagement.

**Ottimizzazione:** A/B test su subject line, tone, numero insight. Se open rate <30% dopo 4 settimane → redesign report.

---

#### Anti-Churn Loops Tecnici

**Scenario 1: Pagamento Fallito (Involuntary Churn)**
*   **Trigger:** Webhook Lemon Squeezy `subscription_payment_failed`.
*   **Sequenza email (Resend):**
    *   Day 0: "Il tuo pagamento non è andato a buon fine. Aggiorna la carta."
    *   Day 3: "Reminder: il tuo abbonamento scadrà tra 4 giorni."
    *   Day 7: "Ultimo avviso: account downgradato a Free domani."
*   **Grace Period:** 7 giorni di accesso alle feature del piano pagato.

**Scenario 2: Cancellazione Volontaria**
*   **Interstitial:** Survey "Perché te ne vai?" prima della conferma.
*   **Offerta Dinamica:**
    *   "Troppo costoso" → 50% sconto 2 mesi
    *   "Mancano feature" → Roadmap + notifica al lancio feature
    *   "Non lo uso più" → Downgrade a Free + highlight feature non esplorate
*   **Piani Annuali:** Se utente annuale cancella, il pro-rata non usato viene convertito in mesi gratuiti sul piano Free ("I tuoi dati e progetti rimangono accessibili per altri X mesi").
*   **Messaggio di Conferma:** "I tuoi dati e la Project Memory saranno salvati per 90 giorni. Puoi riattivare con un click."

**Scenario 3: Inattività (Dormant Users)**
*   **Trigger:** Nessun login per >14 giorni.
*   **Email "We Miss You":** Feature nuove + tutorial rapido per ripartire.
*   **Follow-up Day 7:** Survey "Cosa ti impediva di usare Forgeko?" (3 opzioni max).

---

### 5.4 Dashboard delle Metriche di Controllo (KPI)

**Tier 1: Salute Finanziaria (Review Mensile)**

| Metrica | Target | Azione se sotto target |
| :--- | :--- | :--- |
| **MRR** | Crescita >10% MoM | Analisi cohort, riduzione churn |
| **Net Revenue Retention (NRR)** | >100% | Upsell insufficiente o churn eccessivo |
| **Gross Margin** | >80% | Rivedere pricing o costi AI |
| **Cash Runway** | >12 mesi | Accelerare revenue o tagliare costi |
| **LTV:CAC Ratio** | >3:1 | Se <2:1, modello non sostenibile |

**Tier 2: Engagement & Growth (Review Settimanale)**

| Metrica | Target | Azione se sotto target |
| :--- | :--- | :--- |
| **DAU/MAU Ratio** | >20% | Se <10%, prodotto non sticky |
| **Free → Paid Conversion** | >3% entro 30gg | Se <1% dopo 3 test → PIVOT pricing |
| **Activation Rate** | >40% (Step 3 entro 7gg) | Ottimizzare onboarding, verificare Fast Lane |
| **Churn Rate (Logo)** | <5%/mese | Anti-churn automation |
| **Time-to-Value** | <45 min (guided) / <15 min (fast lane) | Semplificare flusso |

**Tier 3: Operational Health (Review Giornaliera)**

| Metrica | Target | Azione se sotto target |
| :--- | :--- | :--- |
| **AI Cost per MAU** | <€2 | Se >€3, rivedere mix modelli |
| **P95 Latency Step 3** | <10s per componente | Ottimizzare rendering |
| **Webhook Failure Rate** | <0.1% | Investigare endpoint o provider |
| **Uptime** | >99.5% | Alert immediato, post-mortem obbligatorio |

**Reporting Cadence:**
*   **Daily:** Automated Slack summary Tier 3 + anomalie (spike costi AI, drop conversioni).
*   **Weekly:** Review meeting fondatori + lead eng su Tier 2.
*   **Monthly:** Deep dive Tier 1 + strategic planning.

---

### 5.5 Il Doppio Quadro Legale: Compliance Piattaforma + Legal Kit Utenti

#### Quadro A: Compliance di Forgeko (Piattaforma SaaS)

**GDPR (General Data Protection Regulation)**

*   **Base Giuridica:**
    *   *Consenso:* Marketing email, cookie non-essenziali.
    *   *Contratto:* Fornitura servizio (processing dati utente per generare codice, gestire abbonamento).
    *   *Legittimo Interesse:* Analytics interni, sicurezza, prevenzione frodi.
*   **Diritti dell'Interessato (Art. 15-22):**
    *   *Accesso:* Export completo dati (JSON/CSV) dalla dashboard.
    *   *Rettifica:* Modifica dati personali in qualsiasi momento.
    *   *Cancellazione:* Soft delete (30gg grace) → hard delete (cancellazione fisica DB + backup).
    *   *Portabilità:* Export dati in JSON machine-readable.
*   **Trasferimenti Extra-UE:** Sub-processors con data center UE o SCCs firmati. DPA disponibile per download su `/legal/dpa`.
*   **Data Breach Notification:** Notifica al Garante entro 72 ore se breach ad alto rischio. Notifica utenti senza ingiustificato ritardo.

**CCPA/CPRA (California)**
*   Right to Know, Right to Delete (con eccezioni contrattuali).
*   Forgeko **non vende** dati personali. Se cookie advertising presenti: link "Do Not Sell or Share My Personal Information" nel footer.

**AI Act (UE)**
*   Classificazione: "Limited Risk" (obblighi di trasparenza).
*   Etichettare contenuti AI-generated ("Questo report è generato dall'AI").
*   Human Oversight mantenuto: l'utente ha sempre controllo finale (approvazione documenti, decisione deploy).

**Sicurezza e Roadmap Certificazioni:**
*   Encryption: TLS 1.3 (transito), AES-256 (riposo), Vault (segreti).
*   MFA obbligatoria per tutti i dipendenti Forgeko.
*   Mese 6: SOC 2 Type I. Mese 18: SOC 2 Type II. Mese 24: ISO 27001 (se richiesto da enterprise).

**Documenti Legali Pubblici:**
*   Privacy Policy, Terms of Service, Cookie Policy + CMP banner (CookieYes o Osano), DPA, Sub-processor List pubblica.

---

#### Quadro B: Il Legal Kit Dinamico per gli Utenti

**Architettura del Generatore:**

1. **Master Template "Avvocato-Approved":** 5-6 template base (Privacy Policy, ToS, Cookie Policy, GDPR Addendum, Disclaimer) scritti e revisionati *una tantum* da avvocato specializzato. I template sono versionati e immutabili. Qualsiasi modifica richiede nuova revisione legale.

2. **Motore di Iniezione Variabili:** Alla generazione (Step 8), il sistema legge:
   *   Dati progetto (nome, email contatto, dominio)
   *   Integrazioni attive (Stripe → clausole PCI, Mailchimp → clausole email marketing, etc.)
   *   Tipo di business da `strategic_canvas.json`
   *   Template engine (Handlebars o Liquid) popola i placeholder.

3. **Output:** HTML (per pubblicazione) + PDF (per archiviazione).

**Tutela Legale di Forgeko (Risk Mitigation):**

1. **Clickwrap Disclaimer Obbligatorio** (prima di ogni generazione, non solo la prima):
   > *"Comprendo e accetto che Forgeko non è uno studio legale e non fornisce consulenza legale. I documenti generati sono template automatizzati che potrebbero non essere conformi alle leggi della mia giurisdizione specifica. Mi assumo la piena responsabilità per l'uso di questi documenti e mi impegno a farli revisionare da un avvocato qualificato prima di pubblicarli. Forgeko non è responsabile per eventuali danni derivanti dall'uso di questi documenti."*
   *   Accettazione loggata: timestamp, IP, versione disclaimer.

2. **Disclaimer Prominente nei Documenti Generati:**
   > *"DOCUMENTO GENERATO AUTOMATICAMENTE DA FORGEKO. NON COSTITUISCE PARERE LEGALE. SI RACCOMANDA REVISIONE DA PARTE DI UN AVVOCATO QUALIFICATO PRIMA DELL'USO."*

3. **Feature "Prompt per Avvocato Umano":** Dopo la generazione, pulsante "Revisiona con un Avvocato" genera un brief strutturato pronto per Upwork/Fiverr/LegalZoom.

4. **Limitazione Responsabilità nei ToS:** Esclusione danni indiretti e consequenziali. Cap responsabilità totale pari all'ammontare pagato negli ultimi 12 mesi.

5. **Review Legale Periodica:** Template revisionati da counsel esterno ogni 12 mesi o a seguito di cambiamenti normativi significativi. Changelog versionato comunicato agli utenti con invito a rigenerare i documenti.

**Separazione Responsabilità:**
*   **Forgeko è responsabile di:** accuratezza tecnica del generatore, qualità dei Master Template, sicurezza dei dati.
*   **L'utente è responsabile di:** revisione legale finale, adattamento alla propria giurisdizione, implementazione corretta, aggiornamento al variare del business o delle leggi.

---

## PARTE 6: GOVERNANCE, RISCHI, OPERATIONS E CRESCITA OPERATIVA

Questa parte rende il documento utilizzabile come fonte unica per sviluppo, marketing, legal, operations, customer success, product management e business development. Il livello di rigore è **operativo serio**: sufficiente per guidare il team e sostenere una lettura da investitore, senza trasformare il documento in un pitch deck o in un manuale enterprise prematuro.

### 6.1 Governance e Operating Model

**Modello operativo scelto:** solo founder nelle prime fasi, con transizione programmata verso mini-team. Ogni funzione ha un owner iniziale unico e un owner futuro esplicito, così le decisioni non restano implicite.

| Area | Owner iniziale | Owner futuro | Output vincolante | Cadence |
| :--- | :--- | :--- | :--- | :--- |
| **Product Management** | Founder / Head of Product | Product Lead | Roadmap, backlog, prioritizzazione, discovery notes | Weekly |
| **Engineering** | Founder tecnico / CTO | Engineering Lead | Architettura, PR, incidenti tecnici, qualità codice | Daily async + weekly review |
| **Growth & Marketing** | Founder | Growth Lead | Landing, waitlist, canali, funnel, contenuti | 2x weekly |
| **Legal & Operations** | Founder | Ops/Legal Owner + counsel esterno | DPA, ToS, privacy, vendor register, risk register | Monthly + on incident |
| **Customer Success** | Founder | CS Lead | Onboarding, support, feedback loop, churn prevention | Weekly |
| **Finance & Unit Economics** | Founder | Finance/Ops | Pricing, costi AI, margini, runway, MRR | Monthly |

**Cadence minima:**
*   **Daily Founder Check (15 min):** bug critici, costi AI anomali, signup/waitlist, blocchi utenti.
*   **Weekly Operating Review (60 min):** activation, conversione, feedback utenti, roadmap, issue legali aperte, vendor status.
*   **Monthly Business Review (90 min):** MRR, retention, burn, unit economics, kill metrics, decisioni di pivot.
*   **Quarterly Spec Review:** aggiornamento formale di questo documento o conferma esplicita che resta valido.

**Decision Log:**
Ogni decisione che cambia pricing, legal posture, architettura, dati trattati, ICP, GTM o vendor critico deve essere registrata con:
*   data;
*   owner;
*   contesto;
*   opzioni considerate;
*   decisione presa;
*   metrica o evento che può invalidarla;
*   sezione del documento aggiornata.

**RACI minimale:**

| Decisione | Responsible | Accountable | Consulted | Informed |
| :--- | :--- | :--- | :--- | :--- |
| Cambi pricing | Founder / Product | Founder | Finance/Ops, Growth | Engineering, CS |
| Nuovo sub-processor | Ops/Legal | Founder | Counsel, Engineering | Utenti se materiale |
| Nuovo modello AI | Engineering | CTO/Founder | Product, Ops/Legal | Growth, CS |
| Modifica Legal Kit | Ops/Legal | Founder | Counsel esterno | Product, CS |
| Pivot ICP/GTM | Growth/Product | Founder | CS, Finance | Engineering |
| Incident security | Engineering | CTO/Founder | Ops/Legal, provider coinvolti | Utenti se richiesto |

---

### 6.2 Legal Risk Register

**Giurisdizione base:** Italia / Unione Europea. Forgeko nasce come SaaS GDPR-first, con documentazione legale e processi pensati per clienti UE e successiva estensione a UK/USA.

**Postura Legal Kit scelta:** template assistiti. Forgeko genera documenti, checklist e brief contestuali, ma non promette compliance completa né consulenza legale. L'evoluzione futura verso compliance automation forte è possibile solo dopo validazione legale, logging robusto, template revisionati per giurisdizione e processo di aggiornamento normativo.

| Rischio | Ambito | Probabilità | Impatto | Mitigazione obbligatoria | Owner | Trigger revisione |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Legal Kit percepito come consulenza legale** | Legal Kit utenti | Media | Alto | Clickwrap prima di ogni generazione, disclaimer nei documenti, copy prodotto senza promesse di compliance garantita, brief per avvocato umano | Ops/Legal | Reclamo utente, claim marketing ambiguo, modifica template |
| **Template non adatti a giurisdizione utente** | Legal Kit utenti | Alta | Alto | Chiedere paese target, dichiarare copertura, bloccare output finale se giurisdizione non supportata, suggerire revisione counsel | Ops/Legal | Nuova country supportata |
| **GDPR: base giuridica incompleta** | Forgeko SaaS | Media | Alto | Mappatura trattamenti, registro data processing, privacy policy, DPA, consenso marketing separato | Ops/Legal | Nuovo dato personale o nuovo sub-processor |
| **Trasferimenti extra-UE non coperti** | Forgeko SaaS | Media | Alto | Sub-processor list, DPA, SCC dove necessarie, preferenza data region UE se disponibile | Ops/Legal | Nuovo vendor non UE |
| **AI Act classificato superficialmente** | Forgeko SaaS + Legal Kit | Media | Medio/Alto | Risk assessment per funzionalità AI, label AI-generated, human approval obbligatoria, log degli output | Ops/Legal + Product | Nuova funzionalità AI o cambio normativa |
| **Consumer protection / refund ambiguity** | Billing Forgeko | Media | Medio | ToS chiari, refund policy, gestione trial/cancellazioni, pricing trasparente, MoR configurato correttamente | Ops/Legal + Finance | Cambio pricing o canale vendita |
| **Stripe nei progetti utente interpretato come intermediazione Forgeko** | SaaS utenti | Bassa/Media | Alto | Disclaimer Step 6, fondi diretti su Stripe utente, nessuna custodia fondi, log consenso | Ops/Legal | Cambio flusso pagamenti |
| **Documenti AI-generated non aggiornati dopo cambio normativo** | Legal Kit utenti | Media | Alto | Versioning template, review annuale minima, review straordinaria su cambio normativo, notifica utenti e rigenerazione | Ops/Legal | Nuovo GDPR/AI Act/consumer update |
| **Marketing claim eccessivo sulla compliance** | Marketing | Media | Alto | Claim review prima di pubblicazione, lista parole vietate: "garantito", "legalmente perfetto", "compliance automatica completa" | Growth + Ops/Legal | Nuova landing/campagna |

**Regole copy legal/compliance:**
*   Ammesso: "template assistiti", "documenti generati da template revisionati", "checklist contestuale", "riduce il lavoro preparatorio".
*   Vietato senza approvazione counsel: "compliance garantita", "sostituisce un avvocato", "legalmente valido in ogni paese", "GDPR automatico completo".
*   Ogni pagina marketing che menziona legal/compliance deve linkare disclaimer sintetico e ToS completi.

---

### 6.3 Threat Model IT & Security

**Asset critici:**
*   credenziali OAuth e API key degli utenti;
*   dati personali degli utenti Forgeko e dei loro clienti finali se importati;
*   Project Memory e Document-State;
*   codice generato e Golden Master Repository;
*   webhook secrets;
*   billing state e crediti AI;
*   template legali versionati;
*   prompt e meta-prompt salvati.

**Attori e obiettivi:**

| Attore | Obiettivo plausibile | Superficie primaria |
| :--- | :--- | :--- |
| Utente malevolo Free | Consumare risorse AI, abuso crediti, scraping codice | API AI, preview, rate limits |
| Utente autenticato curioso | Leggere dati di altri workspace | RLS, API route, object storage |
| Attaccante esterno | Rubare token Stripe/GitHub o dati progetto | integrazioni, Vault, logs, Sentry |
| Bot/spammer | Creare account e generare contenuti abusivi | signup, email, AI generation |
| Competitor | Copiare output, prompt, Golden Master | preview, export, repo template |
| Supply-chain attacker | Compromettere dependency o vendor | npm, Vercel, Supabase, Inngest, Browserless |

**Minacce prioritarie e controlli minimi:**

| Minaccia | Impatto | Controlli richiesti |
| :--- | :--- | :--- |
| **Cross-tenant data leak** | Critico | RLS su tutte le tabelle, test negativi per workspace altrui, storage policies, review su ogni nuova tabella |
| **Prompt injection contro Archivista/Esecutore** | Alto | Separazione system/user context, sanitizzazione input, allowlist tool, refusal policy, log prompt, test adversarial |
| **Webhook replay o spoofing** | Alto | Firma provider, raw body verification, timestamp tolerance se supportata, idempotency table, DLQ |
| **Esfiltrazione segreti da log** | Critico | PII/secret masking, divieto `console.log` credenziali, Sentry scrubber, test su error paths |
| **Abuso free tier / AI cost spike** | Alto | rate limit, daily cap, anomaly alert, CAPTCHA o friction su pattern bot, kill switch modello costoso |
| **Export codice con segreti inclusi** | Critico | `.env.local` mai pushato, secret scanner prima del push, template `.env.example`, conferma utente |
| **Legal Kit allucinato o incoerente** | Alto | template deterministici, AI solo per variabili/brief, diff review, versioning, disclaimer, human approval |
| **Compromissione dependency npm** | Alto | lockfile, Dependabot/Renovate, npm audit, pin versioni critiche, review aggiornamenti |
| **Outage provider AI o DB** | Medio/Alto | circuit breaker, fallback Gemini, degraded mode, status page, runbook incident |

**Incident Response minimo:**
1. Classificare severità: P0 data breach/segreti, P1 outage core, P2 degradazione feature, P3 bug minore.
2. Nominare Incident Lead.
3. Congelare deploy non essenziali.
4. Preservare log e audit trail.
5. Revocare/ruotare segreti se coinvolti.
6. Comunicare internamente entro 30 minuti per P0/P1.
7. Valutare obblighi GDPR e notifica entro 72 ore se applicabile.
8. Post-mortem entro 5 giorni lavorativi con azioni correttive owner/date.

---

### 6.4 Assumptions Register e Fonte dei Dati

Le assunzioni economiche, normative e di mercato non sono verità permanenti. Ogni assunzione deve avere owner, fonte, data e trigger di revisione.

| Assunzione | Valore corrente | Fonte richiesta | Owner | Revisione | Trigger aggiornamento |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Prezzi modelli AI** | Snapshot Q2 2026 indicato in Sezione 2.2 | Pricing ufficiale provider AI | Engineering/Finance | Mensile | Cambio listino o modello |
| **Costo infra base** | €47/mese | Dashboard Vercel, Supabase, Browserless, Resend, Upstash | Finance/Ops | Mensile | Superamento soglia 20% |
| **Free-to-paid conversion target** | >3% entro 30gg | Lemon Squeezy + analytics cohort | Growth/Finance | Settimanale in beta | 2 settimane sotto target |
| **Activation target** | >40% Step 3 entro 7gg | DB events + analytics first-party | Product | Settimanale | Drop >20% vs media 7gg |
| **TAM/SAM/SOM** | Sezione 1.4 | Fonti pubbliche + research founder | Growth/Founder | Trimestrale | Pitch investor o nuovo ICP |
| **ICP Fase 1** | Builder tech-frustrato | Interviste, waitlist, conversioni canali | Product/Growth | Mensile | Canale con conversione superiore su altro ICP |
| **Legal Kit posture** | Template assistiti | Counsel esterno + feedback utenti | Ops/Legal | Trimestrale | Reclamo, cambio normativo, espansione country |
| **Vendor criticality** | Vedi Vendor Register | SLA, incidenti, DPA, usage | Ops/Engineering | Mensile | Outage, cambio pricing, nuovo dato trattato |

**Regola di aggiornamento:** se un'assunzione critica cambia, il documento deve essere aggiornato prima di prendere decisioni basate su quella sezione.

---

### 6.5 Pre-Release Landing, Waitlist e MVP

La landing page pre-release ha un documento operativo separato e dedicato. Questo Master Spec non contiene il copy definitivo, la direzione grafica completa, i prompt visuali, le scelte di stack specifiche, la SEO dettagliata o la procedura di deploy della landing. Qui restano solo obiettivi, vincoli, metriche e interfacce che il documento landing deve rispettare.

**Documento landing operativo:** `docs/specs/FORGEKO_LANDING_SPEC.md`.

**Contenuto atteso del documento landing separato:**

| Fase | Contenuto richiesto nel documento separato |
| :--- | :--- |
| **FASE 1 — Strategia & Contenuti** | Headline principale, proposta di valore, struttura sezioni, copy per ogni blocco, CTA, social proof placeholder, FAQ e messaggi di rischio basso. |
| **FASE 2 — Design & Grafica** | Palette colori definitiva, tipografia, stile visivo coerente con la logo direction scelta, prompt per immagini/mockup AI, layout sezione per sezione. |
| **FASE 3 — Sviluppo** | Stack consigliato, setup repository, prompt per Cursor/v0.dev o strumenti equivalenti, criteri per codice pulito e production-ready. |
| **FASE 4 — SEO Classico** | Keyword research, meta title, meta description, heading structure, schema markup, Open Graph e performance/Core Web Vitals. |
| **FASE 5 — AI SEO** | Ottimizzazione per citazioni e recupero da ChatGPT, Perplexity, Claude e motori answer-first; entità, definizioni, pagine citabili e struttura semantica. |
| **FASE 6 — Pubblicazione** | Dominio, hosting, deploy, DNS, SSL e procedura passo-passo di rilascio. |
| **FASE 7 — Analytics & Tracking** | Eventi first-party, conversione waitlist, funnel e report di performance. |

**Vincoli che il documento landing deve rispettare:**
*   Parlare all'ICP Fase 1: Builder Tech-Frustrato, non al solopreneur non tecnico generalista.
*   Non promettere compliance garantita o consulenza legale.
*   Presentare il Legal Kit come template assistito e workflow di preparazione, non come sostituto dell'avvocato.
*   Evidenziare Project Memory come moat e valore di lungo periodo.
*   Misurare conversione waitlist, CPE cash, CPE in ore founder e qualified waitlist rate.
*   Includere privacy, cookie, consenso marketing separato e gestione cancellazione dalla mailing list prima della pubblicazione.
*   Non introdurre feature promesse fuori dallo scope MVP.

**MVP scope guardrail:**
L'MVP non deve provare a implementare l'intera visione. Deve validare: Fast Lane, generazione landing Step 3, Project Memory minima, crediti AI, waitlist/beta onboarding, una integrazione pagamento o simulazione controllata, e Legal Kit in modalità template assistito.

**Promemoria operativo:** prima di dichiarare la landing MVP-ready, verificare `docs/specs/FORGEKO_LANDING_SPEC.md`, `docs/DEPLOYMENT.md`, Turnstile, Resend, Supabase `page_events` e Founder Hub con un test live end-to-end.

---

### 6.6 Operations e Supply Chain

**Principio:** Forgeko dipende da provider esterni critici. La gestione vendor non è burocrazia: è continuità operativa, controllo costi, compliance e capacità di risposta a incidenti.

| Vendor | Funzione | Dati trattati | Criticità | Rischio principale | Fallback | Owner | Review |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Vercel** | Hosting, deploy, edge | Log tecnici, request metadata | Alta | Outage deploy/runtime, costo bandwidth | Netlify/Cloudflare Pages per export statico; runbook redeploy | Engineering | Mensile |
| **Supabase** | DB, Auth, Storage, Vault | Dati utenti, project memory, segreti cifrati | Critica | Data leak, outage DB, limiti piano | Backup PITR, export DB, piano migration Postgres | Engineering/Ops | Mensile |
| **Provider AI Anthropic/OpenAI/Google** | Generazione AI | Prompt, project context, output | Alta | Pricing, qualità, outage, data processing | Multi-provider routing, fallback Gemini, cap costi | Engineering | Mensile |
| **Lemon Squeezy** | MoR, billing Forgeko | Billing, email, transazioni | Alta | Webhook failure, payout, tax config errata | Export customer data, provider MoR alternativo | Finance/Ops | Mensile |
| **Stripe** | Pagamenti progetti utenti | OAuth token, account id, eventi pagamento | Alta | Token leak, scope eccessivo, dispute utente | Disconnect, revoke token, manual instructions | Engineering/Ops | Mensile |
| **Resend/ConvertKit** | Email marketing/transactional | Email, lead tags, eventi email | Media | Deliverability, consenso, data transfer | Export CSV, provider alternativo | Growth/Ops | Mensile |
| **Browserless.io** | Rendering preview | HTML/render jobs, screenshot | Media | Quota, privacy output, latency | Playwright self-hosted worker | Engineering | Mensile |
| **Upstash Redis** | Rate limit/cache | User id, counters, metadata | Media | Rate limit failure, cost spike | In-memory fallback degraded, Supabase table counters | Engineering | Mensile |
| **GitHub** | Export codice | OAuth token, repo metadata | Alta | Token scope, repo creation failure | Download zip export, manual push guide | Engineering | Mensile |
| **Monitoring/analytics provider esterno opzionale** | Monitoring/analytics | Eventi, errori, usage | Media | PII leakage, compliance | PII masking, analytics minimali | Engineering/Ops | Mensile |

**Routine operations:**
*   **Daily:** controllare errori P0/P1, costi AI, webhook failure, signup/waitlist, deliverability.
*   **Weekly:** review funnel, ticket utenti, vendor incidents, backlog prodotto, security alerts.
*   **Monthly:** reconciliation billing, vendor cost review, DPA/sub-processor review, backup restore test se applicabile.

**Business continuity minimo:**
*   backup DB automatico e test restore;
*   export periodico Project Memory;
*   runbook per outage AI provider;
*   kill switch per feature costose o instabili;
*   pagina status o comunicazione manuale pronta per beta.

---

### 6.7 Business Development

Il business development deve rimanere leggero ma concreto nella fase iniziale. Non creare canali partner complessi prima di validare activation e retention.

**Target partnership iniziali:**
*   community founder/indie hacker;
*   creator che parlano a developer, PM e solopreneur;
*   agenzie no-code/dev che ricevono richieste troppo piccole per progetti custom;
*   startup studios e micro-acceleratori;
*   legal-tech o consulenti privacy interessati a pacchetti di revisione;
*   template marketplace e directory SaaS.

**Criteri per accettare una partnership:**
*   accesso diretto a ICP Fase 1;
*   costo cash basso o nullo;
*   misurabilità lead/referral;
*   nessun obbligo di feature custom;
*   nessuna promessa legal/compliance oltre la postura template assistiti;
*   tempo founder richiesto inferiore a 5 ore/settimana nel primo mese.

**Offerte BD ammesse in beta:**
*   early access per community selezionata;
*   co-marketing con demo live;
*   codici referral manuali;
*   bundle con revisione legale umana esterna non inclusa nel prezzo Forgeko;
*   case study con beta user.

**Offerte BD vietate prima del product-market signal:**
*   reseller program complesso;
*   revenue share non tracciabile;
*   white-label;
*   enterprise custom;
*   promesse SLA;
*   integrazioni custom per un singolo partner.

**Metriche BD:**
*   partner-sourced waitlist leads;
*   qualified lead rate;
*   activation da partner;
*   conversione paid da partner;
*   tempo founder per lead qualificato;
*   numero partnership che producono almeno 10 lead qualificati/mese.

---

### 6.8 Customer Success e Support

**Obiettivo Customer Success:** portare l'utente al primo valore misurabile, ridurre abbandono pre-attivazione e trasformare feedback qualitativo in miglioramento prodotto.

**Lifecycle utente:**
1. **Signup:** identificare ruolo, obiettivo e modalità preferita (Fast Lane vs Percorso Guidato).
2. **Activation:** Step 3 completato entro 7 giorni; per Fast Lane target <15 minuti.
3. **First Success:** landing pubblicabile o preview condivisibile.
4. **Expansion:** dominio custom, integrazione Stripe, report settimanale, legal kit.
5. **Retention:** Project Memory, report settimanale, snapshot, insight crescita.

**Health Score beta:**

| Segnale | Peso | Interpretazione |
| :--- | :--- | :--- |
| Step 3 completato | +30 | Attivazione primaria |
| Login negli ultimi 7 giorni | +15 | Interesse attivo |
| Progetto con dominio o preview condivisa | +20 | Intenzione di lancio |
| Integrazione configurata | +15 | Investimento operativo |
| Report settimanale aperto | +10 | Engagement |
| Ticket critico aperto | -20 | Rischio churn |
| Nessun login 14 giorni | -25 | Dormienza |

**Support policy iniziale:**
*   Free: community/forum o email best-effort.
*   Founder: email entro 48h lavorative.
*   Pro: priority email/chat entro 24h lavorative.
*   Beta chiusa: founder-led support, ma ogni richiesta deve diventare issue/tag feedback.

**Feedback loop:**
*   intervista 20 minuti con ogni beta user che completa Step 3;
*   survey cancellazione obbligatoria prima del downgrade;
*   tag feature request: `activation`, `legal`, `export`, `integration`, `ai_quality`, `pricing`, `bug`;
*   review settimanale top 5 blocchi utenti.

---

### 6.9 Product Management

**Principio:** la roadmap deve essere guidata da activation, retention, costi AI e rischio legale, non dal numero di feature generate.

**Framework prioritizzazione:** RICE modificato con risk adjustment.

```
Priority Score = (Reach × Impact × Confidence) / Effort - RiskPenalty
```

| Fattore | Definizione |
| :--- | :--- |
| **Reach** | Quanti utenti o lead qualificati tocca nel ciclo corrente |
| **Impact** | Effetto atteso su activation, conversione, retention o rischio |
| **Confidence** | Evidenza da dati, interviste o pattern ripetuti |
| **Effort** | Complessità engineering/design/legal |
| **RiskPenalty** | Penalità per rischio security, legal, vendor lock-in o costo AI |

**Gates prodotto:**
*   Nessuna feature nuova se non è collegata a una metrica o rischio del documento.
*   Nessuna integrazione nuova senza vendor register e data mapping.
*   Nessuna promessa marketing prima di verifica tecnica e legal copy review.
*   Nessun cambio onboarding senza misurazione activation prima/dopo.

**Roadmap hygiene:**
*   backlog diviso in `must`, `should`, `could`, `won't now`;
*   ogni item deve avere owner, metrica collegata e criterio di accettazione;
*   decisioni di taglio sono documentate quanto le decisioni di costruzione;
*   changelog utente separa bugfix, miglioramenti, nuove feature e breaking changes.

---

## 🔧 APPENDICI TECNICHE

### Appendice A: Prompt Contract per Agenti AI

La landing page dello Step 3 viene generata in modo sequenziale per componente. Ogni chiamata produce un solo file, salva il risultato in `project_files` e passa i file precedenti come contesto strutturato alla chiamata successiva. Questo contratto elimina output troncati e mantiene coerenza visiva tra sezioni.

#### Variabili Formali del Prompt Contract

| Variabile | Tipo | Obbligatoria | Descrizione |
| :--- | :--- | :--- | :--- |
| `{{validation_brief_md}}` | Markdown | No per Fast Lane, sì per percorso guidato | Brief validato nello Step 1. Se assente in Fast Lane, usare stringa vuota e dichiarare assunzioni nel meta-prompt. |
| `{{strategic_canvas_json}}` | JSON | Sì | Canvas strategico approvato o generato dal wizard Fast Lane con `source: "fast_lane"`. |
| `{{brand_guidelines_json}}` | JSON | Sì dallo Step 4, opzionale nello Step 3 iniziale | Palette, font, tono e vincoli di brand. Se assente, l'Archivista deve generare assunzioni conservative. |
| `{{is_fast_lane}}` | Boolean | Sì | `true` se il progetto ha bypassato Step 1-2. |
| `{{current_step}}` | Integer | Sì | Step operativo corrente. Per questa appendice il valore atteso è `3`. |
| `{{component_name}}` | String | Sì | Uno tra `hero`, `features`, `pricing`, `cta`, `page`. |
| `{{archive_meta_prompt_yaml}}` | YAML | Sì per Agente Esecutore | Output dell'Agente Archivista. |
| `{{hero_tsx}}` | TypeScript TSX | Sì da Features in avanti | Codice completo di `components/Hero.tsx`. |
| `{{features_tsx}}` | TypeScript TSX | Sì da Pricing in avanti | Codice completo di `components/Features.tsx`. |
| `{{pricing_tsx}}` | TypeScript TSX | Sì da CTA in avanti | Codice completo di `components/Pricing.tsx`. |
| `{{cta_tsx}}` | TypeScript TSX | Sì per `app/page.tsx` | Codice completo di `components/CTA.tsx`. |

#### Agente Archivista (Gemini 3.1 Pro) — Generazione Meta-Prompt

```text
Sei un archivista specializzato nel sintetizzare documenti di progetto
per un sistema operativo per solopreneur.

DOCUMENTI DEL PROGETTO:
--- validation_brief.md ---
{{validation_brief_md}}

--- strategic_canvas.json ---
{{strategic_canvas_json}}

--- brand_guidelines.json ---
{{brand_guidelines_json}}

FLAG CONTESTO:
- Fast Lane: {{is_fast_lane}}
- Step corrente: {{current_step}}
- Componente da generare: {{component_name}}

TUO COMPITO:
Genera un Meta-Prompt sintetico, massimo 1000 token, per l'Agente Esecutore.
Includi SOLO:
1. core_value_proposition: una frase chiara e non generica
2. target_audience: una frase con ruolo, bisogno e livello tecnico
3. pricing: una frase se disponibile, altrimenti "non_disponibile"
4. brand_colors_hex: lista di colori HEX con ruolo semantico
5. tone_of_voice: 2-3 aggettivi
6. key_features: massimo 3 bullet rilevanti per {{component_name}}
7. assumptions: lista di assunzioni inferite, obbligatoria se {{is_fast_lane}} è true

FORMATO OUTPUT:
Oggetto YAML strutturato con chiavi:
core_value_proposition, target_audience, pricing, brand_colors_hex,
tone_of_voice, key_features, assumptions.

NON includere dettagli tecnici non rilevanti, cronologia conversazioni,
informazioni ridondanti o testo fuori dallo YAML.
```

#### Agente Esecutore (Claude Opus 4.8) — `components/Hero.tsx`

```text
Sei un esperto sviluppatore frontend specializzato in landing page
ad alta conversione per SaaS B2B.

CONTESTO DEL PROGETTO:
{{archive_meta_prompt_yaml}}

COMPONENTE DA GENERARE:
Hero Section

ISTRUZIONI:
1. Genera solo `components/Hero.tsx`.
2. Usa solo i colori brand indicati nel meta-prompt.
3. Struttura obbligatoria: headline principale, sub-headline, CTA primaria,
   CTA secondaria, social proof testuale.
4. Se serve un'immagine, usa `https://placehold.co/1200x800` con alt text descrittivo.
5. Implementa mobile-first con Tailwind CSS.
6. Usa HTML semantico, contrasto WCAG AA e label accessibili per i link.
7. Non introdurre dipendenze esterne oltre a Next.js, React e Tailwind.
8. Non usare lorem ipsum; ogni testo deve derivare dal meta-prompt.

OUTPUT:
Codice TypeScript completo per `components/Hero.tsx`.
Rispondi solo con codice, senza spiegazioni.
```

#### Agente Esecutore — `components/Features.tsx`

```text
Sei un esperto sviluppatore frontend specializzato in landing page
ad alta conversione per SaaS B2B.

CONTESTO DEL PROGETTO:
{{archive_meta_prompt_yaml}}

CONTESTO COMPONENTE PRECEDENTE:
--- components/Hero.tsx ---
{{hero_tsx}}

COMPONENTE DA GENERARE:
Features Section

ISTRUZIONI:
1. Genera solo `components/Features.tsx`.
2. Mantieni coerenza visiva con Hero: palette, ritmo verticale, radius,
   densità informativa e tono dei microcopy.
3. Struttura obbligatoria: titolo sezione, testo introduttivo breve,
   da 3 a 6 feature card con icona testuale o simbolo semplice, titolo e descrizione.
4. Ogni feature deve mappare una voce di `key_features` o una conseguenza diretta
   della value proposition.
5. Implementa mobile-first con griglia responsive.
6. Usa HTML semantico e contrasto WCAG AA.
7. Non introdurre dipendenze esterne oltre a Next.js, React e Tailwind.

OUTPUT:
Codice TypeScript completo per `components/Features.tsx`.
Rispondi solo con codice, senza spiegazioni.
```

#### Agente Esecutore — `components/Pricing.tsx`

```text
Sei un esperto sviluppatore frontend specializzato in pricing section
per SaaS B2B ad alta conversione.

CONTESTO DEL PROGETTO:
{{archive_meta_prompt_yaml}}

CONTESTO COMPONENTI PRECEDENTI:
--- components/Hero.tsx ---
{{hero_tsx}}

--- components/Features.tsx ---
{{features_tsx}}

COMPONENTE DA GENERARE:
Pricing Section

ISTRUZIONI:
1. Genera solo `components/Pricing.tsx`.
2. Se il meta-prompt contiene pricing esplicito, usalo fedelmente.
3. Se il pricing è `non_disponibile`, mostra una sezione "Early access" con CTA
   di raccolta email, senza inventare prezzi.
4. Struttura obbligatoria per pricing disponibile: titolo sezione, massimo 3 piani,
   prezzo, descrizione breve, 3-5 benefit per piano, CTA per piano.
5. Evidenzia un solo piano raccomandato.
6. Mantieni coerenza visiva con Hero e Features.
7. Implementa mobile-first e stati hover/focus accessibili.
8. Non introdurre dipendenze esterne oltre a Next.js, React e Tailwind.

OUTPUT:
Codice TypeScript completo per `components/Pricing.tsx`.
Rispondi solo con codice, senza spiegazioni.
```

#### Agente Esecutore — `components/CTA.tsx`

```text
Sei un esperto sviluppatore frontend specializzato in conversion copy
per landing page SaaS B2B.

CONTESTO DEL PROGETTO:
{{archive_meta_prompt_yaml}}

CONTESTO COMPONENTI PRECEDENTI:
--- components/Hero.tsx ---
{{hero_tsx}}

--- components/Features.tsx ---
{{features_tsx}}

--- components/Pricing.tsx ---
{{pricing_tsx}}

COMPONENTE DA GENERARE:
Final CTA Section

ISTRUZIONI:
1. Genera solo `components/CTA.tsx`.
2. La sezione deve chiudere la pagina con una proposta concreta, non generica.
3. Struttura obbligatoria: headline breve, frase di rinforzo, CTA primaria,
   nota di riduzione rischio se coerente con il meta-prompt.
4. Non ripetere letteralmente la headline del Hero.
5. Mantieni coerenza visiva con i componenti precedenti.
6. Implementa mobile-first, focus states e contrasto WCAG AA.
7. Non introdurre dipendenze esterne oltre a Next.js, React e Tailwind.

OUTPUT:
Codice TypeScript completo per `components/CTA.tsx`.
Rispondi solo con codice, senza spiegazioni.
```

#### Agente Esecutore — `app/page.tsx`

```text
Sei un esperto sviluppatore Next.js specializzato in composizione
di landing page production-ready.

CONTESTO DEL PROGETTO:
{{archive_meta_prompt_yaml}}

COMPONENTI GENERATI:
--- components/Hero.tsx ---
{{hero_tsx}}

--- components/Features.tsx ---
{{features_tsx}}

--- components/Pricing.tsx ---
{{pricing_tsx}}

--- components/CTA.tsx ---
{{cta_tsx}}

COMPONENTE DA GENERARE:
Next.js Page Composition

ISTRUZIONI:
1. Genera solo `app/page.tsx`.
2. Importa `Hero`, `Features`, `Pricing` e `CTA` dai rispettivi file in `components`.
3. Componi la pagina in questo ordine: Hero, Features, Pricing, CTA.
4. Usa un elemento `main` unico.
5. Non duplicare markup già presente nei componenti.
6. Non introdurre dipendenze esterne oltre a Next.js, React e Tailwind.
7. Il file deve compilare in un progetto Next.js App Router.

OUTPUT:
Codice TypeScript completo per `app/page.tsx`.
Rispondi solo con codice, senza spiegazioni.
```

---

### Appendice B: Configurazione Supabase Vault (Setup Iniziale)

```sql
-- 1. Abilita estensione pgsodium
CREATE EXTENSION IF NOT EXISTS pgsodium;

-- 2. Crea chiave master specifica per Forgeko
SELECT pgsodium.create_key(
  name := 'forgeko_integrations_key',
  key_type := 'aes256'
);

-- 3. Funzione helper per cifratura
CREATE OR REPLACE FUNCTION vault_encrypt(plaintext TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgsodium.crypto_aead_det_encrypt(
    plaintext,
    NULL,
    (SELECT key_id FROM pgsodium.key WHERE name = 'forgeko_integrations_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Funzione helper per decifratura
CREATE OR REPLACE FUNCTION vault_decrypt(ciphertext TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgsodium.crypto_aead_det_decrypt(
    ciphertext,
    NULL,
    (SELECT key_id FROM pgsodium.key WHERE name = 'forgeko_integrations_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Test
-- Inserimento
INSERT INTO integrations (project_id, service_name, encrypted_credentials)
VALUES ('uuid-progetto', 'stripe', vault_encrypt('sk_live_51H...'));

-- Recupero
SELECT service_name, vault_decrypt(encrypted_credentials) AS api_key
FROM integrations
WHERE project_id = 'uuid-progetto';
```

---

### Appendice C: Checklist Pre-Deploy (Production Readiness)

#### Infrastruttura
- [ ] Vercel: Environment variables configurate (production)
- [ ] Supabase: RLS policies applicate su **tutte** le tabelle (verificare con `SELECT * FROM pg_policies`)
- [ ] Supabase: Vault configurato e testato (encrypt + decrypt round-trip)
- [ ] Supabase: Backup automatici abilitati (daily + PITR)
- [ ] Redis (Upstash): Rate limits configurati e testati per tutti e 3 i piani
- [ ] Browserless.io: API key configurata, quota monitorata, fallback se quota esaurita
- [ ] Domains: SSL certificates validi, DNS puntati correttamente, `.forgeko.app` wildcard configurato

#### Sicurezza
- [ ] Tutti gli endpoint API hanno autenticazione (JWT Supabase o API key)
- [ ] Input sanitization attiva su tutti i form (PII redaction + injection prevention)
- [ ] CORS configurato (whitelist domini, nessun wildcard in produzione)
- [ ] CSP headers configurati (Content Security Policy)
- [ ] `npm audit` pulito, nessuna vulnerabilità HIGH o CRITICAL
- [ ] Sentry configurato per error tracking **con PII masking attivo**
- [ ] Nessun segreto (API keys, password) nei log applicativi

#### AI Engine
- [ ] Circuit breaker testato (simulare outage Anthropic con mock)
- [ ] Fallback Gemini testato e qualità output verificata
- [ ] Rate limits per-utente funzionanti (testare tutti e 3 i piani)
- [ ] Credit deduction testato (edge cases: balance insufficiente, richieste concorrenti)
- [ ] Fast Lane: flag `source: fast_lane` correttamente riconosciuto dall'Archivista
- [ ] Dashboard costi AI attiva, alert configurati (>€50/giorno → Slack)

#### Onboarding
- [ ] Fast Lane: wizard 3 domande testato, `strategic_canvas.json` generato correttamente
- [ ] Percorso Guidato: blocco Step 2→3 senza validation_brief verificato
- [ ] Transizione Fast Lane → Percorso Guidato testata (completamento Step 1-2 dopo Fast Lane)
- [ ] Project Memory Timeline visibile e aggiornata in real-time

#### Integrazioni
- [ ] Stripe OAuth flow testato (connect, use, disconnect, reconnect)
- [ ] Lemon Squeezy webhook testati (tutti gli eventi critici)
- [ ] GitHub OAuth testato (scope corretto, nuovo repo creato correttamente)
- [ ] Golden Master Repository aggiornato alla versione Next.js corrente
- [ ] Health checks per tutte le integrazioni attivi e funzionanti

#### Legal & Compliance
- [ ] Privacy Policy pubblicata e linkata nel footer
- [ ] Terms of Service pubblicati e linkati nel footer
- [ ] Cookie Policy pubblicata + banner CMP attivo (opt-in granulare)
- [ ] DPA disponibile per download su `/legal/dpa`
- [ ] Sub-processor list aggiornata e pubblica
- [ ] Legal Kit: clickwrap loggato (timestamp + IP + versione disclaimer)
- [ ] Legal Kit: Master Template firmati da avvocato con data di revisione
- [ ] Legal Kit: disclaimer prominente in ogni documento generato

#### Performance
- [ ] Lighthouse score >90 (Performance, Accessibility, SEO, Best Practices)
- [ ] P95 latency Step 3 per-componente <10s (testato con carico realistico)
- [ ] next/image configurato, formati WebP/AVIF attivi
- [ ] Bundle size: code splitting attivo, tree shaking verificato
- [ ] Database: indici creati, `EXPLAIN ANALYZE` su tutte le query critiche

#### Monitoring & Alerting
- [ ] Uptime monitoring attivo (UptimeRobot o Better Stack, check ogni minuto)
- [ ] Error rate alerting (Sentry → Slack per errori nuovi o spike)
- [ ] Cost alerting AI (>€50/giorno → Slack immediato)
- [ ] Conversion rate alerting (drop >20% vs media 7gg → Slack)
- [ ] Dashboard KPI (Metabase/Grafana) accessibile ai fondatori

#### User Experience
- [ ] Onboarding flow testato con 5 utenti reali (sia Fast Lane che Guidato)
- [ ] Error messages: chiari, actionabili, in linguaggio non tecnico
- [ ] Loading states: skeleton loaders e progress indicator durante generazione AI
- [ ] Empty states: messaggi utili quando nessun dato disponibile
- [ ] Mobile responsiveness testata su iOS (Safari) + Android (Chrome)
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge

---

## CRITERI DI ACCETTAZIONE TRASVERSALI

Questi criteri definiscono quando una macro-area può essere considerata implementata in modo conforme alla presente specifica.

| Macro-area | Criterio di accettazione |
| :--- | :--- |
| **Business e ICP** | Il prodotto, la landing pubblica e l'onboarding distinguono chiaramente ICP Fase 1 e ICP Fase 2; il lancio iniziale parla solo al Builder Tech-Frustrato. |
| **Pricing e monetizzazione** | Free, Founder e Pro sono configurati con limiti, crediti, cicli mensili/annuali e regole di reset coerenti con la Sezione 2.1. |
| **Crediti AI e cost control** | Ogni operazione AI scala crediti prima dell'esecuzione, registra costo reale in `ai_generations`, applica rate limit e blocca richieste oltre budget. |
| **AI Engine** | Archivista, Esecutore, routing Opus/Gemini, circuit breaker, fallback e code asincrone sono testati con successo, inclusi errori provider e retry idempotenti. |
| **Workflow 8 Step + Fast Lane** | Percorso Guidato blocca correttamente Step successivi senza Document-State approvati; Fast Lane consente Step 3 con `source: "fast_lane"` e permette il completamento retroattivo di Step 1-2. |
| **Project Memory** | Timeline, snapshot, Document-State approvati e analytics rilevanti sono consultabili per progetto e non dipendono da memoria conversazionale non persistente. |
| **Database e RLS** | Tutte le tabelle multi-tenant hanno RLS attiva, policy testate per isolamento cross-workspace e indici per query critiche documentate con `EXPLAIN ANALYZE`. |
| **Sicurezza e segreti** | Nessun segreto è esposto in client, log o export; credenziali integrazioni sono cifrate con Vault; CORS, CSP, PII masking e audit base sono attivi. |
| **Legal e compliance** | Privacy, ToS, Cookie Policy, DPA, Sub-processor List, clickwrap Legal Kit e disclaimer generati sono pubblicati, versionati e verificabili. |
| **GTM e retention** | Playbook 30 giorni, tracking ore founder, funnel email, report settimanale e anti-churn loops sono configurati con metriche misurabili. |
| **Monitoring** | Uptime, Sentry, cost alerting AI, webhook failure rate, conversion drop e dashboard KPI generano alert sui canali operativi definiti. |
| **Roadmap e beta readiness** | La Beta chiusa parte solo dopo checklist pre-deploy completata, 10 beta user arruolati e metriche di successo beta tracciate dalla prima sessione. |
| **Governance e operations** | Owner, cadence, decision log, RACI minimale e vendor review sono attivi prima della beta chiusa. |
| **Legal risk management** | Ogni claim legal/compliance pubblicato rispetta la postura "template assistiti" e passa review rispetto al Legal Risk Register. |
| **Threat model** | Le minacce prioritarie hanno controlli implementati o issue bloccanti prima del deploy pubblico. |
| **Assumptions management** | Prezzi AI, costi vendor, conversioni, ICP e legal posture hanno owner, fonte e trigger di revisione aggiornati. |
| **Pre-release landing/waitlist** | La landing non va live finché `docs/specs/FORGEKO_LANDING_SPEC.md` non è completo, approvato e coerente con ICP, legal posture, analytics e MVP guardrail di questo Master Spec. |
| **Business development** | Ogni partnership beta è tracciata con lead source, costo tempo founder e conversione verso waitlist qualificata. |
| **Customer success** | Ogni beta user ha stato activation, health score minimo, feedback taggato e follow-up definito. |
| **Product management** | Ogni feature in roadmap ha metrica collegata, owner, criterio di accettazione e risk penalty quando applicabile. |

---

## CONCLUSIONE E PROSSIMI PASSI

Questo documento rappresenta la **specifica completa e vincolante v1.4** per lo sviluppo di Forgeko. Ogni decisione architetturale, strategica e legale è documentata con razionale tecnico e implementazione concreta.

### Principi Guida (Non Negoziabili)

1. **Data Over Opinions:** Le decisioni sono guidate da Kill Metrics e KPI, non da opinioni dei fondatori.
2. **Security by Default:** RLS, Vault, credenziali cifrate, auditabilità e isolamento multi-tenant non sono optional. Sono requisiti minimi non derogabili.
3. **Sustainability First:** Unit Economics diretti devono essere positivi prima di scalare.
4. **User Trust:** Legal Kit con disclaimer trasparenti, Export Codice, Project Memory esportabile. Nessun lock-in artificiale.
5. **Iteration Speed:** Architettura modulare (Document-State, Multi-Agente, Fast Lane) permette iterazioni rapide senza refactor massivi.
6. **ICP Clarity:** Non mischiare messaggi per ICP Fase 1 e Fase 2 nello stesso canale o nello stesso copy.

---

### Roadmap di Sviluppo (Prime 12 Settimane)

**Settimane 1-2: Foundation**
- Setup repo GitHub, CI/CD (Vercel), Supabase project
- Schema DB completo + RLS policies (incluso campo `billing_cycle`, `onboarding_mode`, `metadata` su documents)
- Autenticazione (Supabase Auth: email magic link + Google OAuth)
- Landing page di attesa con form email (pre-build validation)

**Settimane 3-4: Core AI Engine**
- AI Engine con routing Opus/Gemini + Circuit Breaker
- Sistema crediti + logging costi (tabella `ai_generations`)
- Agente Archivista + Agente Esecutore (PoC su Step 3, singolo componente)
- Fast Lane wizard (3 domande → `strategic_canvas.json` con flag `source: fast_lane`)

**Settimane 5-6: Dipartimento 1-2**
- Step 1: Validazione Idea (UI + AI integration)
- Step 2: Dashboard Strategica (Lean Canvas)
- Step 3: Generazione Landing Page per componente + Browserless integration
- Step 4: Brand Identity + iniezione CSS retroattiva

**Settimane 7-8: Dipartimento 3**
- Step 5: Generatore Funzionalità
- Step 6: Integrazione Backend (Stripe OAuth + Supabase Vault)
- Sistema Snapshots + Project Memory Timeline (UI sidebar)

**Settimane 9-10: Dipartimento 4**
- Step 7: Test & Ottimizzazione (Audit)
- Step 8: Dashboard Crescita + Legal Kit Dinamico
- First-party analytics integration
- Report Settimanale AI (cron job + template email)

**Settimane 11-12: Polish + Beta Launch**
- User testing con 10 beta user (5 Fast Lane, 5 Percorso Guidato)
- Bug fixing + performance optimization
- Setup Lemon Squeezy (MoR) con piani mensili e annuali
- Documentazione utente (FAQ, tutorial video)
- **Beta Launch (Chiusa)**

### Metriche di Successo Beta (Settimana 12)

| Metrica | Target Beta | Target Public Launch |
| :--- | :--- | :--- |
| **Activation Rate** | >40% (Step 3 entro 7gg) | >50% |
| **Time-to-Value (Fast Lane)** | <15 min | <10 min |
| **Time-to-Value (Guidato)** | <45 min | <30 min |
| **NPS** | >40 | >50 |
| **Bug Critici per Utente** | <2 | <1 |
| **Costo AI/MAU** | <€2 | <€1.50 |

Se le metriche Beta sono raggiunte → **Public Launch (Settimane 13-16)**. Se no → 4 settimane aggiuntive di iterazione prima del lancio pubblico.

---

## 📝 NOTE FINALI PER IL TEAM

**Per gli Sviluppatori:**
- Questo documento è la vostra bibbia. Ambiguità → Issue su GitHub + tag CTO.
- Ogni PR deve referenziare una sezione specifica (es. "Implements Section 4.3 RLS Policies").
- Non introducete dipendenze o pattern non documentati senza Amendment formale.
- La Fast Lane e la Project Memory Timeline sono feature core, non nice-to-have. Vanno sviluppate nelle prime 8 settimane.

**Per i Designer:**
- L'UX deve riflettere la dualità Fast Lane / Percorso Guidato fin dall'onboarding.
- La Project Memory Timeline è una feature di design critica: deve essere visibile, chiara, navigabile.
- Progress indicators chiari in ogni step. L'utente deve sempre sapere dove si trova e cosa manca.
- Empty states e error states ricevono la stessa cura degli happy path.

**Per il Growth/Marketing:**
- Il messaging per il lancio parla all'ICP Fase 1 (developer/PM tech-adjacent). Non al solopreneur non tecnico.
- Il copy principale enfatizza "Sistema Operativo" e "Project Memory", non "AI Website Builder".
- Le Kill Metrics (Sezione 1.5) sono il vostro north star. Se non le raggiungiamo, pivotiamo.
- Tracciare le ore founder spese per email raccolta dal Giorno 1. Non lasciare questa metrica al caso.

**Per i Fondatori:**
- Review settimanale di questo documento. È vivo, evolve con il prodotto.
- Nessuna feature nuova senza valutare l'impatto su Unit Economics (Sezione 2.2) e Kill Metrics (Sezione 1.5).
- La disciplina sui kill metrics è non-negoziabile. I dati comandano, non l'ego.
- Il conflitto ICP/GTM è stato risolto in questo documento. Non tornare indietro su questa decisione senza dati concreti che la contraddicano.

---

**[FINE DEL DOCUMENTO MASTER]**

```yaml
versione: 1.4.0
status: APPROVATO - READY FOR DEVELOPMENT
changelog:
  v1.1:
    - ICP biforcato Fase1/Fase2
    - Fast Lane onboarding
    - Project Memory come moat primario
    - Watermark visibile rimosso
    - Piani annuali aggiunti
    - Kill Metric CAC aggiunta
    - Step 3 generazione per componente
  v1.2:
    - Documento consolidato in file unico integrale
    - Rimossi header intermedi, istruzioni di unione e metadati da blocchi separati
    - Aggiunto Contratto di Completezza
    - Formalizzate variabili prompt con sintassi {{variable_name}}
    - Completata Appendice A con prompt Hero, Features, Pricing, CTA e app/page.tsx
    - Aggiunti criteri di accettazione trasversali per macro-area
    - Footer normalizzato con campi amministrativi espliciti
  v1.3:
    - Aggiunta Parte 6 per governance, operations, legal risk, threat model, assumptions, pre-release, BD, CS e product management
    - Corretta terminologia security da Zero-Knowledge a encrypted credentials con decifratura server-side just-in-time
    - Aggiunto Legal Risk Register UE/Italia-first e postura Legal Kit come template assistiti
    - Aggiunto Threat Model IT & Security con asset, attori, minacce e incident response
    - Aggiunto Assumptions Register con owner, fonti e trigger di revisione
    - Aggiunta struttura pre-release landing/waitlist/MVP con campi da completare tramite input founder
    - Aggiunto Vendor Register operativo e routine operations/supply chain
    - Aggiunte sezioni Business Development, Customer Success e Product Management
  v1.4:
    - Chiarito che la landing pre-release avrà un documento operativo separato
    - Sostituiti i campi landing da completare nel Master Spec con vincoli, fasi e interfacce verso il documento landing operativo
    - Aggiornato criterio di accettazione landing/waitlist
decisioni_vigenti:
  - ICP biforcato Fase1/Fase2
  - Fast Lane onboarding
  - Project Memory come moat primario
  - Watermark visibile rimosso
  - Piani annuali aggiunti
  - Kill Metric CAC aggiunta
  - Step 3 generazione per componente
  - Legal Kit in postura template assistiti
  - Operating model solo founder verso mini-team
  - Pre-release landing governata da documento separato `docs/specs/FORGEKO_LANDING_SPEC.md`
prossima_revisione: 16 Settembre 2026 (o dopo pivot validato)
approvato_da: DA COMPILARE PRIMA DELL'APPROVAZIONE FINALE
data_approvazione: 16 Giugno 2026
documento_unico_integrale: true
```


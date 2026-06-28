import type { AnalyticsSnapshot, CommunityItem, FounderHubSnapshot, NewsItem, PostDraft } from "@/types/founder-hub";

const emptyValue = "Not available";

export function buildFounderHubMarkdown(snapshot: FounderHubSnapshot, generatedAt = new Date().toISOString()) {
  const sections = [
    "# Forgeko Founder Hub Export",
    `Generated: ${generatedAt}`,
    buildSummary(snapshot),
    buildPostDraftSection(snapshot.postDrafts),
    buildVideoIdeaSection(snapshot.videoIdeas ?? []),
    buildNewsSection(snapshot.newsItems),
    buildAnalyticsSection(snapshot.analytics),
    buildRedditSection(snapshot.communityItems.filter((item) => item.source === "reddit"))
  ];

  return `${sections.join("\n\n").trim()}\n`;
}

export function founderHubExportFileName(generatedAt = new Date().toISOString()) {
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  return `forgeko-founder-hub-export-${timestamp}.md`;
}

function buildSummary(snapshot: FounderHubSnapshot) {
  return [
    "## Snapshot Summary",
    table(
      ["Data Set", "Rows"],
      [
        ["Post drafts", snapshot.postDrafts.length],
        ["Video ideas", snapshot.videoIdeas?.length ?? 0],
        ["News items", snapshot.newsItems.length],
        ["Reddit items", snapshot.communityItems.filter((item) => item.source === "reddit").length],
        ["Analytics trend rows", snapshot.analytics.trend.length]
      ]
    )
  ].join("\n\n");
}

function buildVideoIdeaSection(ideas: NonNullable<FounderHubSnapshot["videoIdeas"]>) {
  return [
    "## Video Ideas",
    ideas.length ? ideas.map((idea) => [
      `### ${heading(idea.title)}`,
      table(
        ["Field", "Value"],
        [
          ["Channel", idea.channel],
          ["Target audience", idea.targetAudience],
          ["Created at", idea.createdAt],
          ["Source IDs", idea.sourceIds.join(", ")]
        ]
      ),
      "#### Hook",
      prose(idea.hook),
      "#### Outline",
      bulletList(idea.outline),
      "#### Rationale",
      prose(idea.rationale)
    ].join("\n\n")).join("\n\n") : "_No video ideas available._"
  ].join("\n\n");
}

function buildPostDraftSection(drafts: PostDraft[]) {
  return [
    "## Daily Post Drafts",
    drafts.length ? drafts.map(buildPostDraft).join("\n\n") : "_No post drafts available._"
  ].join("\n\n");
}

function buildPostDraft(draft: PostDraft) {
  return [
    `### ${heading(draft.title)}`,
    table(
      ["Field", "Value"],
      [
        ["Channel", draft.channel],
        ["Created at", draft.createdAt],
        ["Source IDs", draft.sourceIds.join(", ")]
      ]
    ),
    "#### Draft",
    prose(draft.body),
    "#### Rationale",
    prose(draft.rationale)
  ].join("\n\n");
}

function buildNewsSection(items: NewsItem[]) {
  return [
    "## News Sources",
    items.length ? items.map(buildNewsItem).join("\n\n") : "_No news sources available._"
  ].join("\n\n");
}

function buildNewsItem(item: NewsItem) {
  return [
    `### ${heading(item.title)}`,
    table(
      ["Field", "Value"],
      [
        ["Source", item.source],
        ["Topic", item.topic],
        ["Score", item.score],
        ["URL", item.url],
        ["Published at", item.publishedAt]
      ]
    ),
    "#### Summary",
    prose(item.summary)
  ].join("\n\n");
}

function buildAnalyticsSection(analytics: AnalyticsSnapshot) {
  return [
    "## Analytics",
    table(
      ["Metric", "Value"],
      [
        ["Active users", analytics.activeUsers],
        ["Visitors", analytics.visitors],
        ["Unique visitors", analytics.uniqueVisitors],
        ["Waitlist clicks", analytics.waitlistClicks],
        ["Waitlist submits", analytics.waitlistSubmits],
        ["Waitlist signups", analytics.waitlistSignups],
        ["Waitlist confirmed", analytics.waitlistConfirmed],
        ["Visit-to-signup rate", percentOrUnavailable(analytics.waitlistConversionRate)],
        ["Click-to-signup rate", percentOrUnavailable(analytics.clickToSignupRate)]
      ]
    ),
    "### AI Explanation",
    prose(analytics.aiExplanation),
    "### Top Referrers",
    tableOrEmpty(["Source", "Visitors"], analytics.topReferrers.map((row) => [row.source, row.visitors])),
    "### Top Pages",
    tableOrEmpty(["Path", "Visitors"], analytics.topPages.map((row) => [row.path, row.visitors])),
    "### Top Clicks",
    tableOrEmpty(["Label", "Href", "Clicks"], analytics.topClicks.map((row) => [row.label, row.href, row.clicks])),
    "### Waitlist Sources",
    tableOrEmpty(["Source", "Signups"], analytics.waitlistSources.map((row) => [row.source, row.signups])),
    "### First-party Events",
    tableOrEmpty(["Event Type", "Count"], analytics.pageEvents.map((row) => [row.eventType, row.count])),
    "### Trend",
    tableOrEmpty(["Date", "Visitors"], analytics.trend.map((row) => [row.date, row.visitors]))
  ].join("\n\n");
}

function buildRedditSection(items: CommunityItem[]) {
  return [
    "## Reddit Pain Points",
    items.length ? items.map(buildRedditItem).join("\n\n") : "_No Reddit pain points available._"
  ].join("\n\n");
}

function buildRedditItem(item: CommunityItem) {
  return [
    `### ${heading(item.title)}`,
    table(
      ["Field", "Value"],
      [
        ["ID", item.id],
        ["Subreddit", item.subreddit ?? "unknown"],
        ["Kind", item.kind ?? "post"],
        ["Author", item.author],
        ["URL", item.url],
        ["Created at", item.createdAt],
        ["Relevance score", item.relevanceScore],
        ["Pain point", item.painPoint]
      ]
    ),
    "#### Summary",
    prose(item.summary),
    "#### User Language",
    bulletList(item.userLanguage),
    "#### Suggested Reply",
    prose(item.suggestedReply),
    "#### Reply Rationale",
    prose(item.replyRationale)
  ].join("\n\n");
}

function tableOrEmpty(headers: string[], rows: Array<Array<string | number>>) {
  return rows.length ? table(headers, rows) : "_No rows available._";
}

function table(headers: string[], rows: Array<Array<string | number>>) {
  const header = `| ${headers.map(tableCell).join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(tableCell).join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

function bulletList(items: string[]) {
  return items.length ? items.map((item) => `- ${inline(item)}`).join("\n") : "_No rows available._";
}

function prose(value: string) {
  return normalize(value);
}

function heading(value: string) {
  return inline(value);
}

function inline(value: string | number) {
  return normalize(String(value)).replace(/\s+/g, " ");
}

function tableCell(value: string | number) {
  return inline(value).replace(/\|/g, "\\|") || emptyValue;
}

function normalize(value: string) {
  return value.trim() || emptyValue;
}

function percentOrUnavailable(value: number | null) {
  return typeof value === "number" ? `${value}%` : "n/a";
}

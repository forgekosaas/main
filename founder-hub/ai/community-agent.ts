import { communityPrompt } from "@/prompts/community";
import { draftReplyForPainPoint, normalizeCommunityCopy, normalizeSuggestedReply, postAngleForPainPoint } from "@/lib/community-copy";
import { clampScore } from "@/lib/safety";
import type { AnalysisClient } from "@/ai/client";
import type { CommunityItem, ManualCommunityInput, RawCommunityItem } from "@/types/founder-hub";

interface CommunityAnalysis {
  summary: string;
  painPoint: string;
  userLanguage: string[];
  postAngle: string;
  relevanceScore: number;
  suggestedReply: string;
  replyRationale: string;
}

export async function analyzeCommunityItem(
  item: RawCommunityItem,
  client?: AnalysisClient
): Promise<CommunityItem> {
  const analysis = client ? await safeCommunityAnalysis(item, client) : heuristicCommunityAnalysis(item);

  return normalizeCommunityCopy({
    id: item.id,
    source: item.source,
    title: item.title,
    author: item.author,
    url: item.url,
    summary: analysis.summary,
    painPoint: analysis.painPoint,
    userLanguage: normalizeUserLanguage(analysis.userLanguage, item),
    postAngle: analysis.postAngle || postAngleForPainPoint(analysis.painPoint, item.title),
    relevanceScore: clampScore(analysis.relevanceScore),
    suggestedReply: normalizeSuggestedReply(analysis.suggestedReply, analysis.painPoint, item.title),
    replyRationale: analysis.replyRationale,
    createdAt: item.createdAt
  });
}

async function safeCommunityAnalysis(item: RawCommunityItem, client: AnalysisClient) {
  try {
    return await client.analyzeJson<CommunityAnalysis>({ instructions: communityPrompt, input: item });
  } catch {
    return heuristicCommunityAnalysis(item);
  }
}

export async function analyzeManualCommunityInput(
  input: ManualCommunityInput,
  client?: AnalysisClient
): Promise<CommunityItem> {
  return analyzeCommunityItem(
    {
      id: `${input.source}_${hashId(input.url || input.title)}_${Date.now()}`,
      source: input.source,
      title: input.title.trim(),
      author: input.author?.trim() || "manual",
      url: input.url.trim(),
      content: input.content.trim(),
      createdAt: new Date().toISOString()
    },
    client
  );
}

function heuristicCommunityAnalysis(item: RawCommunityItem): CommunityAnalysis {
  const text = `${item.title} ${item.content}`.toLowerCase();
  const validation = text.includes("validat");
  const roadmap = text.includes("roadmap") || text.includes("what to build");
  const launch = text.includes("launch");
  const analytics = text.includes("analytics") || text.includes("growth");
  const score = 42 + (validation ? 24 : 0) + (roadmap ? 16 : 0) + (launch ? 12 : 0) + (analytics ? 10 : 0);
  const painPoint = validation
    ? "validation uncertainty"
    : roadmap
      ? "roadmap uncertainty"
      : launch
        ? "launch planning"
        : analytics
          ? "growth measurement"
          : "solo founder context switching";

  return {
    summary: item.content ? `${item.title}: ${item.content.slice(0, 180)}` : item.title,
    painPoint,
    userLanguage: extractUserLanguage(item),
    postAngle: postAngleForPainPoint(painPoint, item.title),
    relevanceScore: score,
    suggestedReply: draftReplyForPainPoint(painPoint, item.title),
    replyRationale: "The discussion maps to a recurring solo SaaS founder workflow problem."
  };
}

function normalizeUserLanguage(language: string[] | undefined, item: RawCommunityItem) {
  const values = Array.isArray(language) ? language : [];
  const cleanValues = values.map((value) => value.trim()).filter(Boolean).slice(0, 4);
  return cleanValues.length > 0 ? cleanValues : extractUserLanguage(item);
}

function extractUserLanguage(item: RawCommunityItem) {
  const text = `${item.title}. ${item.content}`
    .replace(/\s+/g, " ")
    .split(/[.!?;\n]/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 12 && part.length <= 90);

  return text.slice(0, 4);
}

function hashId(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

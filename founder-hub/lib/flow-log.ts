export type FlowStatus = "start" | "ok" | "skipped" | "error";

export interface FlowEvent {
  id: string;
  timestamp: string;
  route: string;
  step: string;
  source: string;
  status: FlowStatus;
  detail?: string;
  counts?: Record<string, number | boolean>;
}

const maxEvents = 80;
const recentEvents: FlowEvent[] = [];

export function flowLog(event: Omit<FlowEvent, "id" | "timestamp">): FlowEvent {
  const flowEvent: FlowEvent = {
    id: `${Date.now()}_${recentEvents.length}`,
    timestamp: new Date().toISOString(),
    ...event,
    detail: event.detail ? safeDetail(event.detail) : undefined
  };

  recentEvents.unshift(flowEvent);
  recentEvents.splice(maxEvents);
  console.log(`[founder-hub:flow] ${JSON.stringify(flowEvent)}`);
  return flowEvent;
}

export function getRecentFlowEvents() {
  return [...recentEvents];
}

export function clearFlowEvents() {
  recentEvents.length = 0;
}

export function publicFlowError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);
  return safeDetail(raw);
}

function safeDetail(value: string) {
  return value.replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]").slice(0, 260);
}

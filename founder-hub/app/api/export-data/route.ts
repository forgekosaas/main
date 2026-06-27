import { buildFounderHubMarkdown, founderHubExportFileName } from "@/lib/export-markdown";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  const generatedAt = new Date().toISOString();
  const snapshot = await getCurrentFounderHubSnapshot();
  const markdown = buildFounderHubMarkdown(snapshot, generatedAt);

  return new Response(markdown, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${founderHubExportFileName(generatedAt)}"`,
      "Content-Type": "text/markdown; charset=utf-8"
    }
  });
}

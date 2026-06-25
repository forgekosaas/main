import { proxyPlausibleScript } from "@/lib/plausible-script-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  return proxyPlausibleScript();
}

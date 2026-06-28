import { FounderHubHome } from "@/components/FounderHubHome";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const snapshot = await getCurrentFounderHubSnapshot();
  return <FounderHubHome snapshot={snapshot} />;
}

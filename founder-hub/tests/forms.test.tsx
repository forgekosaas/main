import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DataFlowPanel } from "@/components/DataFlowPanel";
import { DataSyncPanel } from "@/components/DataSyncPanel";
import { GmailDiagnosticPanel } from "@/components/GmailDiagnosticPanel";
import { ManualItemForm } from "@/components/ManualItemForm";
import { MemoryLog } from "@/components/MemoryLog";

describe("Founder Hub forms", () => {
  it("uses POST as the native fallback for manual community input", () => {
    const html = renderToStaticMarkup(<ManualItemForm />);

    expect(html).toContain('method="post"');
    expect(html).toContain('value="reddit"');
  });

  it("uses POST as the native fallback for memory entries", () => {
    const html = renderToStaticMarkup(<MemoryLog entries={[]} />);

    expect(html).toContain('method="post"');
  });

  it("shows private source extraction controls instead of old dashboard copy", () => {
    const html = renderToStaticMarkup(<DataSyncPanel />);

    expect(html).toContain("Extract latest data");
  });

  it("shows a data flow inspector for route-level debugging", () => {
    const html = renderToStaticMarkup(<DataFlowPanel />);

    expect(html).toContain("Data Flow");
    expect(html).toContain("Check Data Flow");
  });

  it("shows Gmail diagnostics for OAuth debugging", () => {
    const html = renderToStaticMarkup(<GmailDiagnosticPanel />);

    expect(html).toContain("Gmail Diagnostics");
    expect(html).toContain("Check Gmail");
  });
});

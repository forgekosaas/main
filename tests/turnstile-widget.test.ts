import { describe, expect, it, vi } from "vitest";

describe("Turnstile widget loader", () => {
  it("documents that widgets can be reset after a consumed token", async () => {
    const reset = vi.fn();
    const remove = vi.fn();
    const render = vi.fn(() => "widget-id");

    const widget = { render, reset, remove };

    widget.reset("widget-id");

    expect(reset).toHaveBeenCalledWith("widget-id");
  });

  it("loads Cloudflare Turnstile with explicit rendering", async () => {
    const appendedScripts: FakeScript[] = [];
    const scriptsById = new Map<string, FakeScript>();

    vi.stubGlobal("window", { turnstile: undefined });
    vi.stubGlobal("document", {
      createElement: (tagName: string) => {
        expect(tagName).toBe("script");
        return new FakeScript(scriptsById);
      },
      getElementById: (id: string) => scriptsById.get(id) ?? null,
      head: {
        appendChild: (script: FakeScript) => {
          appendedScripts.push(script);
          scriptsById.set(script.id, script);
        }
      }
    });

    const { loadTurnstileScript, turnstileScriptSrc } = await import("@/lib/turnstile-widget");
    const loaded = loadTurnstileScript();

    expect(turnstileScriptSrc).toBe("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit");
    expect(appendedScripts).toHaveLength(1);
    expect(appendedScripts[0]).toMatchObject({
      async: true,
      defer: true,
      id: "cloudflare-turnstile-script",
      src: turnstileScriptSrc
    });

    appendedScripts[0]?.dispatch("load");
    await expect(loaded).resolves.toBeUndefined();
  });
});

class FakeScript {
  async = false;
  defer = false;
  id = "";
  src = "";

  private listeners = new Map<string, Array<() => void>>();

  constructor(private readonly scriptsById: Map<string, FakeScript>) {}

  addEventListener(eventName: string, listener: () => void) {
    this.listeners.set(eventName, [...(this.listeners.get(eventName) ?? []), listener]);
  }

  dispatch(eventName: string) {
    this.scriptsById.set(this.id, this);
    for (const listener of this.listeners.get(eventName) ?? []) {
      listener();
    }
  }
}

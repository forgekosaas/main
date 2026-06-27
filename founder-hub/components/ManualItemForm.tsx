"use client";

import { useState } from "react";

import { CommunityItemCard } from "@/components/CommunityItemCard";
import type { CommunityItem } from "@/types/founder-hub";

type FormState = "idle" | "submitting" | "done" | "error";

export function ManualItemForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [item, setItem] = useState<CommunityItem | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");

    const form = new FormData(formElement);
    const payload = {
      source: form.get("source"),
      title: form.get("title"),
      author: form.get("author"),
      url: form.get("url"),
      content: form.get("content")
    };

    const response = await fetch("/api/community/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = (await response.json()) as { item?: CommunityItem; error?: string; persisted?: boolean };

    if (!response.ok || !json.item) {
      setState("error");
      setMessage(json.error ?? "Unable to analyze this item.");
      return;
    }

    setItem(json.item);
    setState("done");
    setMessage(json.persisted ? "Saved to Founder Hub database." : "Analyzed locally. Database not configured.");
    formElement.reset();
  }

  return (
    <section className="hub-panel p-4">
      <h2 className="text-base font-semibold text-hub-ink">Manual Reddit / X / Indie Hackers Item</h2>
      <form className="mt-4 grid gap-3" method="post" onSubmit={onSubmit}>
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            Source
            <select className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2" name="source">
              <option value="reddit">Reddit</option>
              <option value="x">X</option>
              <option value="indie-hackers">Indie Hackers</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            Title
            <input className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2" name="title" required />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            Author
            <input className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2" name="author" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            URL
            <input className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2" name="url" required type="url" />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium text-hub-ink">
          Content
          <textarea
            className="hub-focus min-h-32 rounded-md border border-hub-line bg-white px-3 py-2"
            name="content"
            required
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="hub-focus rounded-md bg-hub-accent px-4 py-2 text-sm font-semibold text-white"
            disabled={state === "submitting"}
            type="submit"
          >
            Analyze
          </button>
          {message ? <p className="text-sm text-hub-muted">{message}</p> : null}
        </div>
      </form>
      {item ? (
        <div className="mt-4">
          <CommunityItemCard item={item} />
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useState } from "react";

import type { MemoryEntry } from "@/types/founder-hub";

export function MemoryLog({ entries }: { entries: MemoryEntry[] }) {
  const [items, setItems] = useState(entries);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const entry: MemoryEntry = {
      id: `memory_${Date.now()}`,
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      title: String(form.get("title") || ""),
      motivation: String(form.get("motivation") || ""),
      sources: String(form.get("sources") || "")
        .split(",")
        .map((source) => source.trim())
        .filter(Boolean),
      consequences: String(form.get("consequences") || "")
    };

    const response = await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });
    const json = (await response.json()) as { entry?: MemoryEntry; persisted?: boolean };

    setItems((current) => [json.entry ?? entry, ...current]);
    setMessage(json.persisted ? "Saved to database." : "Saved in this browser session.");
    formElement.reset();
  }

  return (
    <section className="hub-panel p-4">
      <h2 className="text-base font-semibold text-hub-ink">Decision Memory</h2>
      <form className="mt-4 grid gap-3" method="post" onSubmit={onSubmit}>
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            Date
            <input
              className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2"
              defaultValue={new Date().toISOString().slice(0, 10)}
              name="date"
              type="date"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            Decision
            <input className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2" name="title" required />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium text-hub-ink">
          Motivation
          <textarea className="hub-focus min-h-24 rounded-md border border-hub-line bg-white px-3 py-2" name="motivation" required />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            Source IDs
            <input className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2" name="sources" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-hub-ink">
            Consequences
            <input className="hub-focus rounded-md border border-hub-line bg-white px-3 py-2" name="consequences" required />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="hub-focus rounded-md bg-hub-accent px-4 py-2 text-sm font-semibold text-white" type="submit">
            Save
          </button>
          {message ? <p className="text-sm text-hub-muted">{message}</p> : null}
        </div>
      </form>
      <div className="mt-5 space-y-3">
        {items.map((entry) => (
          <article key={entry.id} className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold text-hub-ink">{entry.title}</h3>
              <time className="text-sm text-hub-muted">{entry.date}</time>
            </div>
            <p className="mt-2 text-sm leading-6 text-hub-muted">{entry.motivation}</p>
            <p className="mt-2 text-sm leading-6 text-hub-ink">{entry.consequences}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

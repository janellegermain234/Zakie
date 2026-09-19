"use client";

import { useState } from "react";

import { GeneratedOutput } from "@/components/generated-output";
import type { GenerationSource } from "@/lib/crisp";

/**
 * The comparison. Two panels, one model, one set of settings, two prompts —
 * both generated live, in the same run, so nothing about the difference can be
 * put down to timing or configuration.
 */

type PanelState = {
  pending: boolean;
  error: string | null;
  text: string | null;
  model: string | null;
};

const IDLE: PanelState = { pending: false, error: null, text: null, model: null };

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function Panel({
  label,
  description,
  requestNote,
  state,
  accent,
  businessName,
}: {
  label: string;
  description: string;
  requestNote: React.ReactNode;
  state: PanelState;
  accent: boolean;
  businessName: string;
}) {
  return (
    <section
      className={`flex flex-col rounded-xl border bg-surface ${
        accent ? "border-accent/40" : "border-border"
      }`}
    >
      <header className="border-b border-border p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            className={`text-sm font-medium uppercase tracking-[0.16em] ${
              accent ? "text-accent" : "text-muted"
            }`}
          >
            {label}
          </h2>
          {state.text ? (
            <span className="text-xs text-muted">
              {wordCount(state.text)} words
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-4 rounded-lg border border-border bg-surface-raised p-4">
          {requestNote}
        </div>
      </header>

      <div className="flex-1 p-6">
        {state.pending ? (
          <p className="text-sm text-muted">Generating…</p>
        ) : state.error ? (
          <p className="text-sm text-negative">{state.error}</p>
        ) : state.text ? (
          <GeneratedOutput text={state.text} businessName={businessName} />
        ) : (
          <p className="text-sm text-muted">
            Nothing yet. Generate both to compare.
          </p>
        )}
      </div>
    </section>
  );
}

export function ComparisonPanels({
  profileId,
  businessName,
  naivePrompt,
  model,
  profileVersion,
  contextFieldCount,
}: {
  profileId: string;
  businessName: string;
  naivePrompt: string;
  model: string;
  profileVersion: number;
  contextFieldCount: number;
}) {
  const [panels, setPanels] = useState<Record<GenerationSource, PanelState>>({
    profile: IDLE,
    blank: IDLE,
  });

  const pending = panels.profile.pending || panels.blank.pending;

  function update(source: GenerationSource, patch: Partial<PanelState>) {
    setPanels((current) => ({
      ...current,
      [source]: { ...current[source], ...patch },
    }));
  }

  async function run(source: GenerationSource) {
    update(source, { pending: true, error: null, text: null, model: null });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profileId, source }),
      });
      const payload = await response.json();

      if (!response.ok) {
        update(source, { pending: false, error: payload?.error ?? "Generation failed." });
        return;
      }

      update(source, { pending: false, text: payload.text, model: payload.model });
    } catch (caught) {
      update(source, {
        pending: false,
        error: caught instanceof Error ? caught.message : "Generation failed.",
      });
    }
  }

  function generateBoth() {
    // Fired together, on purpose: same model, same settings, same moment.
    void Promise.all([run("profile"), run("blank")]);
  }

  const done = Boolean(panels.profile.text && panels.blank.text);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={generateBoth}
          disabled={pending}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Generating both…" : done ? "Run both again" : "Generate both"}
        </button>
        <p aria-live="polite" className="text-sm text-muted">
          {pending
            ? "Both requests are in flight."
            : done
              ? "Both saved to assets, from the same model and the same settings."
              : `${model} · identical settings on both sides`}
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <Panel
          accent
          businessName={businessName}
          label="With the business profile"
          description="The CRISP request: the stored profile as structured context, a role, the instruction, the fixed design standards, and the output parameters."
          state={panels.profile}
          requestNote={
            <p className="text-xs leading-relaxed text-muted">
              {contextFieldCount} profile fields at version {profileVersion},
              plus six groups of design standards.
            </p>
          }
        />
        <Panel
          accent={false}
          businessName={businessName}
          label="From a blank prompt"
          description="What someone types when they have nothing stored: the business name and the ask."
          state={panels.blank}
          requestNote={
            <p className="text-xs leading-relaxed text-foreground">
              &ldquo;{naivePrompt}&rdquo;
            </p>
          }
        />
      </div>
    </div>
  );
}

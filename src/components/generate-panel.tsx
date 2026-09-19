"use client";

import { useState } from "react";

import { GeneratedOutput } from "@/components/generated-output";

type Result = {
  text: string;
  model: string;
  profileVersion: number;
};

/** The generate button and the output it produces. */
export function GeneratePanel({
  profileId,
  businessName,
}: {
  profileId: string;
  businessName: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function generate() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "Generation failed.");
        return;
      }

      setResult({
        text: payload.text,
        model: payload.model,
        profileVersion: payload.profileVersion,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Generation failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={generate}
          disabled={pending}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending
            ? "Generating…"
            : result
              ? "Generate again"
              : "Generate brand guidelines"}
        </button>
        <p aria-live="polite" className="text-sm text-muted">
          {pending
            ? "Sending the request above."
            : error
              ? null
              : result
                ? `Saved to assets from profile version ${result.profileVersion}.`
                : null}
        </p>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-negative/40 bg-surface p-6 text-sm text-negative">
          {error}
        </p>
      ) : null}

      {result ? (
        <article className="mt-8 rounded-xl border border-border bg-surface p-8">
          <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-5">
            <h2 className="text-lg font-medium tracking-tight">
              Brand guidelines
            </h2>
            <p className="text-xs text-muted">
              {result.model} · profile version {result.profileVersion}
            </p>
          </header>
          <div className="mt-6">
            <GeneratedOutput text={result.text} businessName={businessName} />
          </div>
        </article>
      ) : null}
    </div>
  );
}

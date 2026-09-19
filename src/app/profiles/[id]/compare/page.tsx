import Link from "next/link";
import { notFound } from "next/navigation";

import { ComparisonPanels } from "@/components/comparison-panels";
import { buildNaivePrompt } from "@/lib/crisp";
import { MODEL } from "@/lib/openai";
import { PROFILE_FIELDS, displayName, isFieldFilled } from "@/lib/profile";
import { getProfile } from "@/lib/profiles-repo";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getProfile(id);

  if (!row) notFound();

  const filledFields = PROFILE_FIELDS.filter((field) =>
    isFieldFilled(row.profile, field.name),
  ).length;

  return (
    <div>
      <header className="max-w-2xl">
        <Link
          href={`/profiles/${row.id}/generate`}
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← {displayName(row.profile)} · generate
        </Link>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Comparison
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          The same model, twice
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          Both panels generate live, side by side, from {MODEL} with identical
          settings. The only difference is the prompt: everything the profile
          knows on the left, the business name on the right.
        </p>
      </header>

      <div className="mt-12">
        <ComparisonPanels
          profileId={row.id}
          businessName={displayName(row.profile)}
          naivePrompt={buildNaivePrompt(row.profile)}
          model={MODEL}
          profileVersion={row.version}
          contextFieldCount={filledFields}
        />
      </div>
    </div>
  );
}

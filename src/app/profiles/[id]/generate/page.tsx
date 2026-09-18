import Link from "next/link";
import { notFound } from "next/navigation";

import { CrispCard } from "@/components/crisp-card";
import { GeneratePanel } from "@/components/generate-panel";
import { buildCrispRequest } from "@/lib/crisp";
import { displayName } from "@/lib/profile";
import { getProfile } from "@/lib/profiles-repo";

export const dynamic = "force-dynamic";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getProfile(id);

  if (!row) notFound();

  // Built here only to show the request; the route builds its own, fresh.
  const crisp = buildCrispRequest(row.profile);

  return (
    <div>
      <header className="max-w-2xl">
        <Link
          href={`/profiles/${row.id}`}
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← {displayName(row.profile)}
        </Link>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Generate
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Brand guidelines
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          Read the request first. Every part of it is built from the stored
          profile at version {row.version} and a fixed set of design standards —
          then it is sent as one prompt.
        </p>
      </header>

      <div className="mt-12">
        <CrispCard crisp={crisp} />
      </div>

      <div className="mt-10">
        <GeneratePanel profileId={row.id} />
      </div>
    </div>
  );
}

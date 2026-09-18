import Link from "next/link";

import { displayName, type BusinessProfileRow } from "@/lib/profile";
import { listProfiles } from "@/lib/profiles-repo";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ProfileCard({ row }: { row: BusinessProfileRow }) {
  const { profile } = row;
  return (
    <li className="rounded-xl border border-border bg-surface transition-colors hover:border-muted/40">
      <Link href={`/profiles/${row.id}`} className="block p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-lg font-medium tracking-tight">
            {displayName(profile)}
          </h3>
          <span className="text-xs text-muted">v{row.version}</span>
        </div>
        {profile.one_liner ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {profile.one_liner}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {profile.stage ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              {profile.stage}
            </span>
          ) : null}
          {profile.location ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              {profile.location}
            </span>
          ) : null}
          {profile.personality.slice(0, 3).map((trait) => (
            <span
              key={trait}
              className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs text-foreground"
            >
              {trait}
            </span>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted">
          Updated {formatDate(row.updated_at)}
        </p>
      </Link>
    </li>
  );
}

export default async function HomePage() {
  let rows: BusinessProfileRow[] = [];
  let error: string | null = null;

  try {
    rows = await listProfiles();
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Could not load profiles.";
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold tracking-tight">
            Profile in, better output out.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            The same model, the same settings, two requests: one built from a
            stored business profile, one from a blank prompt. Save a profile to
            see the difference.
          </p>
        </div>
        <Link
          href="/profiles/new"
          className="mt-2 shrink-0 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          New profile
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted">
          Saved profiles
        </h2>

        {error ? (
          <p className="mt-4 rounded-xl border border-negative/40 bg-surface p-6 text-sm text-negative">
            {error}
          </p>
        ) : rows.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-muted">No profiles yet.</p>
            <Link
              href="/profiles/new"
              className="mt-4 inline-block text-sm text-accent hover:underline"
            >
              Create the first one
            </Link>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {rows.map((row) => (
              <ProfileCard key={row.id} row={row} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

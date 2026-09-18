import Link from "next/link";
import { notFound } from "next/navigation";

import { ProfileForm } from "@/components/profile-form";
import { displayName } from "@/lib/profile";
import { getProfile } from "@/lib/profiles-repo";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getProfile(id);

  if (!row) notFound();

  return (
    <div>
      <header className="max-w-2xl">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All profiles
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          {displayName(row.profile)}
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          Version {row.version} · updated{" "}
          {new Date(row.updated_at).toLocaleString("en-GB")}. Saving a change
          bumps the version in the database.
        </p>
      </header>

      <div className="mt-14">
        <ProfileForm
          profileId={row.id}
          profile={row.profile}
          version={row.version}
        />
      </div>
    </div>
  );
}

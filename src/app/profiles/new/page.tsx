import { ProfileForm } from "@/components/profile-form";
import { EMPTY_PROFILE } from "@/lib/profile";

export default function NewProfilePage() {
  return (
    <div>
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Intake
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          New business profile
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          Fourteen fields in four groups. Everything here becomes structured
          context at generation time — the fuller it is, the sharper the
          comparison.
        </p>
      </header>

      <div className="mt-14">
        <ProfileForm profileId={null} profile={EMPTY_PROFILE} />
      </div>
    </div>
  );
}

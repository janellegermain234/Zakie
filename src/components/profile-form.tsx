"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { saveProfile } from "@/app/profiles/actions";
import {
  INITIAL_SAVE_STATE,
  type SaveState,
} from "@/lib/profile-form";
import {
  PERSONALITY_MAX,
  PERSONALITY_MIN,
  PROFILE_SECTIONS,
  type BusinessProfile,
  type ProfileField,
} from "@/lib/profile";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/50 transition-colors hover:border-muted/40 focus:border-accent focus:outline-none";

function FieldShell({
  field,
  error,
  children,
}: {
  field: ProfileField;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
          {field.required ? <span className="ml-1 text-accent">*</span> : null}
        </label>
        {error ? <span className="text-xs text-negative">{error}</span> : null}
      </div>
      {field.hint ? (
        <p className="mt-1 text-xs text-muted">{field.hint}</p>
      ) : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function PersonalityPicker({
  field,
  initial,
}: {
  field: ProfileField;
  initial: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initial);

  function toggle(trait: string) {
    setSelected((current) =>
      current.includes(trait)
        ? current.filter((value) => value !== trait)
        : [...current, trait],
    );
  }

  // Untouched counts stay neutral; the server's message is what flags a
  // rejected submission.
  const looksWrong =
    selected.length > 0 &&
    (selected.length < PERSONALITY_MIN || selected.length > PERSONALITY_MAX);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {field.options?.map((trait) => {
          const isSelected = selected.includes(trait);
          return (
            <label
              key={trait}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                isSelected
                  ? "border-accent bg-accent-soft text-foreground"
                  : "border-border bg-surface-raised text-muted hover:border-muted/40 hover:text-foreground"
              }`}
            >
              <input
                type="checkbox"
                name={field.name}
                value={trait}
                checked={isSelected}
                onChange={() => toggle(trait)}
                className="sr-only"
              />
              {trait}
            </label>
          );
        })}
      </div>
      <p
        className={`mt-2 text-xs ${looksWrong ? "text-negative" : "text-muted"}`}
      >
        {selected.length} selected — {PERSONALITY_MIN} to {PERSONALITY_MAX}{" "}
        required.
      </p>
    </div>
  );
}

function Field({
  field,
  profile,
  error,
}: {
  field: ProfileField;
  profile: BusinessProfile;
  error?: string;
}) {
  if (field.kind === "multiselect") {
    return (
      <FieldShell field={field} error={error}>
        <PersonalityPicker field={field} initial={profile.personality} />
      </FieldShell>
    );
  }

  if (field.kind === "select") {
    return (
      <FieldShell field={field} error={error}>
        <select
          id={field.name}
          name={field.name}
          defaultValue={profile[field.name] as string}
          className={inputClass}
        >
          <option value="">Choose one</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (field.kind === "textarea") {
    return (
      <FieldShell field={field} error={error}>
        <textarea
          id={field.name}
          name={field.name}
          rows={4}
          defaultValue={profile[field.name] as string}
          placeholder={field.placeholder}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell field={field} error={error}>
      <input
        id={field.name}
        name={field.name}
        type="text"
        defaultValue={profile[field.name] as string}
        placeholder={field.placeholder}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function ProfileForm({
  profileId,
  profile,
  version,
}: {
  profileId: string | null;
  profile: BusinessProfile;
  version?: number;
}) {
  const action = saveProfile.bind(null, profileId);
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    action,
    INITIAL_SAVE_STATE,
  );

  // After a rejected save, re-render the values the server saw.
  const values = state.values ?? profile;

  return (
    <form action={formAction} className="space-y-14">
      {PROFILE_SECTIONS.map((section) => (
        <section
          key={section.title}
          className="grid gap-8 md:grid-cols-[14rem_1fr]"
        >
          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {section.description}
            </p>
          </div>
          <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
            {section.fields.map((field) => (
              <Field
                key={field.name}
                field={field}
                profile={values}
                error={state.errors[field.name]}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : profileId ? "Save changes" : "Save profile"}
        </button>
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Back to profiles
        </Link>
        <p
          aria-live="polite"
          className={`text-sm ${
            state.status === "error" ? "text-negative" : "text-positive"
          }`}
        >
          {state.message}
        </p>
        {version !== undefined ? (
          <span className="ml-auto text-sm text-muted">
            Saved version {version}
          </span>
        ) : null}
      </div>
    </form>
  );
}

import {
  EMPTY_PROFILE,
  PERSONALITY_MAX,
  PERSONALITY_MIN,
  PERSONALITY_TRAITS,
  PROFILE_FIELDS,
  STAGES,
  type BusinessProfile,
  type PersonalityTrait,
  type Stage,
} from "@/lib/profile";

export type FieldErrors = Partial<Record<keyof BusinessProfile, string>>;

export type SaveState = {
  status: "idle" | "error" | "saved";
  message: string;
  errors: FieldErrors;
  /** Echoed back so a rejected submission keeps what was typed. */
  values: BusinessProfile | null;
};

export const INITIAL_SAVE_STATE: SaveState = {
  status: "idle",
  message: "",
  errors: {},
  values: null,
};

/** Read the fourteen fields out of FormData. Shape only — no validation. */
export function readProfileForm(formData: FormData): BusinessProfile {
  const profile: BusinessProfile = { ...EMPTY_PROFILE };

  for (const field of PROFILE_FIELDS) {
    if (field.name === "personality") {
      profile.personality = formData
        .getAll("personality")
        .map((value) => String(value))
        .filter((value): value is PersonalityTrait =>
          (PERSONALITY_TRAITS as readonly string[]).includes(value),
        );
    } else {
      const value = formData.get(field.name);
      (profile[field.name] as string) = typeof value === "string" ? value.trim() : "";
    }
  }

  return profile;
}

export function validateProfile(profile: BusinessProfile): FieldErrors {
  const errors: FieldErrors = {};

  if (!profile.business_name) {
    errors.business_name = "A business name is required.";
  }

  if (!profile.stage) {
    errors.stage = "Pick the stage the business is at.";
  } else if (!(STAGES as readonly string[]).includes(profile.stage)) {
    errors.stage = "That stage is not one of the four options.";
  }

  if (
    profile.personality.length < PERSONALITY_MIN ||
    profile.personality.length > PERSONALITY_MAX
  ) {
    errors.personality = `Choose between ${PERSONALITY_MIN} and ${PERSONALITY_MAX} traits.`;
  }

  return errors;
}

export function asStage(value: string): Stage | "" {
  return (STAGES as readonly string[]).includes(value) ? (value as Stage) : "";
}

/**
 * The shape stored in `business_profiles.profile` (jsonb): fourteen fields in
 * four groups. Shared by the intake form, the context builder and the reader.
 */

export const STAGES = [
  "idea",
  "trading under a year",
  "trading over a year",
  "rebuilding",
] as const;

export type Stage = (typeof STAGES)[number];

export const PERSONALITY_TRAITS = [
  "warm",
  "bold",
  "precise",
  "playful",
  "premium",
  "practical",
  "calm",
  "confident",
] as const;

export type PersonalityTrait = (typeof PERSONALITY_TRAITS)[number];

export const PERSONALITY_MIN = 3;
export const PERSONALITY_MAX = 5;

export type BusinessProfile = {
  // Identity
  business_name: string;
  stage: Stage | "";
  location: string;
  one_liner: string;
  // Market and offer
  customer: string;
  problem: string;
  offer: string;
  price_point: string;
  competitors: string;
  // Voice
  personality: PersonalityTrait[];
  tone_rules: string;
  inspiration: string;
  // Constraints
  must_include: string;
  must_avoid: string;
};

export type BusinessProfileRow = {
  id: string;
  created_at: string;
  updated_at: string;
  version: number;
  profile: BusinessProfile;
};

export type AssetRow = {
  id: string;
  business_id: string;
  type: string;
  content: unknown;
  profile_version: number;
  created_at: string;
};

export const EMPTY_PROFILE: BusinessProfile = {
  business_name: "",
  stage: "",
  location: "",
  one_liner: "",
  customer: "",
  problem: "",
  offer: "",
  price_point: "",
  competitors: "",
  personality: [],
  tone_rules: "",
  inspiration: "",
  must_include: "",
  must_avoid: "",
};

/**
 * Field metadata for the four groups. The intake form renders from this, and
 * the generation context (step 3) labels the stored values from the same list,
 * so the two can never drift apart.
 */

export type FieldKind = "text" | "textarea" | "select" | "multiselect";

export type ProfileField = {
  name: keyof BusinessProfile;
  label: string;
  kind: FieldKind;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  options?: readonly string[];
};

export type ProfileSection = {
  title: string;
  description: string;
  fields: ProfileField[];
};

export const PROFILE_SECTIONS: ProfileSection[] = [
  {
    title: "Identity",
    description: "Who the business is, and where it stands today.",
    fields: [
      {
        name: "business_name",
        label: "Business name",
        kind: "text",
        required: true,
        placeholder: "Nightjar Coffee",
      },
      {
        name: "stage",
        label: "Stage",
        kind: "select",
        required: true,
        options: STAGES,
      },
      {
        name: "location",
        label: "Location",
        kind: "text",
        placeholder: "Bristol, UK",
      },
      {
        name: "one_liner",
        label: "One-liner",
        kind: "text",
        hint: "One sentence a customer would recognise.",
        placeholder: "Slow-roasted coffee for people who work from home.",
      },
    ],
  },
  {
    title: "Market and offer",
    description: "Who it serves, what it fixes, and what it sells.",
    fields: [
      {
        name: "customer",
        label: "Customer",
        kind: "textarea",
        hint: "Who they are, what their day looks like, what they already buy.",
      },
      {
        name: "problem",
        label: "Problem",
        kind: "textarea",
        hint: "The problem in the customer's own words, not yours.",
      },
      {
        name: "offer",
        label: "Offer",
        kind: "textarea",
        hint: "What they get, how it is delivered, and what makes it different.",
      },
      {
        name: "price_point",
        label: "Price point",
        kind: "text",
        placeholder: "£14 a bag, £38 a month subscription",
      },
      {
        name: "competitors",
        label: "Competitors",
        kind: "text",
        placeholder: "Supermarket own-label, Pact, the café on the corner",
      },
    ],
  },
  {
    title: "Voice",
    description: "How it should sound before a single word is written.",
    fields: [
      {
        name: "personality",
        label: "Personality",
        kind: "multiselect",
        hint: `Choose ${PERSONALITY_MIN} to ${PERSONALITY_MAX}.`,
        required: true,
        options: PERSONALITY_TRAITS,
      },
      {
        name: "tone_rules",
        label: "Tone rules",
        kind: "textarea",
        hint: "Sentence length, humour, how formal, what you never do.",
      },
      {
        name: "inspiration",
        label: "Inspiration",
        kind: "text",
        hint: "Links or notes — brands whose voice feels right.",
      },
    ],
  },
  {
    title: "Constraints",
    description: "The non-negotiables every piece of output must respect.",
    fields: [
      {
        name: "must_include",
        label: "Must include",
        kind: "text",
        placeholder: "B Corp certification, the founder's name",
      },
      {
        name: "must_avoid",
        label: "Must avoid",
        kind: "text",
        placeholder: "The word artisan, exclamation marks, price claims",
      },
    ],
  },
];

export const PROFILE_FIELDS: ProfileField[] = PROFILE_SECTIONS.flatMap(
  (section) => section.fields,
);

/** A row's jsonb may predate a field, so read through a complete default. */
export function normalizeProfile(value: unknown): BusinessProfile {
  const raw = (value ?? {}) as Partial<Record<keyof BusinessProfile, unknown>>;
  const result: BusinessProfile = { ...EMPTY_PROFILE };

  for (const field of PROFILE_FIELDS) {
    const incoming = raw[field.name];
    if (field.name === "personality") {
      result.personality = Array.isArray(incoming)
        ? incoming.filter((trait): trait is PersonalityTrait =>
            (PERSONALITY_TRAITS as readonly string[]).includes(trait as string),
          )
        : [];
    } else if (typeof incoming === "string") {
      // Every other field is a string; `stage` is narrowed on read.
      (result[field.name] as string) = incoming;
    }
  }

  if (!(STAGES as readonly string[]).includes(result.stage)) {
    result.stage = "";
  }

  return result;
}

export function displayName(profile: BusinessProfile): string {
  return profile.business_name.trim() || "Untitled business";
}

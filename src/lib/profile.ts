/**
 * The shape stored in `business_profiles.profile` (jsonb): fourteen fields in
 * four groups. Shared by the intake form, the context builder and the reader.
 *
 * Four of the fields are composite: a preset picker plus an optional free-text
 * box, stored together under the field's single key as
 * `{ selected: string[], notes: string }`. The key count stays at fourteen.
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

/**
 * Preset options for the four composite fields.
 *
 * These are the demo's defaults and are meant to be edited: replacing a list
 * here changes the pickers everywhere. A saved selection that is no longer in
 * its list is kept and still shown, so editing a list never loses data.
 */

export const PRICING_MODELS = [
  "one-off purchase",
  "subscription",
  "retainer",
  "hourly rate",
  "day rate",
  "project fee",
  "tiered packages",
  "freemium",
  "commission or revenue share",
  "free",
] as const;

export const TONE_RULES = [
  "short sentences",
  "plain English, no jargon",
  "active voice",
  "speak as you, not we",
  "no exclamation marks",
  "no hype or superlatives",
  "no emoji",
  "contractions are fine",
  "dry humour welcome",
  "British spelling",
] as const;

export const INSPIRATIONS = [
  "editorial and magazine",
  "independent retail",
  "premium beauty and skincare",
  "modern software brands",
  "craft food and drink",
  "heritage and traditional trades",
  "outdoor and adventure",
  "wellness and calm",
  "streetwear and youth culture",
  "luxury hospitality",
] as const;

export const THINGS_TO_AVOID = [
  "jargon and buzzwords",
  "hype and superlatives",
  "clichés (artisan, game-changing, passionate)",
  "exclamation marks",
  "emoji",
  "ALL CAPS",
  "slang",
  "discounting and price claims",
  "competitor names",
  "guarantees and medical claims",
] as const;

/** A preset picker plus its optional free text, stored under one key. */
export type CompositeValue = {
  selected: string[];
  notes: string;
};

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
  price_point: CompositeValue;
  competitors: string;
  // Voice
  personality: PersonalityTrait[];
  tone_rules: CompositeValue;
  inspiration: CompositeValue;
  // Constraints
  must_include: string;
  must_avoid: CompositeValue;
};

export type CompositeFieldName =
  | "price_point"
  | "tone_rules"
  | "inspiration"
  | "must_avoid";

export const COMPOSITE_FIELDS: CompositeFieldName[] = [
  "price_point",
  "tone_rules",
  "inspiration",
  "must_avoid",
];

export function isCompositeField(
  name: keyof BusinessProfile,
): name is CompositeFieldName {
  return (COMPOSITE_FIELDS as string[]).includes(name);
}

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
  price_point: { selected: [], notes: "" },
  competitors: "",
  personality: [],
  tone_rules: { selected: [], notes: "" },
  inspiration: { selected: [], notes: "" },
  must_include: "",
  must_avoid: { selected: [], notes: "" },
};

/**
 * Field metadata for the four groups. The intake form renders from this, and
 * the generation context labels the stored values from the same list, so the
 * two can never drift apart.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "preset-single"
  | "preset-multi";

export type ProfileField = {
  name: keyof BusinessProfile;
  label: string;
  kind: FieldKind;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  options?: readonly string[];
  /** Composite fields only: the label and placeholder of the free-text box. */
  notesLabel?: string;
  notesPlaceholder?: string;
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
        kind: "preset-single",
        hint: "Pick the pricing model, then give the actual amounts.",
        options: PRICING_MODELS,
        notesLabel: "Amounts",
        notesPlaceholder: "£14 a bag, £38 a month for the subscription",
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
        kind: "preset-multi",
        hint: "Pick any that apply, then add the rules only you would know.",
        options: TONE_RULES,
        notesLabel: "Anything else",
        notesPlaceholder:
          "Never open with a question. Say roastery, not micro-roastery.",
      },
      {
        name: "inspiration",
        label: "Inspiration",
        kind: "preset-multi",
        hint: "Pick the territories that feel right, then name names.",
        options: INSPIRATIONS,
        notesLabel: "Links or notes",
        notesPlaceholder: "monocle.com, Aesop shop signage",
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
        kind: "preset-multi",
        hint: "Pick the usual suspects, then add your own.",
        options: THINGS_TO_AVOID,
        notesLabel: "Anything else",
        notesPlaceholder: "The word artisan, any mention of the old name",
      },
    ],
  },
];

export const PROFILE_FIELDS: ProfileField[] = PROFILE_SECTIONS.flatMap(
  (section) => section.fields,
);

export function fieldByName(name: keyof BusinessProfile): ProfileField {
  const field = PROFILE_FIELDS.find((candidate) => candidate.name === name);
  if (!field) throw new Error(`No field metadata for ${name}`);
  return field;
}

/**
 * Reading stored values. A row's jsonb may predate a field, or may hold the
 * plain string a composite field used to store, so everything is read through
 * a complete default.
 */

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readComposite(value: unknown, single: boolean): CompositeValue {
  // A profile saved before the field became a picker: keep the free text.
  if (typeof value === "string") {
    return { selected: [], notes: value };
  }

  if (Array.isArray(value)) {
    return { selected: value.filter((item) => typeof item === "string"), notes: "" };
  }

  if (value && typeof value === "object") {
    const raw = value as { selected?: unknown; notes?: unknown };
    const selected = Array.isArray(raw.selected)
      ? raw.selected.filter((item): item is string => typeof item === "string")
      : [];
    return {
      selected: single ? selected.slice(0, 1) : selected,
      notes: readString(raw.notes),
    };
  }

  return { selected: [], notes: "" };
}

export function normalizeProfile(value: unknown): BusinessProfile {
  const raw = (value ?? {}) as Record<string, unknown>;
  const stage = readString(raw.stage);

  return {
    business_name: readString(raw.business_name),
    stage: (STAGES as readonly string[]).includes(stage) ? (stage as Stage) : "",
    location: readString(raw.location),
    one_liner: readString(raw.one_liner),
    customer: readString(raw.customer),
    problem: readString(raw.problem),
    offer: readString(raw.offer),
    price_point: readComposite(raw.price_point, true),
    competitors: readString(raw.competitors),
    personality: Array.isArray(raw.personality)
      ? raw.personality.filter((trait): trait is PersonalityTrait =>
          (PERSONALITY_TRAITS as readonly string[]).includes(trait as string),
        )
      : [],
    tone_rules: readComposite(raw.tone_rules, false),
    inspiration: readComposite(raw.inspiration, false),
    must_include: readString(raw.must_include),
    must_avoid: readComposite(raw.must_avoid, false),
  };
}

/**
 * One field, one string. Selections and free text read as a single value, so
 * the context builder never has to know which fields are composite.
 */
export function compositeToText(value: CompositeValue): string {
  const selected = value.selected.join(", ");
  const notes = value.notes.trim();
  if (selected && notes) return `${selected}. ${notes}`;
  return selected || notes;
}

export function fieldToText(
  profile: BusinessProfile,
  name: keyof BusinessProfile,
): string {
  const value = profile[name];
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return compositeToText(value);
}

export function isFieldFilled(
  profile: BusinessProfile,
  name: keyof BusinessProfile,
): boolean {
  return fieldToText(profile, name).trim().length > 0;
}

export function displayName(profile: BusinessProfile): string {
  return profile.business_name.trim() || "Untitled business";
}

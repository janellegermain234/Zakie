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

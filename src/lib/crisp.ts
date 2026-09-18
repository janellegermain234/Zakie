import { designStandardsToText } from "@/lib/design-standards";
import {
  PROFILE_SECTIONS,
  displayName,
  fieldToText,
  type BusinessProfile,
} from "@/lib/profile";

/**
 * The request, built as CRISP: Context, Role, Instruction, Specifics,
 * Parameters. The same five components are shown on screen before generating
 * and sent to the model — the card is the request, not a description of it.
 *
 * Nothing here is ever stored: the context block is assembled fresh from the
 * structured profile fields at request time.
 */

export type CrispRequest = {
  context: string;
  role: string;
  instruction: string;
  specifics: string;
  parameters: string;
};

export const ASSET_TYPE = "brand_guidelines";

const ROLE =
  "You are a senior brand designer and copywriter. You have built brand systems for small businesses for fifteen years, and you write guidelines a solo founder can actually follow.";

const INSTRUCTION =
  "Produce brand guidelines for this business: how it sounds, how it looks, and how those two hold together across everything it publishes. Ground every recommendation in the business described in the context — name the customer, the offer and the constraints rather than writing advice that would suit any business.";

const PARAMETERS = [
  "Format: Markdown. Use these six sections, in this order, each as a `## ` heading: Brand at a glance, Voice and tone, Messaging and copy, Typography and hierarchy, Colour and spacing, Logo and layout. Under each heading use short paragraphs and bullet lists.",
  "Length: 700 to 1,000 words in total.",
  "Give concrete, checkable specifics — sizes, ratios, counts, example lines — not general advice.",
  "Write two example headlines and one example call to action in the business's own voice.",
  "No preamble, no closing summary, no meta commentary about the task. Start at the first heading.",
].join("\n");

/**
 * The Context component: the stored profile rendered from its structured
 * fields, grouped as the intake form groups them. Empty fields are skipped so
 * the model is never handed blank labels to fill in.
 */
export function buildContext(profile: BusinessProfile): string {
  const blocks: string[] = [];

  for (const section of PROFILE_SECTIONS) {
    const lines = section.fields
      .map((field) => ({ label: field.label, value: fieldToText(profile, field.name).trim() }))
      .filter((entry) => entry.value.length > 0)
      .map((entry) => `- ${entry.label}: ${entry.value}`);

    if (lines.length > 0) {
      blocks.push(`${section.title}\n${lines.join("\n")}`);
    }
  }

  return blocks.join("\n\n");
}

export function buildCrispRequest(profile: BusinessProfile): CrispRequest {
  return {
    context: buildContext(profile),
    role: ROLE,
    instruction: INSTRUCTION,
    specifics: `Every recommendation must satisfy these design standards:\n\n${designStandardsToText()}`,
    parameters: PARAMETERS,
  };
}

/** The five components as the single prompt the model receives. */
export function crispToPrompt(crisp: CrispRequest): string {
  return [
    `CONTEXT\n${crisp.context}`,
    `INSTRUCTION\n${crisp.instruction}`,
    `SPECIFICS\n${crisp.specifics}`,
    `PARAMETERS\n${crisp.parameters}`,
  ].join("\n\n");
}

/** How the panels are labelled, and what an asset row records it came from. */
export type GenerationSource = "profile" | "blank";

/** What a real person types when they have no profile to hand. */
export function buildNaivePrompt(profile: BusinessProfile): string {
  return `Write brand guidelines for ${displayName(profile)}.`;
}

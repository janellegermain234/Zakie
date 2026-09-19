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
  "Return a complete brand system with concrete, usable values — not advice. Every value must be a real value a designer could apply this afternoon.",
  "",
  "Brand foundation: a positioning line, a personality in exactly three words, and three messaging pillars.",
  "Colour system: a full palette given as named roles with hex values, covering dominant, secondary, accent and neutrals. State the 60/30/10 split and the contrast ratio for body text.",
  "Typography: a display typeface and a body typeface, each named specifically. A type scale in pixels across five steps, with weights and line heights.",
  "Spacing and layout: an eight-point scale listed as actual values, plus stated grid and margin rules.",
  "Logo usage: clear space as a multiple of logo height, a minimum size in pixels, and placement rules.",
  "Voice and copy: three written example headlines that satisfy the four-to-eight-word rule, one example subhead, and two example calls to action — all specific to this business, never placeholders.",
  "Dos and don'ts: at least six paired items, drawn from this business's own tone rules and must-avoid fields.",
  "",
  "No square brackets. No \"choose a colour that\". No generic advice that would suit any business. Where the profile gives a constraint, honour it exactly.",
  "Return JSON matching the provided schema.",
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

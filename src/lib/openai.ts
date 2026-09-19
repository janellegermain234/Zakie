import "server-only";

import OpenAI from "openai";

import { requireEnv } from "@/lib/env";

/**
 * Generation runs here, on the server, and nowhere else.
 *
 * Both panels of the comparison call this with identical settings — the only
 * difference between them is the prompt, which is the whole point of the demo.
 */

/**
 * OpenAI's current flagship text model. Checked against OpenAI's model
 * documentation rather than guessed; change it in this one place.
 */
export const MODEL = "gpt-6-astra";

export const GENERATION_SETTINGS = {
  model: MODEL,
  max_output_tokens: 4000,
} as const;

let cached: OpenAI | null = null;

function client(): OpenAI {
  if (!cached) {
    cached = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  }
  return cached;
}

export type GenerationResult = {
  text: string;
  model: string;
};

/**
 * One call, one text back. `instructions` carries the Role component of a
 * CRISP request; the blank-prompt side passes none, because a person typing a
 * one-line prompt does not write themselves a role. `schema` asks for
 * structured output, so the renderer can style each part of the answer; the
 * text comes back exactly as the model wrote it and is stored that way.
 */
export async function generateText(
  prompt: string,
  options: {
    instructions?: string;
    schema?: { name: string; schema: Record<string, unknown> };
  } = {},
): Promise<GenerationResult> {
  const { instructions, schema } = options;

  const response = await client().responses.create({
    ...GENERATION_SETTINGS,
    ...(instructions ? { instructions } : {}),
    ...(schema
      ? {
          text: {
            format: {
              type: "json_schema" as const,
              name: schema.name,
              schema: schema.schema,
              strict: true,
            },
          },
        }
      : {}),
    input: prompt,
  });

  const text = response.output_text?.trim() ?? "";

  if (!text) {
    throw new Error("The model returned an empty response.");
  }

  return { text, model: GENERATION_SETTINGS.model };
}

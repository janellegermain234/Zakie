import { saveAsset } from "@/lib/assets-repo";
import {
  ASSET_TYPE,
  buildCrispRequest,
  buildNaivePrompt,
  crispToPrompt,
  type GenerationSource,
} from "@/lib/crisp";
import { generateText } from "@/lib/openai";
import { getProfile } from "@/lib/profiles-repo";

/**
 * Generates brand guidelines, either from the stored profile or from a blank
 * prompt carrying only the business name.
 *
 * The request takes a profile id and which side to generate, and nothing else:
 * both prompts are built fresh from the structured fields here, at request
 * time, so what the browser posts can never become the prompt. Both sides use
 * the same model and the same settings — that is what makes the comparison
 * worth anything. The assembled prompt is never stored; the asset row keeps the
 * output, which side produced it, and the profile version it came from.
 */
export async function POST(request: Request) {
  let profileId: unknown;
  let source: unknown;

  try {
    const body = (await request.json()) as {
      profileId?: unknown;
      source?: unknown;
    };
    profileId = body?.profileId;
    source = body?.source ?? "profile";
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  if (typeof profileId !== "string" || profileId.length === 0) {
    return Response.json({ error: "A profileId is required." }, { status: 400 });
  }

  if (source !== "profile" && source !== "blank") {
    return Response.json(
      { error: "source must be 'profile' or 'blank'." },
      { status: 400 },
    );
  }

  const row = await getProfile(profileId);

  if (!row) {
    return Response.json({ error: "No profile with that id." }, { status: 404 });
  }

  const generationSource: GenerationSource = source;

  // The blank side gets no role and no context — a person typing a one-line
  // prompt writes neither.
  const { prompt, instructions } =
    generationSource === "profile"
      ? (() => {
          const crisp = buildCrispRequest(row.profile);
          return { prompt: crispToPrompt(crisp), instructions: crisp.role };
        })()
      : { prompt: buildNaivePrompt(row.profile), instructions: undefined };

  try {
    const result = await generateText(prompt, instructions);

    const assetId = await saveAsset({
      businessId: row.id,
      type: ASSET_TYPE,
      content: {
        text: result.text,
        source: generationSource,
        model: result.model,
      },
      profileVersion: row.version,
    });

    return Response.json({
      text: result.text,
      model: result.model,
      source: generationSource,
      assetId,
      profileVersion: row.version,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed.";
    return Response.json({ error: message }, { status: 502 });
  }
}

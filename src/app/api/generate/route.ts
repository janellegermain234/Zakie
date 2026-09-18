import { saveAsset } from "@/lib/assets-repo";
import { ASSET_TYPE, buildCrispRequest, crispToPrompt } from "@/lib/crisp";
import { generateText } from "@/lib/openai";
import { getProfile } from "@/lib/profiles-repo";

/**
 * Generates brand guidelines from a stored profile.
 *
 * The request takes a profile id and nothing else: the context block is built
 * fresh from the structured fields here, at request time, so what the browser
 * posts can never become the prompt. The assembled prompt is never stored — the
 * asset row keeps the output and the profile version it came from.
 */
export async function POST(request: Request) {
  let profileId: unknown;

  try {
    const body = await request.json();
    profileId = (body as { profileId?: unknown })?.profileId;
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  if (typeof profileId !== "string" || profileId.length === 0) {
    return Response.json({ error: "A profileId is required." }, { status: 400 });
  }

  const row = await getProfile(profileId);

  if (!row) {
    return Response.json({ error: "No profile with that id." }, { status: 404 });
  }

  const crisp = buildCrispRequest(row.profile);

  try {
    const result = await generateText(crispToPrompt(crisp), crisp.role);

    const assetId = await saveAsset({
      businessId: row.id,
      type: ASSET_TYPE,
      content: { text: result.text, source: "profile", model: result.model },
      profileVersion: row.version,
    });

    return Response.json({
      text: result.text,
      model: result.model,
      assetId,
      profileVersion: row.version,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed.";
    return Response.json({ error: message }, { status: 502 });
  }
}

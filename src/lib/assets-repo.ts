import "server-only";

import type { GenerationSource } from "@/lib/crisp";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Writes to `assets`. Server-only, service role. A row records what was
 * generated, and which version of the profile it was generated from — never
 * the assembled prompt.
 */

export type AssetContent = {
  text: string;
  source: GenerationSource;
  model: string;
};

export async function saveAsset(params: {
  businessId: string;
  type: string;
  content: AssetContent;
  profileVersion: number;
}): Promise<string> {
  const { data, error } = await supabaseAdmin()
    .from("assets")
    .insert({
      business_id: params.businessId,
      type: params.type,
      content: params.content,
      profile_version: params.profileVersion,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Could not save the generated asset: ${error.message}`);
  return (data as { id: string }).id;
}

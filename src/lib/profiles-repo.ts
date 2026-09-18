import "server-only";

import { normalizeProfile, type BusinessProfile, type BusinessProfileRow } from "@/lib/profile";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * All reads and writes for `business_profiles`. Server-only, service role.
 * `version` and `updated_at` are maintained by a database trigger, so nothing
 * here ever sets them.
 */

type RawRow = {
  id: string;
  created_at: string;
  updated_at: string;
  version: number;
  profile: unknown;
};

function toRow(raw: RawRow): BusinessProfileRow {
  return {
    id: raw.id,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    version: raw.version,
    profile: normalizeProfile(raw.profile),
  };
}

export async function listProfiles(): Promise<BusinessProfileRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("business_profiles")
    .select("id, created_at, updated_at, version, profile")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Could not load profiles: ${error.message}`);
  return (data as RawRow[]).map(toRow);
}

export async function getProfile(id: string): Promise<BusinessProfileRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("business_profiles")
    .select("id, created_at, updated_at, version, profile")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load profile: ${error.message}`);
  return data ? toRow(data as RawRow) : null;
}

export async function insertProfile(profile: BusinessProfile): Promise<string> {
  const { data, error } = await supabaseAdmin()
    .from("business_profiles")
    .insert({ profile })
    .select("id")
    .single();

  if (error) throw new Error(`Could not save profile: ${error.message}`);
  return (data as { id: string }).id;
}

export async function updateProfile(
  id: string,
  profile: BusinessProfile,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("business_profiles")
    .update({ profile })
    .eq("id", id);

  if (error) throw new Error(`Could not save profile: ${error.message}`);
}

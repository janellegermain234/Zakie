"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  readProfileForm,
  validateProfile,
  type SaveState,
} from "@/lib/profile-form";
import { insertProfile, updateProfile } from "@/lib/profiles-repo";

/**
 * Saves the intake form. Called from a client component through
 * `useActionState`, so the first argument is the previous state.
 *
 * The form data is untrusted: every field is re-read and re-validated here
 * rather than trusting whatever the browser posted.
 */
export async function saveProfile(
  profileId: string | null,
  _previous: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const profile = readProfileForm(formData);
  const errors = validateProfile(profile);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Some fields need another look.",
      errors,
      values: profile,
    };
  }

  let newId: string | null = null;

  try {
    if (profileId) {
      await updateProfile(profileId, profile);
    } else {
      newId = await insertProfile(profile);
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save profile.",
      errors: {},
      values: profile,
    };
  }

  revalidatePath("/");

  if (newId) {
    // redirect throws, so it stays outside the try block above.
    redirect(`/profiles/${newId}`);
  }

  revalidatePath(`/profiles/${profileId}`);

  return {
    status: "saved",
    message: "Profile saved.",
    errors: {},
    values: profile,
  };
}

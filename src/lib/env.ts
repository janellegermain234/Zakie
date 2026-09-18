import "server-only";

/**
 * Environment access. Values are read from the environment at call time and
 * never hardcoded. Public values are safe to expose to the browser; the rest
 * are server-only secrets.
 */

export const ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
] as const;

export type EnvKey = (typeof ENV_KEYS)[number];

export function readEnv(key: EnvKey): string | undefined {
  // Next.js inlines process.env.X only for literal member access, so the
  // public keys are spelled out rather than looked up dynamically.
  switch (key) {
    case "NEXT_PUBLIC_SUPABASE_URL":
      return process.env.NEXT_PUBLIC_SUPABASE_URL;
    case "NEXT_PUBLIC_SUPABASE_ANON_KEY":
      return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    case "SUPABASE_SERVICE_ROLE_KEY":
      return process.env.SUPABASE_SERVICE_ROLE_KEY;
    case "OPENAI_API_KEY":
      return process.env.OPENAI_API_KEY;
  }
}

export function requireEnv(key: EnvKey): string {
  const value = readEnv(key);
  if (!value) {
    throw new Error(
      `Missing environment variable ${key}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/** Which of the required variables are present, for the status screen. */
export function envPresence(): { key: EnvKey; present: boolean }[] {
  return ENV_KEYS.map((key) => ({ key, present: Boolean(readEnv(key)) }));
}

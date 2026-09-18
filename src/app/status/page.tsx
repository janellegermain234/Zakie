import { envPresence } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type TableCheck = { table: string; ok: boolean; count: number | null; error: string | null };

async function checkTable(table: string): Promise<TableCheck> {
  try {
    const { count, error } = await supabaseAdmin()
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) return { table, ok: false, count: null, error: error.message };
    return { table, ok: true, count: count ?? 0, error: null };
  } catch (error) {
    return {
      table,
      ok: false,
      count: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default async function StatusPage() {
  const env = envPresence();
  const supabaseConfigured =
    env.find((e) => e.key === "NEXT_PUBLIC_SUPABASE_URL")?.present &&
    env.find((e) => e.key === "SUPABASE_SERVICE_ROLE_KEY")?.present;

  const checks = supabaseConfigured
    ? await Promise.all([checkTable("business_profiles"), checkTable("assets")])
    : [];

  const connected = checks.length > 0 && checks.every((c) => c.ok);

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
        Step 1
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Connection status
      </h1>
      <p className="mt-3 text-muted">
        Every read and write runs server-side with the service role key. Row level
        security is on with no policies, so the browser never talks to the database.
      </p>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted">
          Environment
        </h2>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
          {env.map(({ key, present }) => (
            <li
              key={key}
              className="flex items-center justify-between gap-6 px-5 py-4"
            >
              <code className="text-sm">{key}</code>
              <span
                className={`text-sm ${present ? "text-positive" : "text-negative"}`}
              >
                {present ? "set" : "missing"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted">
          Database
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between gap-6 border-b border-border px-5 py-4">
            <span className="text-sm">Supabase</span>
            <span
              className={`text-sm ${connected ? "text-positive" : "text-negative"}`}
            >
              {supabaseConfigured
                ? connected
                  ? "connected"
                  : "not reachable"
                : "not configured"}
            </span>
          </div>
          {supabaseConfigured ? (
            <ul className="divide-y divide-border">
              {checks.map((check) => (
                <li
                  key={check.table}
                  className="flex items-start justify-between gap-6 px-5 py-4"
                >
                  <code className="text-sm">{check.table}</code>
                  <span className="text-right text-sm">
                    {check.ok ? (
                      <span className="text-muted">
                        {check.count} {check.count === 1 ? "row" : "rows"}
                      </span>
                    ) : (
                      <span className="text-negative">{check.error}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-4 text-sm text-muted">
              Fill in <code>.env.local</code> from <code>.env.example</code>, then
              reload this page.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

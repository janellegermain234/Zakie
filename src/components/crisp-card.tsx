import { DESIGN_STANDARDS } from "@/lib/design-standards";
import type { CrispRequest } from "@/lib/crisp";

/**
 * The five labelled components of the request, shown before anything is sent.
 *
 * Specifics renders the design standards in full from the same array the
 * request is built from, so the card is not a summary of the request — it is
 * the request.
 */

function Component({
  letter,
  name,
  description,
  children,
}: {
  letter: string;
  name: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-border py-8 md:grid-cols-[13rem_1fr]">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="flex size-7 items-center justify-center rounded-md bg-accent-soft text-sm font-medium text-accent">
            {letter}
          </span>
          <h3 className="text-sm font-medium uppercase tracking-[0.16em]">
            {name}
          </h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Body({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
      {text}
    </p>
  );
}

export function CrispCard({ crisp }: { crisp: CrispRequest }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-8 pb-2">
      <div className="flex flex-wrap items-baseline justify-between gap-3 pt-8 pb-6">
        <h2 className="text-lg font-medium tracking-tight">
          The request, before it is sent
        </h2>
        <p className="text-sm text-muted">
          Context · Role · Instruction · Specifics · Parameters
        </p>
      </div>

      <Component
        letter="C"
        name="Context"
        description="The stored profile, rendered from its structured fields. Empty fields are left out."
      >
        {crisp.context ? (
          <Body text={crisp.context} />
        ) : (
          <p className="text-sm text-negative">
            This profile has no filled fields yet.
          </p>
        )}
      </Component>

      <Component
        letter="R"
        name="Role"
        description="Who the model is asked to be."
      >
        <Body text={crisp.role} />
      </Component>

      <Component
        letter="I"
        name="Instruction"
        description="The single job to do."
      >
        <Body text={crisp.instruction} />
      </Component>

      <Component
        letter="S"
        name="Specifics"
        description="Fixed design standards. The same for every business, every generation, and not editable here."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {DESIGN_STANDARDS.map((standard) => (
            <div
              key={standard.area}
              className="rounded-lg border border-border bg-surface-raised p-5"
            >
              <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
                {standard.area}
              </h4>
              <ul className="mt-3 space-y-2">
                {standard.rules.map((rule) => (
                  <li
                    key={rule}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span aria-hidden className="text-accent">
                      ·
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Component>

      <Component
        letter="P"
        name="Parameters"
        description="The shape and length of the answer."
      >
        <Body text={crisp.parameters} />
      </Component>
    </div>
  );
}

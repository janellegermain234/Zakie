import {
  safeHex,
  type BrandSystem,
  type ColourRole,
} from "@/lib/brand-system";

/**
 * Renders a generated brand system as a document a designer would hand over:
 * colours as swatches, the type scale at its real sizes, example headlines set
 * as headlines, dos and don'ts in two columns.
 *
 * Everything on the page is a value the model returned. Nothing is invented
 * here, and the only thing guarded is the hex, which drives a style attribute.
 */

const ROLE_ORDER: ColourRole[] = ["dominant", "secondary", "accent", "neutral"];

function Section({
  index,
  title,
  note,
  children,
}: {
  index: number;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-10">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-xs text-muted">
          {String(index).padStart(2, "0")}
        </span>
        <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          {title}
        </h3>
        {note ? <p className="text-xs text-muted">{note}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Swatch({
  colour,
}: {
  colour: BrandSystem["colour_system"]["palette"][number];
}) {
  const hex = safeHex(colour.hex);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div
        className="h-20 w-full"
        style={hex ? { backgroundColor: hex } : undefined}
      />
      <div className="space-y-1 border-t border-border bg-surface-raised p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium">{colour.name}</p>
          <code className="font-mono text-xs uppercase text-muted">
            {colour.hex}
          </code>
        </div>
        <p className="text-xs uppercase tracking-[0.12em] text-accent">
          {colour.role}
        </p>
        <p className="text-xs leading-relaxed text-muted">{colour.usage}</p>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  );
}

export function BrandDocument({
  system,
  businessName,
}: {
  system: BrandSystem;
  businessName: string;
}) {
  const palette = [...system.colour_system.palette].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role),
  );

  return (
    <div className="@container space-y-14">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          {businessName} — brand guidelines
        </p>
        <p className="mt-5 text-2xl leading-snug font-medium tracking-tight text-foreground">
          {system.brand_foundation.positioning_line}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {system.brand_foundation.personality.map((word) => (
            <span
              key={word}
              className="rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 text-sm"
            >
              {word}
            </span>
          ))}
        </div>
      </header>

      <Section index={1} title="Brand foundation" note="Messaging pillars">
        <div className="grid gap-4 @xl:grid-cols-3">
          {system.brand_foundation.messaging_pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-lg border border-border bg-surface-raised p-5"
            >
              <h4 className="text-sm font-medium">{pillar.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        index={2}
        title="Colour system"
        note={system.colour_system.split}
      >
        <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-3">
          {palette.map((colour) => (
            <Swatch key={`${colour.name}-${colour.hex}`} colour={colour} />
          ))}
        </div>
        <p className="mt-5 text-sm text-muted">
          Body text contrast:{" "}
          <span className="text-foreground">
            {system.colour_system.body_contrast_ratio}
          </span>
        </p>
      </Section>

      <Section index={3} title="Typography">
        <div className="grid gap-4 @md:grid-cols-2">
          <Fact
            label="Display"
            value={`${system.typography.display_typeface.name} · ${system.typography.display_typeface.weights} — ${system.typography.display_typeface.usage}`}
          />
          <Fact
            label="Body"
            value={`${system.typography.body_typeface.name} · ${system.typography.body_typeface.weights} — ${system.typography.body_typeface.usage}`}
          />
        </div>

        <div className="mt-6 divide-y divide-border rounded-lg border border-border">
          {system.typography.scale.map((step) => (
            <div key={step.step} className="p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">
                  {step.step}
                </p>
                <code className="font-mono text-xs text-muted">
                  {step.size_px}/{step.line_height_px}px · {step.weight}
                </code>
              </div>
              <p
                className="mt-3 overflow-hidden text-foreground"
                style={{
                  fontSize: `${step.size_px}px`,
                  lineHeight: `${step.line_height_px}px`,
                  fontWeight: Number.parseInt(step.weight, 10) || undefined,
                }}
              >
                {businessName}
              </p>
              <p className="mt-2 text-xs text-muted">{step.usage}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section index={4} title="Spacing and layout">
        <div className="space-y-3">
          {system.spacing_and_layout.scale_px.map((value) => (
            <div key={value} className="flex items-center gap-4">
              <code className="w-14 shrink-0 font-mono text-xs text-muted">
                {value}px
              </code>
              <div
                className="h-3 rounded-sm bg-accent/70"
                style={{ width: `${Math.min(value, 160)}px` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 @md:grid-cols-2">
          <Fact label="Grid" value={system.spacing_and_layout.grid} />
          <Fact label="Margins" value={system.spacing_and_layout.margins} />
        </div>
        <ul className="mt-5 space-y-2">
          {system.spacing_and_layout.rules.map((rule) => (
            <li key={rule} className="flex gap-2 text-sm leading-relaxed text-muted">
              <span aria-hidden className="text-accent">
                ·
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={5} title="Logo usage">
        <div className="grid gap-4 @md:grid-cols-2">
          <Fact label="Clear space" value={system.logo_usage.clear_space} />
          <Fact
            label="Minimum size"
            value={`${system.logo_usage.minimum_size_px}px`}
          />
        </div>
        <ul className="mt-5 space-y-2">
          {system.logo_usage.placement_rules.map((rule) => (
            <li key={rule} className="flex gap-2 text-sm leading-relaxed text-muted">
              <span aria-hidden className="text-accent">
                ·
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={6} title="Voice and copy">
        <div className="space-y-4">
          {system.voice_and_copy.headlines.map((headline) => (
            <p
              key={headline}
              className="text-2xl leading-tight font-medium tracking-tight text-foreground"
            >
              {headline}
            </p>
          ))}
        </div>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-muted">
          {system.voice_and_copy.subhead}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {system.voice_and_copy.calls_to_action.map((cta) => (
            <span
              key={cta}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white"
            >
              {cta}
            </span>
          ))}
        </div>
      </Section>

      <Section index={7} title="Dos and don'ts">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border @md:grid-cols-2">
          <p className="bg-surface-raised px-5 py-3 text-xs uppercase tracking-[0.12em] text-positive">
            Do
          </p>
          <p className="hidden bg-surface-raised px-5 py-3 text-xs uppercase tracking-[0.12em] text-negative @md:block">
            Don&rsquo;t
          </p>
          {system.dos_and_donts.map((pair) => (
            <div key={pair.do} className="contents">
              <p className="bg-surface px-5 py-4 text-sm leading-relaxed text-foreground">
                {pair.do}
              </p>
              <p className="bg-surface px-5 py-4 text-sm leading-relaxed text-muted">
                <span className="mr-2 text-xs uppercase tracking-[0.12em] text-negative @md:hidden">
                  Don&rsquo;t
                </span>
                {pair.dont}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

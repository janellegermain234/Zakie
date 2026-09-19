import { BrandDocument } from "@/components/brand-document";
import { FormattedText } from "@/components/formatted-text";
import { parseBrandSystem } from "@/lib/brand-system";

/**
 * Renders whatever the model returned. A structured brand system becomes a
 * designed document; anything else — the blank-prompt side, or a structured
 * response that somehow came back malformed — falls back to formatted text.
 */
export function GeneratedOutput({
  text,
  businessName,
}: {
  text: string;
  businessName: string;
}) {
  const system = parseBrandSystem(text);

  return system ? (
    <BrandDocument system={system} businessName={businessName} />
  ) : (
    <FormattedText text={text} />
  );
}

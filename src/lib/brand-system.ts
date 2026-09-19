/**
 * The shape of a generated brand system.
 *
 * The profile side asks the model for structured output against this schema so
 * the renderer can style each part — swatches as swatches, the type scale at
 * its real sizes. The schema is the contract; the stored asset keeps whatever
 * the model returned, unaltered.
 */

export const COLOUR_ROLES = [
  "dominant",
  "secondary",
  "accent",
  "neutral",
] as const;

export type ColourRole = (typeof COLOUR_ROLES)[number];

export type BrandSystem = {
  brand_foundation: {
    positioning_line: string;
    personality: string[];
    messaging_pillars: { title: string; description: string }[];
  };
  colour_system: {
    split: string;
    body_contrast_ratio: string;
    palette: {
      name: string;
      role: ColourRole;
      hex: string;
      usage: string;
    }[];
  };
  typography: {
    display_typeface: { name: string; weights: string; usage: string };
    body_typeface: { name: string; weights: string; usage: string };
    scale: {
      step: string;
      size_px: number;
      weight: string;
      line_height_px: number;
      usage: string;
    }[];
  };
  spacing_and_layout: {
    scale_px: number[];
    grid: string;
    margins: string;
    rules: string[];
  };
  logo_usage: {
    clear_space: string;
    minimum_size_px: number;
    placement_rules: string[];
  };
  voice_and_copy: {
    headlines: string[];
    subhead: string;
    calls_to_action: string[];
  };
  dos_and_donts: { do: string; dont: string }[];
};

/**
 * JSON Schema sent with the request. Structured Outputs in strict mode supports
 * a subset of JSON Schema — every property is required, no additional
 * properties, and no count constraints — so the counts live in the
 * descriptions and in the Parameters block, where the model reads them.
 */
export const BRAND_SYSTEM_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "brand_foundation",
    "colour_system",
    "typography",
    "spacing_and_layout",
    "logo_usage",
    "voice_and_copy",
    "dos_and_donts",
  ],
  properties: {
    brand_foundation: {
      type: "object",
      additionalProperties: false,
      required: ["positioning_line", "personality", "messaging_pillars"],
      properties: {
        positioning_line: {
          type: "string",
          description: "One sentence placing this business against its market.",
        },
        personality: {
          type: "array",
          description: "Exactly three single words.",
          items: { type: "string" },
        },
        messaging_pillars: {
          type: "array",
          description: "Exactly three pillars.",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "description"],
            properties: {
              title: { type: "string", description: "Two to four words." },
              description: {
                type: "string",
                description: "One sentence, specific to this business.",
              },
            },
          },
        },
      },
    },
    colour_system: {
      type: "object",
      additionalProperties: false,
      required: ["split", "body_contrast_ratio", "palette"],
      properties: {
        split: {
          type: "string",
          description:
            "How the palette divides, stating the 60/30/10 split in this brand's own terms.",
        },
        body_contrast_ratio: {
          type: "string",
          description:
            "The measured contrast ratio of body text on its background, e.g. '7.1:1 on #FBF9F4'. At least 4.5:1.",
        },
        palette: {
          type: "array",
          description:
            "Six to nine colours covering dominant, secondary, accent and neutrals.",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["name", "role", "hex", "usage"],
            properties: {
              name: {
                type: "string",
                description: "A named role, e.g. 'Crust Brown'.",
              },
              role: { type: "string", enum: COLOUR_ROLES },
              hex: {
                type: "string",
                description: "Six-digit hex including the hash, e.g. #2F2A25.",
              },
              usage: {
                type: "string",
                description: "Where this colour is used, in one short phrase.",
              },
            },
          },
        },
      },
    },
    typography: {
      type: "object",
      additionalProperties: false,
      required: ["display_typeface", "body_typeface", "scale"],
      properties: {
        display_typeface: {
          type: "object",
          additionalProperties: false,
          required: ["name", "weights", "usage"],
          properties: {
            name: {
              type: "string",
              description: "A real, named typeface, e.g. 'GT Sectra Display'.",
            },
            weights: { type: "string", description: "e.g. '500, 700'." },
            usage: { type: "string" },
          },
        },
        body_typeface: {
          type: "object",
          additionalProperties: false,
          required: ["name", "weights", "usage"],
          properties: {
            name: { type: "string", description: "A real, named typeface." },
            weights: { type: "string" },
            usage: { type: "string" },
          },
        },
        scale: {
          type: "array",
          description: "Exactly five steps, largest first.",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["step", "size_px", "weight", "line_height_px", "usage"],
            properties: {
              step: {
                type: "string",
                description: "e.g. 'Display', 'H1', 'Body', 'Caption'.",
              },
              size_px: { type: "number" },
              weight: { type: "string" },
              line_height_px: { type: "number" },
              usage: { type: "string" },
            },
          },
        },
      },
    },
    spacing_and_layout: {
      type: "object",
      additionalProperties: false,
      required: ["scale_px", "grid", "margins", "rules"],
      properties: {
        scale_px: {
          type: "array",
          description: "The eight-point scale as actual numbers.",
          items: { type: "number" },
        },
        grid: { type: "string", description: "The grid rule, concretely." },
        margins: {
          type: "string",
          description: "Margins on all four edges, in pixels.",
        },
        rules: {
          type: "array",
          description: "Two to four layout rules using the values above.",
          items: { type: "string" },
        },
      },
    },
    logo_usage: {
      type: "object",
      additionalProperties: false,
      required: ["clear_space", "minimum_size_px", "placement_rules"],
      properties: {
        clear_space: {
          type: "string",
          description: "As a multiple of logo height, e.g. '0.5x logo height'.",
        },
        minimum_size_px: { type: "number" },
        placement_rules: {
          type: "array",
          description: "Two to four rules, including one placement convention.",
          items: { type: "string" },
        },
      },
    },
    voice_and_copy: {
      type: "object",
      additionalProperties: false,
      required: ["headlines", "subhead", "calls_to_action"],
      properties: {
        headlines: {
          type: "array",
          description:
            "Exactly three written headlines for this business, four to eight words each, under fifty characters.",
          items: { type: "string" },
        },
        subhead: {
          type: "string",
          description: "One sentence, under twenty-five words.",
        },
        calls_to_action: {
          type: "array",
          description: "Exactly two, verb first, two to four words.",
          items: { type: "string" },
        },
      },
    },
    dos_and_donts: {
      type: "array",
      description:
        "At least six pairs, drawn from this business's tone rules and must-avoid list.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["do", "dont"],
        properties: {
          do: { type: "string" },
          dont: { type: "string" },
        },
      },
    },
  },
} as const;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Reads a model response back into a BrandSystem, or returns null so the caller
 * can fall back to rendering it as text. Structured output makes a malformed
 * body unlikely, not impossible.
 */
export function parseBrandSystem(raw: string): BrandSystem | null {
  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<BrandSystem>;

  const hasShape =
    typeof candidate.brand_foundation?.positioning_line === "string" &&
    isStringArray(candidate.brand_foundation?.personality) &&
    Array.isArray(candidate.brand_foundation?.messaging_pillars) &&
    Array.isArray(candidate.colour_system?.palette) &&
    Array.isArray(candidate.typography?.scale) &&
    typeof candidate.typography?.body_typeface?.name === "string" &&
    Array.isArray(candidate.spacing_and_layout?.scale_px) &&
    typeof candidate.logo_usage?.clear_space === "string" &&
    isStringArray(candidate.voice_and_copy?.headlines) &&
    Array.isArray(candidate.dos_and_donts);

  return hasShape ? (candidate as BrandSystem) : null;
}

/** Guards the swatch background against anything that is not a hex colour. */
export function safeHex(value: string): string | null {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? value.trim() : null;
}

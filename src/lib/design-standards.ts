/**
 * The fixed design standards every generation must satisfy.
 *
 * This is the single definition. The CRISP card shows these to the user as the
 * Specifics component, and the request sent to the model is built from the same
 * array — so what is promised on screen is exactly what is asked for. They are
 * not user-editable and are not stored per profile.
 */

export type DesignStandard = {
  area: string;
  rules: string[];
};

export const DESIGN_STANDARDS: DesignStandard[] = [
  {
    area: "Copy",
    rules: [
      "Headline of four to eight words, one idea, under fifty characters.",
      "Subhead of one sentence, under twenty-five words.",
      "Body in short paragraphs.",
      "One call to action per view, verb first, two to four words.",
      "Active voice throughout.",
      "No superlatives without evidence.",
    ],
  },
  {
    area: "Hierarchy",
    rules: [
      "No more than three type sizes in one composition.",
      "Two typefaces maximum.",
      "One emphasis device per heading.",
      "Body line length of forty-five to seventy-five characters.",
    ],
  },
  {
    area: "Spacing",
    rules: [
      "A single spacing scale in multiples of eight.",
      "Space between related elements always smaller than space between groups.",
      "Consistent margins on all four edges.",
    ],
  },
  {
    area: "Colour",
    rules: [
      "Dominant, secondary and accent colours at roughly 60/30/10.",
      "The accent is reserved for action and emphasis, never decoration.",
      "Body text contrast of at least 4.5 to 1.",
    ],
  },
  {
    area: "Logo",
    rules: [
      "Clear space on all sides of at least half the logo height.",
      "A stated minimum size.",
      "Never placed over busy imagery.",
      "One placement convention held across assets.",
    ],
  },
  {
    area: "Relationships",
    rules: [
      "The call to action sits in the same visual group as the claim it follows.",
      "Anything paired in meaning is paired in position.",
    ],
  },
];

/** The same standards as the plain text that goes into the request. */
export function designStandardsToText(): string {
  return DESIGN_STANDARDS.map(
    (standard) =>
      `${standard.area}:\n${standard.rules.map((rule) => `- ${rule}`).join("\n")}`,
  ).join("\n\n");
}

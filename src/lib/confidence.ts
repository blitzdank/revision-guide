export type ConfidenceLevel = "not_started" | "weak" | "getting_there" | "confident";

export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  not_started: "Not started",
  weak: "Weak",
  getting_there: "Getting there",
  confident: "Confident",
};

// Dot colour per level (section 9). "not_started" uses --muted since there is
// no --bg-safe neutral token defined for it in the brief's palette.
export const CONFIDENCE_DOT_CLASS: Record<ConfidenceLevel, string> = {
  not_started: "bg-muted",
  weak: "bg-wrong",
  getting_there: "bg-yellow-strong",
  confident: "bg-correct",
};

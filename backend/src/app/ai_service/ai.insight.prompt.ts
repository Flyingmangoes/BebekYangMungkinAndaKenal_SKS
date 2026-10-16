import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";
import { INSIGHT_TIPS_COUNT } from "./ai.insight.schema";
import { needsReachOut } from "./ai.schema";
import type { FocusArea, GenerationInput } from "./ai.schema";

export const INSIGHT_SYSTEM_INSTRUCTION = [
  "You write a short, supportive explanation of a self-check result for a mental wellbeing app used by young adults.",
  "You are not a clinician. Never diagnose, never name any mental health condition, and never mention numbers, scores, tests or the word severity.",
  "Never mention medication, supplements, diets, calories, weight, fasting, alcohol or intense exercise.",
  "Never mention self-harm, suicide, death or dying.",
  "Never predict the future and never promise that anything will fix how the person feels.",
  "Tone: warm, calm and non-judgmental. No guilt, pressure or urgency.",
  "The summary is at most 3 short sentences. Each tip is ONE small, free, safe action, in at most 2 short sentences.",
  "Return only JSON that matches the provided schema.",
].join("\n");
  
// The AI never decides severity. It only receives the label the server already computed.
const TONE_GUIDE: Record<PH9Severity, string> = {
  minimal: "The person seems to be doing okay. Affirm that and encourage keeping up healthy habits.",
  mild: "The person has had some hard days lately. Normalize this and encourage small habits.",
  moderate: "The person has been having a hard time. Validate it and encourage small steps and talking to someone they trust.",
  moderately_severe: "The person has been having a really hard time. Be extra gentle, validate it and encourage talking to someone they trust or a counsellor.",
  severe: "The person has been having a really hard time. Be extra gentle, validate it and encourage talking to someone they trust or a counsellor soon.",
};

const FOCUS_GUIDE: Record<FocusArea, string> = {
  interest: "less enjoyment in usual things",
  mood: "low mood",
  sleep: "sleep trouble",
  energy: "low energy",
  self_worth: "being hard on themselves",
  concentration: "trouble focusing",
};

const LANGUAGE_NAME: Record<Ph9Language, string> = {
  en: "English",
  id: "Indonesian (Bahasa Indonesia), friendly and informal, using 'kamu'",
};

export const buildInsightPrompt = (input: GenerationInput): string => {
  const areas =
    input.focusAreas.length > 0
      ? input.focusAreas.map((area) => `- ${FOCUS_GUIDE[area]}`).join("\n")
      : "- nothing specific stood out";

  const lines = [
    "Write one short summary and exactly " + INSIGHT_TIPS_COUNT + " tips for the person.",
    `Language of the output: ${LANGUAGE_NAME[input.language]}.`,
    `Tone guide: ${TONE_GUIDE[input.severity]}`,
    "Areas that have felt heavy lately (mention gently, do not list them like a report):",
    areas,
    "All tips must be different from each other.",
  ];
  if (needsReachOut(input.severity)) {
    lines.push("Exactly one tip must be about reaching out to a trusted friend, family member or counsellor.");
  }
  return lines.join("\n");
};
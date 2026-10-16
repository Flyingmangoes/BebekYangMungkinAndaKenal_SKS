import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";
import { QUESTS_PER_LEVEL, needsReachOut } from "./ai.schema";
import type { EnergyLevel, FocusArea, GenerationInput } from "./ai.schema";

export const SYSTEM_INSTRUCTION = [
  "You write small daily self-care quests for a mental wellbeing app used by young adults.",
  "You are not a clinician. Never diagnose, never name any mental health condition, and never mention scores, tests or severity.",
  "Never mention medication, supplements, diets, calories, weight, fasting, alcohol or intense exercise.",
  "Never mention self-harm, suicide, death or dying.",
  "Each quest is ONE concrete, safe action that can be done at home today, for free, without equipment.",
  "Tone: warm, calm and encouraging. Never use guilt, pressure or urgency. Do not promise that a quest will fix anything.",
  "Write each title in at most 6 words and each description in at most 2 short sentences.",
  "Return only JSON that matches the provided schema.",
].join("\n");

const EFFORT_GUIDE: Record<PH9Severity, string> = {
  minimal: "Light, enjoyable habits. Up to 15 minutes each.",
  mild: "Small, easy habits. Up to 10 minutes each.",
  moderate: "Very small, low-effort steps. Up to 10 minutes each.",
  moderately_severe: "Tiny steps only. Up to 5 minutes each, minimal effort.",
  severe: "Tiny steps only. Up to 5 minutes each, minimal effort.",
};

const ENERGY_GUIDE: Record<EnergyLevel, string> = {
  low: "gentle, restful quests that can be done sitting or lying down, such as breathing, calm music, a one-sentence note or a short message to someone",
  medium: "calm quests with a little light activity, such as a short walk or a small creative moment",
  high: "more active or creative quests, such as a walk outside, tidying one small spot or making something, while staying gentle and safe",
};

const FOCUS_GUIDE: Record<FocusArea, string> = {
  interest: "gently reconnecting with something small the person used to enjoy",
  mood: "gentle mood support, such as daylight, calm music or writing one kind sentence",
  sleep: "a calm wind-down routine before bed (no sleep aids or supplements)",
  energy: "very light movement or short rest breaks, never intense exercise",
  self_worth: "noticing one thing that went okay today and kind self-talk",
  concentration: "short single-task focus sessions with breaks",
};

const LANGUAGE_NAME: Record<Ph9Language, string> = {
  en: "English",
  id: "Indonesian (Bahasa Indonesia), friendly and informal, using 'kamu'",
};

export const buildUserPrompt = (input: GenerationInput): string => {
  const themes =
    input.focusAreas.length > 0
      ? input.focusAreas.map((area) => `- ${FOCUS_GUIDE[area]}`).join("\n")
      : "- general wellbeing: simple calming or grounding habits";

  const lines = [
    `Create ${QUESTS_PER_LEVEL} quest(s) for EACH of three energy levels: low, medium and high. All quests must be different from each other.`,
    `Language of the output: ${LANGUAGE_NAME[input.language]}.`,
    `Effort limit (applies to every energy level): ${EFFORT_GUIDE[input.severity]}`,
    "The energy level changes the TYPE of quest, never the effort limit above.",
    `low: ${ENERGY_GUIDE.low}`,
    `medium: ${ENERGY_GUIDE.medium}`,
    `high: ${ENERGY_GUIDE.high}`,
  ];
  if (needsReachOut(input.severity)) {
    lines.push(
      'Exactly one quest in the "low" level must be about reaching out to someone trusted (a friend, family member or counsellor).',
    );
  }
  lines.push("Themes (spread them across the levels where possible):", themes);
  return lines.join("\n");
};
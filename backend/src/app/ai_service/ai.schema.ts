import { z } from "zod";
import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";

export const FOCUS_AREAS = [
  "interest",
  "mood",
  "sleep",
  "energy",
  "self_worth",
  "concentration",
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

export const ENERGY_LEVELS = ["low", "medium", "high"] as const;
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];

// One Gemini call returns this many quests for EACH energy level (3 levels x 1 = 3 quests).
export const QUESTS_PER_LEVEL = 1;

export interface QuestRequest {
  severity: PH9Severity;
  selfHarmFlag: boolean;
  language: Ph9Language;
  focusAreas: FocusArea[];
}

// What the generator may see. selfHarmFlag is excluded on purpose.
export type GenerationInput = Omit<QuestRequest, "selfHarmFlag">;

export const needsReachOut = (severity: PH9Severity): boolean =>
  severity === "moderate" || severity === "moderately_severe" || severity === "severe";

// Tighter than the Quest table (200/1000): short quests are easier to act on.
export const generatedQuestSchema = z.strictObject({
  questTitle: z.string().trim().min(3).max(80),
  questDescription: z.string().trim().min(10).max(400),
});

const questsForLevel = z.array(generatedQuestSchema).length(QUESTS_PER_LEVEL);

export const generatedQuestSetSchema = z.strictObject({
  low: questsForLevel,
  medium: questsForLevel,
  high: questsForLevel,
});

export type GeneratedQuest = z.infer<typeof generatedQuestSchema>;
export type QuestsByEnergy = Record<EnergyLevel, GeneratedQuest[]>;
export type QuestSource = "ai" | "fallback";

export type QuestSetPlan =
  | { kind: "quests"; source: QuestSource; quests: QuestsByEnergy }
  | { kind: "crisis" };
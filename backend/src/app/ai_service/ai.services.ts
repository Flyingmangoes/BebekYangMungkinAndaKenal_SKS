import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { Ph9SubmissionDetail } from "../ph9_service/ph9.services";
import { ENERGY_LEVELS, generatedQuestSetSchema } from "./ai.schema";
import type { FocusArea, QuestRequest, QuestSetPlan } from "./ai.schema";
import type { QuestGenerator } from "./ai.provider";
import { isSafeQuest, pickFallbackSet } from "./ai.safety.fallback";

export interface AIServiceLogger {
  warn(message: string, meta?: Record<string, unknown>): void;
}

// PHQ-9 item number -> theme. Items 5 (appetite), 8 (psychomotor) and 9 (self-harm)
// are deliberately not mapped: quests for them risk unsafe advice or aren't actionable.
const THEME_BY_ITEM: Partial<Record<number, FocusArea>> = {
  1: "interest",
  2: "mood",
  3: "sleep",
  4: "energy",
  6: "self_worth",
  7: "concentration",
};
const FOCUS_MIN_ANSWER = 2; // "more than half the days"

export interface QuestRequestOptions {
  language: Ph9Language;
}

// Pure mapper: a stored PH9 result -> the minimal request the AI layer is allowed to see.
export const toQuestRequest = (
  detail: Ph9SubmissionDetail,
  { language }: QuestRequestOptions,
): QuestRequest => ({
  severity: detail.severity,
  selfHarmFlag: detail.selfHarmFlag,
  language,
  focusAreas: detail.answers
    .filter((a) => a.answerValue >= FOCUS_MIN_ANSWER)
    .flatMap((a) => {
      const theme = THEME_BY_ITEM[a.questionIndex];
      return theme ? [theme] : [];
    }),
});

export class AIService {
  constructor(
    private readonly generator: QuestGenerator | null, // null = no API key: fallback only
    private readonly logger: AIServiceLogger,
  ) {}

  async planQuestSet(request: QuestRequest): Promise<QuestSetPlan> {
    // 1. Safety gate. The flag never leaves this method.
    const { selfHarmFlag, ...input } = request;
    if (selfHarmFlag) return { kind: "crisis" };

    // 2. AI generation, 3. validation. Anything wrong falls through to the fallback.
    if (this.generator) {
      try {
        const raw = await this.generator.generate(input);
        const parsed = generatedQuestSetSchema.safeParse(raw);
        if (!parsed.success) {
          this.logger.warn("AI quest output failed schema validation");
        } else {
          const quests = parsed.data;
          const all = ENERGY_LEVELS.flatMap((level) => quests[level]);
          const distinct = new Set(all.map((q) => q.questTitle.toLowerCase())).size === all.length;
          if (distinct && all.every(isSafeQuest)) return { kind: "quests", source: "ai", quests };
          this.logger.warn("AI quest output rejected by content filter or duplicates");
        }
      } catch (error) {
        const status =
          typeof error === "object" && error !== null && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;
        // reason + status only: never log prompts, outputs or user data
        this.logger.warn("AI quest generation failed", {
          reason: error instanceof Error ? error.name : "unknown",
          status,
        });
      }
    }

    // 4. Curated fallback
    return { kind: "quests", source: "fallback", quests: pickFallbackSet(input) };
  }
}
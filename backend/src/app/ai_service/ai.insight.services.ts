import { generatedInsightSchema } from "./ai.insight.schema";
import type { InsightPlan } from "./ai.insight.schema";
import type { InsightGenerator } from "./ai.insight.provider";
import { isSafeInsight, pickFallbackInsight } from "./ai.insight.fallback";
import type { AIServiceLogger } from "./ai.services";
import type { QuestRequest } from "./ai.schema";

// Severity is computed by calculatePH9Result and passed in. This service never scores anything.
// Build the request with toQuestRequest(detail, { language }).
export class InsightAIService {
  constructor(
    private readonly generator: InsightGenerator | null, // null = no API key: fallback only
    private readonly logger: AIServiceLogger,
  ) {}

  async planInsight(request: QuestRequest): Promise<InsightPlan> {
    // 1. Safety gate. The flag never leaves this method.
    const { selfHarmFlag, ...input } = request;
    if (selfHarmFlag) return { kind: "crisis" };

    // 2. AI generation, 3. validation. Anything wrong falls through to the fallback.
    if (this.generator) {
      try {
        const raw = await this.generator.generate(input);
        const parsed = generatedInsightSchema.safeParse(raw);
        if (!parsed.success) {
          this.logger.warn("AI insight output failed schema validation");
        } else if (!isSafeInsight(parsed.data)) {
          this.logger.warn("AI insight output rejected by content filter");
        } else {
          return { kind: "insight", source: "ai", insight: parsed.data };
        }
      } catch (error) {
        const status =
          typeof error === "object" && error !== null && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;
        // reason + status only: never log prompts, outputs or user data
        this.logger.warn("AI insight generation failed", {
          reason: error instanceof Error ? error.name : "unknown",
          status,
        });
      }
    }

    // 4. Curated fallback
    return {
      kind: "insight",
      source: "fallback",
      insight: pickFallbackInsight(input.severity, input.language),
    };
  }
}
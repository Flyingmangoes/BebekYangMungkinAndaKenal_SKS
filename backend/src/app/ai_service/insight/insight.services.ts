import { SuggestionError } from "../../../error/exception";
import type { Ph9Language } from "../../ph9_service/ph9.schema";
import type { Ph9Service } from "../../ph9_service/ph9.services";
import type { PH9Severity } from "../../ph9_service/ph9.scoring";
import type { GeneratedInsight, InsightSource } from "../ai.insight.schema";
import type { InsightAIService } from "../ai.insight.services";
import { toQuestRequest } from "../ai.services";
import type { CachedInsight, InsightCache } from "./insight.cache";

export type InsightResult =
  | { kind: "crisis" }
  | {
      kind: "insight";
      source: InsightSource;
      severity: PH9Severity;
      insight: GeneratedInsight;
      generatedAt: Date;
    };

export class InsightService {
  private readonly inflight = new Map<string, Promise<InsightResult>>();

  constructor(
    private readonly ph9Service: Ph9Service,
    private readonly aiService: InsightAIService,
    private readonly cache: InsightCache,
    private readonly fallbackRetryMs: number = 20_000,
  ) {}

  // The server decides what the insight is based on. The client never sends severity.
  async getCurrent(userId: string, language: Ph9Language): Promise<InsightResult> {
    const latest = (await this.ph9Service.getHistory(userId, { limit: 1 })).items[0];
    if (!latest) throw new SuggestionError("PH9_REQUIRED");

    const cached = await this.cache.get(userId);
    if (cached && cached.submissionId === latest.submissionId && cached.language === language) {
      // A fallback insight means Gemini failed last time: retry it once the wait is over.
      const waiting = Date.now() - cached.generatedAt < this.fallbackRetryMs;
      if (cached.source === "ai" || waiting) return this.present(cached);
    }

    // Concurrent calls (React StrictMode, double taps) share one Gemini request.
    const key = `${userId}:${language}`;
    const running = this.inflight.get(key);
    if (running) return running;

    const generation = this.generate(userId, language, latest.submissionId, latest.severity).finally(
      () => this.inflight.delete(key),
    );
    this.inflight.set(key, generation);
    return generation;
  }

  private async generate(
    userId: string,
    language: Ph9Language,
    submissionId: string,
    severity: PH9Severity,
  ): Promise<InsightResult> {
    const detail = await this.ph9Service.getSubmission(userId, submissionId);
    const plan = await this.aiService.planInsight(toQuestRequest(detail, { language }));

    if (plan.kind === "crisis") {
      await this.cache.delete(userId); // never cache anything for a crisis result
      return { kind: "crisis" };
    }

    const entry: CachedInsight = {
      submissionId,
      language,
      severity,
      source: plan.source,
      insight: plan.insight,
      generatedAt: Date.now(),
    };
    await this.cache.set(userId, entry);
    return this.present(entry);
  }

  private present(entry: CachedInsight): InsightResult {
    return {
      kind: "insight",
      source: entry.source,
      severity: entry.severity,
      insight: entry.insight,
      generatedAt: new Date(entry.generatedAt),
    };
  }
}
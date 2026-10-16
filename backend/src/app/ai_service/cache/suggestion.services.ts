import { SuggestionError } from "../../../error/exception";
import type { Ph9Language } from "../../ph9_service/ph9.schema";
import type { Ph9Service } from "../../ph9_service/ph9.services";
import type { QuestSource, QuestsByEnergy } from "../ai.schema";
import { toQuestRequest } from "../ai.services";
import type { AIService } from "../ai.services";
import type { CachedQuestSet, QuestSetCache } from "./suggestion.cache";

export type SuggestionResult =
  | { kind: "crisis" }
  | {
      kind: "quests";
      source: QuestSource;
      quests: QuestsByEnergy;
      generatedAt: Date;
      refreshAvailableAt: Date;
    };

export class QuestSuggestionService {
  private readonly inflight = new Map<string, Promise<SuggestionResult>>();

  constructor(
    private readonly ph9Service: Ph9Service,
    private readonly aiService: AIService,
    private readonly cache: QuestSetCache,
    private readonly refreshCooldownMs: number = 20_000,
  ) {}

  // Quest window opened: the stored set if it's still valid, otherwise generate.
  getCurrent(userId: string, language: Ph9Language): Promise<SuggestionResult> {
    return this.resolve(userId, language, false);
  }

  // Refresh button: always a new generation (after the cooldown).
  refresh(userId: string, language: Ph9Language): Promise<SuggestionResult> {
    return this.resolve(userId, language, true);
  }

  private async resolve(
    userId: string,
    language: Ph9Language,
    forceNew: boolean,
  ): Promise<SuggestionResult> {
    // The server decides what the quests are based on. The client never sends severity.
    const latest = (await this.ph9Service.getHistory(userId, { limit: 1 })).items[0];
    if (!latest) throw new SuggestionError("PH9_REQUIRED");

    const cached = await this.cache.get(userId);
    if (cached && cached.submissionId === latest.submissionId && cached.language === language) {
      const age = Date.now() - cached.generatedAt;
      const cooling = age < this.refreshCooldownMs;
      if (forceNew && cooling) {
        throw new SuggestionError("REFRESH_TOO_SOON", this.refreshCooldownMs - age);
      }
      // A fallback set means Gemini failed last time: retry it once the cooldown is over.
      if (!forceNew && (cached.source === "ai" || cooling)) return this.present(cached);
    }

    // Concurrent calls (React StrictMode, double taps) share one Gemini request.
    const key = `${userId}:${language}`;
    const running = this.inflight.get(key);
    if (running) return running;

    const generation = this.generate(userId, language, latest.submissionId).finally(() =>
      this.inflight.delete(key),
    );
    this.inflight.set(key, generation);
    return generation;
  }

  private async generate(
    userId: string,
    language: Ph9Language,
    submissionId: string,
  ): Promise<SuggestionResult> {
    const detail = await this.ph9Service.getSubmission(userId, submissionId);
    const plan = await this.aiService.planQuestSet(toQuestRequest(detail, { language }));

    if (plan.kind === "crisis") {
      await this.cache.delete(userId); // never cache anything for a crisis result
      return { kind: "crisis" };
    }

    const entry: CachedQuestSet = {
      submissionId,
      language,
      source: plan.source,
      quests: plan.quests,
      generatedAt: Date.now(),
    };
    await this.cache.set(userId, entry);
    return this.present(entry);
  }

  private present(entry: CachedQuestSet): SuggestionResult {
    return {
      kind: "quests",
      source: entry.source,
      quests: entry.quests,
      generatedAt: new Date(entry.generatedAt),
      refreshAvailableAt: new Date(entry.generatedAt + this.refreshCooldownMs),
    };
  }
}
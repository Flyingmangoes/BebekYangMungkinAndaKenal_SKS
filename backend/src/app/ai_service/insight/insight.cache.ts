import type { Ph9Language } from "../../ph9_service/ph9.schema";
import type { PH9Severity } from "../../ph9_service/ph9.scoring";
import type { GeneratedInsight, InsightSource } from "../ai.insight.schema";

export interface CachedInsight {
  submissionId: string; // the PH9 result the insight was generated for
  language: Ph9Language;
  severity: PH9Severity;
  source: InsightSource;
  insight: GeneratedInsight;
  generatedAt: number; // epoch ms
}

// Async on purpose: a Redis or database implementation can replace the memory one.
export interface InsightCache {
  get(userId: string): Promise<CachedInsight | undefined>;
  set(userId: string, entry: CachedInsight): Promise<void>;
  delete(userId: string): Promise<void>;
}

export class MemoryInsightCache implements InsightCache {
  private readonly entries = new Map<string, CachedInsight>();

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries: number,
  ) {}

  async get(userId: string): Promise<CachedInsight | undefined> {
    const entry = this.entries.get(userId);
    if (!entry) return undefined;
    if (Date.now() - entry.generatedAt > this.ttlMs) {
      this.entries.delete(userId);
      return undefined;
    }
    return entry;
  }

  async set(userId: string, entry: CachedInsight): Promise<void> {
    this.entries.delete(userId); // re-insert so the oldest entry is always first
    this.entries.set(userId, entry);
    if (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest !== undefined) this.entries.delete(oldest);
    }
  }

  async delete(userId: string): Promise<void> {
    this.entries.delete(userId);
  }
}
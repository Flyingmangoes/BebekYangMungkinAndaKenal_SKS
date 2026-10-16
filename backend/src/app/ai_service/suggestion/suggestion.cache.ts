import type { Ph9Language } from "../../ph9_service/ph9.schema";
import type { QuestSource, QuestsByEnergy } from "../ai.schema";

export interface CachedQuestSet {
  submissionId: string; // the PH9 result the set was generated for
  language: Ph9Language;
  source: QuestSource;
  quests: QuestsByEnergy;
  generatedAt: number; // epoch ms
}

// Async on purpose: a Redis or database implementation can replace the memory one.
export interface QuestSetCache {
  get(userId: string): Promise<CachedQuestSet | undefined>;
  set(userId: string, entry: CachedQuestSet): Promise<void>;
  delete(userId: string): Promise<void>;
}

export class MemoryQuestSetCache implements QuestSetCache {
  private readonly entries = new Map<string, CachedQuestSet>();

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries: number,
  ) {}

  async get(userId: string): Promise<CachedQuestSet | undefined> {
    const entry = this.entries.get(userId);
    if (!entry) return undefined;
    if (Date.now() - entry.generatedAt > this.ttlMs) {
      this.entries.delete(userId);
      return undefined;
    }
    return entry;
  }

  async set(userId: string, entry: CachedQuestSet): Promise<void> {
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
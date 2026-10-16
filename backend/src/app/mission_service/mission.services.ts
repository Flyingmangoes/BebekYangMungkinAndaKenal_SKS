import type { Quest } from "../../generated/prisma/client";
import { MissionError } from "../../error/exception";
import { ENERGY_LEVELS } from "../ai_service/ai.schema";
import type { QuestSetCache } from "../ai_service/suggestion/suggestion.cache";
import type { MissionRepository } from "./mission.repo";
import type { CreateMissionInput, UpdateMissionInput } from "./mission.schema";

export class MissionService {
  constructor(
    private readonly missionRepo: MissionRepository,
    private readonly questCache: QuestSetCache,
  ) {}

  // Only a quest from the user's current Gemini set can be saved.
  async create(userId: string, input: CreateMissionInput): Promise<Quest> {
    const cached = await this.questCache.get(userId);
    if (!cached || cached.source !== "ai") throw new MissionError("NOT_FROM_AI");

    const match = ENERGY_LEVELS.flatMap((level) => cached.quests[level]).find(
      (q) =>
        q.questTitle === input.questTitle &&
        q.questDescription === input.questDescription,
    );
    if (!match) throw new MissionError("NOT_FROM_AI");

    // Save the server copy, never the client copy.
    return this.missionRepo.createQuest(userId, {
      questTitle: match.questTitle,
      questDescription: match.questDescription,
      submissionId: cached.submissionId,
      source: "ai",
    });
  }

  async list(userId: string): Promise<Quest[]> {
    return this.missionRepo.findAllByUser(userId);
  }

  async getDetail(questId: string, userId: string): Promise<Quest> {
    const quest = await this.missionRepo.findOwnedById(questId, userId);
    if (!quest) throw new MissionError("NOT_FOUND");
    return quest;
  }

  async update(
    questId: string,
    userId: string,
    input: UpdateMissionInput,
  ): Promise<Quest> {
    return this.missionRepo.updateQuest(questId, userId, input);
  }

  async remove(questId: string, userId: string): Promise<void> {
    await this.missionRepo.deleteQuest(questId, userId);
  }
}
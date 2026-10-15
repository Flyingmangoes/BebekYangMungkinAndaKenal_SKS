import type { Quest } from "../../generated/prisma/client";
import { MissionError } from "../../error/exception";
import type { MissionRepository } from "./mission.repo";
import type { CreateMissionInput, UpdateMissionInput } from "./mission.schema";

export class MissionService {
  constructor(private readonly missionRepo: MissionRepository) {}

  async create(userId: string, input: CreateMissionInput): Promise<Quest> {
    return this.missionRepo.createQuest(userId, input);
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

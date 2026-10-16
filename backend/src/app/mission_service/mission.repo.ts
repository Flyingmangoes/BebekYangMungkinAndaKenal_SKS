import { Prisma } from "../../generated/prisma/client";
import type { PrismaClient, Quest } from "../../generated/prisma/client";
import { MissionError } from "../../error/exception";
import type { UpdateMissionInput } from "./mission.schema";

const isNotFound = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

export interface CreateQuestData {
  questTitle: string;
  questDescription: string;
  submissionId: string;
  source: "ai";
}

export class MissionRepository {
  constructor(private readonly db: PrismaClient) {}

  async createQuest(userId: string, data: CreateQuestData): Promise<Quest> {
    return this.db.quest.create({ data: { ...data, userId } });
  }

  async findAllByUser(userId: string): Promise<Quest[]> {
    return this.db.quest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOwnedById(questId: string, userId: string): Promise<Quest | null> {
    return this.db.quest.findFirst({ where: { questId, userId } });
  }

  async updateQuest(
    questId: string,
    userId: string,
    input: UpdateMissionInput,
  ): Promise<Quest> {
    try {
      return await this.db.quest.update({
        where: { questId, userId },
        data: input,
      });
    } catch (error) {
      if (isNotFound(error)) throw new MissionError("NOT_FOUND");
      throw error;
    }
  }

  async deleteQuest(questId: string, userId: string): Promise<void> {
    try {
      await this.db.quest.delete({ where: { questId, userId } });
    } catch (error) {
      if (isNotFound(error)) throw new MissionError("NOT_FOUND");
      throw error;
    }
  }
}
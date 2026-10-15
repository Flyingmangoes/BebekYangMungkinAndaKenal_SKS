import { Prisma } from "../../generated/prisma/client";
import type { PrismaClient, Quest } from "../../generated/prisma/client";
import { MissionError } from "../../error/exception";
import type { CreateMissionInput, UpdateMissionInput } from "./mission.schema";

const isNotFound = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2025";

export class MissionRepository {
  constructor(private readonly db: PrismaClient) {}

  async createQuest(userId: string, input: CreateMissionInput): Promise<Quest> {
    return this.db.quest.create({ data: { ...input, userId } });
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

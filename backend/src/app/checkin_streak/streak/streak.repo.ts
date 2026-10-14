import type { Prisma, PrismaClient, Streak } from "../../../generated/prisma/client";
import type { StreakState } from "./streak.calculate";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface StreakRepositoryInterface {
  findByUserId(userId: string, tx?: DbClient): Promise<Streak | null>;
  upsert(userId: string, state: StreakState, tx?: DbClient): Promise<Streak>;
}

export class StreakRepository implements StreakRepositoryInterface {
  constructor(private readonly db: PrismaClient) {}

  async findByUserId(userId: string, tx: DbClient = this.db): Promise<Streak | null> {
    return tx.streak.findUnique({ where: { userId } });
  }

  // firstChecInDate (sesuai nama di schema) diisi default now() saat row pertama dibuat
  async upsert(userId: string, state: StreakState, tx: DbClient = this.db): Promise<Streak> {
    const data = {
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      lastCheckInDate: state.lastCheckInDate,
    };
    return tx.streak.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}
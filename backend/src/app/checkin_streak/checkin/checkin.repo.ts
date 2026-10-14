import { Prisma } from "../../../generated/prisma/client";
import type { CheckIn, PrismaClient } from "../../../generated/prisma/client";
import { AuthError } from "../../../error/exception";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface CheckinRepositoryInterface {
  findUserTimezone(userId: string): Promise<{ timezone: string } | null>;
  findByDate(userId: string, checkInDate: Date): Promise<CheckIn | null>;
  create(userId: string, checkInDate: Date, tx?: DbClient): Promise<CheckIn>;
  listRecent(userId: string, limit: number): Promise<CheckIn[]>;
  transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}

export class CheckinRepository implements CheckinRepositoryInterface {
  constructor(private readonly db: PrismaClient) {}

  async findUserTimezone(userId: string): Promise<{ timezone: string } | null> {
    return this.db.user.findUnique({ where: { userId }, select: { timezone: true } });
  }

  async findByDate(userId: string, checkInDate: Date): Promise<CheckIn | null> {
    return this.db.checkIn.findUnique({
      where: { userId_checkInDate: { userId, checkInDate } },
    });
  }

  async create(userId: string, checkInDate: Date, tx: DbClient = this.db): Promise<CheckIn> {
    try {
      return await tx.checkIn.create({ data: { userId, checkInDate } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") throw new AuthError("ALREADY_CHECKED_IN");
        if (error.code === "P2003") throw new AuthError("USER_NOT_FOUND");
      }
      throw error;
    }
  }

  async listRecent(userId: string, limit: number): Promise<CheckIn[]> {
    return this.db.checkIn.findMany({
      where: { userId },
      orderBy: { checkInDate: "desc" },
      take: limit,
    });
  }

  async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }
}
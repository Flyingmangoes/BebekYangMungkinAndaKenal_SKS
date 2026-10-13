import { Prisma } from "../../generated/prisma/client";
import type { PrismaClient, User } from "../../generated/prisma/client";
import { AuthError } from "../../error/exception";
import type { AccountDetailUpdate, ProfileUpdate, SelfUser } from "../../models/model_list";

const SELF_OMIT = { passwordHashed: true, consentSrc: true } as const;

const toDomainError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") throw new AuthError("ACCOUNT_CONFLICT"); 
    if (error.code === "P2025") throw new AuthError("USER_NOT_FOUND");   
  }
  throw error;
};

export interface UserRepositoryInterface {
  findById(userId: string): Promise<User | null>;
  updateAccount(userId: string, data: ProfileUpdate | AccountDetailUpdate): Promise<SelfUser>;
  updatePasswordAndRevokeSessions(userId: string, passwordHashed: string): Promise<void>;
  removeAccount(userId: string): Promise<boolean>;
}

export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly db: PrismaClient) {}

  async findById(userId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { userId } });
  }

  async updateAccount(
    userId: string,
    data: ProfileUpdate | AccountDetailUpdate,
  ): Promise<SelfUser> {
    try {
      return await this.db.user.update({ where: { userId }, data, omit: SELF_OMIT });
    } catch (error) {
      return toDomainError(error);
    }
  }

  async updatePasswordAndRevokeSessions(userId: string, passwordHashed: string): Promise<void> {
    try {
      await this.db.$transaction([
        this.db.user.update({ where: { userId }, data: { passwordHashed }, select: { userId: true } }),
        this.db.refreshToken.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date() },
        }),
      ]);
    } catch (error) {
      toDomainError(error);
    }
  }

  async removeAccount(userId: string): Promise<boolean> {
    const { count } = await this.db.user.deleteMany({ where: { userId } });
    return count === 1;
  }
}
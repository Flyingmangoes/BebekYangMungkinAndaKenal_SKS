import { Prisma } from "../../generated/prisma/client";
import type { PrismaClient, User } from "../../generated/prisma/client";
import { AuthError } from "../../error/exception";
import type { NewUser } from "../../models/model_list";

export interface AuthRepositoryInterface {
  createUser(data: NewUser): Promise<User>;
  findUserById(userId: string): Promise<User | null>;
  findUserByLogin(usernameOrEmail: string): Promise<User | null>;
  deleteUser(userId: string): Promise<void>;
  getPassword(userId: string, email: string): Promise<string | null>;
}

export class AuthRepository implements AuthRepositoryInterface {
  constructor(private readonly db: PrismaClient) {}

  async createUser(data: NewUser): Promise<User> {
    try {
      return await this.db.user.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AuthError("INVALID_CREDENTIALS");
      }
      throw error;
    }
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { userId } });
  }

  async findUserByLogin(login: string): Promise<User | null> {
    const key = login.trim();
    const where: Prisma.UserWhereInput = key.includes("@")
      ? { email: { equals: key, mode: "insensitive" } }
      : { username: { equals: key, mode: "insensitive" } };
    return this.db.user.findFirst({ where });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.user.deleteMany({ where: { userId } });
  }

  async getPassword(userId: string, email: string): Promise<string | null> {
    const user = await this.db.user.findFirst({
      where: { userId, email },
      select: { passwordHashed: true },
    });
    return user?.passwordHashed ?? null;
  }
}
import type { PrismaClient, RefreshToken } from "../../generated/prisma/client";

export interface TokenAuthInterface {
  createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findRefreshToken(tokenHash: string): Promise<RefreshToken | null>;
  revokeRefreshToken(tokenHash: string): Promise<boolean>;
  revokeAllForUser(userId: string): Promise<void>;
}

export class TokenRepository implements TokenAuthInterface {
  constructor(private readonly db: PrismaClient) {}

  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.db.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    return this.db.refreshToken.findUnique({ where: { tokenHash } });
  }

  // true only if THIS call revoked a still-active token
  async revokeRefreshToken(tokenHash: string): Promise<boolean> {
    const { count } = await this.db.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return count === 1;
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
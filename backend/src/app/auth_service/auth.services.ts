import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import type { User } from "../../generated/prisma/client";
import type { AuthTokens, AuthUser, SelfUser } from "../../models/model_list";
import { AuthError } from "../../error/exception";
import { encodeSession } from "../../services/jwt";
import { AuthRepository } from "./auth.repo";
import { TokenRepository } from "./token.repo";
import type { RegisterInput, LoginInput } from "./auth.schema";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export interface AuthServiceOptions {
  refreshTtlMs?: number;
  bcryptCost?: number;
}

export class AuthService {
  private readonly refreshTtlMs: number;
  private readonly bcryptCost: number;
  private readonly dummyHash: string;

  constructor(
    private readonly authRepo: AuthRepository,
    private readonly tokenRepo: TokenRepository,
    opts: AuthServiceOptions = {},
  ) {
    this.bcryptCost = opts.bcryptCost ?? 12;
    this.refreshTtlMs = opts.refreshTtlMs ?? 7 * 24 * 60 * 60 * 1000;
    this.dummyHash = bcrypt.hashSync(randomBytes(16).toString("hex"), this.bcryptCost);
  }

  async register(input: RegisterInput): Promise<SelfUser> {
    const user = await this.authRepo.createUser({
      username: input.username.trim().toLowerCase(),
      fullname: input.fullname,
      role: "user",
      email: input.email.trim().toLowerCase(),
      phoneNumber: input.phoneNumber,
      passwordHashed: await bcrypt.hash(input.password, this.bcryptCost),
      location: input.location,
      country: input.country,
      timezone: input.timezone,
      consentSrc: input.consentSrc,
      emailConsent: input.emailConsent,
      phoneNumberConsent: input.phoneNumberConsent,
      consentAt: new Date(),
    });
    return this.toSelfUser(user);
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const user = await this.authRepo.findUserByLogin(input.username ?? input.email ?? "");
    const ok = await bcrypt.compare(input.password, user?.passwordHashed ?? this.dummyHash);
    if (!user || !ok) throw new AuthError("INVALID_CREDENTIALS");

    return this.issueToken(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const hash = sha256(refreshToken);
    const row = await this.tokenRepo.findRefreshToken(hash);
    if (!row) throw new AuthError("INVALID_REFRESH");

    if (row.revokedAt) {
      // A revoked token is being replayed: possible theft, so end every session of this user.
      await this.tokenRepo.revokeAllForUser(row.userId);
      throw new AuthError("INVALID_REFRESH");
    }
    if (row.expiresAt < new Date()) throw new AuthError("INVALID_REFRESH");

    const consumed = await this.tokenRepo.revokeRefreshToken(hash);
    if (!consumed) throw new AuthError("INVALID_REFRESH");

    const user = await this.authRepo.findUserById(row.userId);
    if (!user) throw new AuthError("INVALID_REFRESH");

    return this.issueToken(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenRepo.revokeRefreshToken(sha256(refreshToken));
  }

  async logoutAll(userId: string): Promise<void> {
    await this.tokenRepo.revokeAllForUser(userId);
  }

  private async issueToken(user: AuthUser): Promise<AuthTokens> {
    const { token, expires } = encodeSession({
      userId: user.userId,
      username: user.username,
      role: user.role,
    });

    const refreshToken = randomBytes(32).toString("base64url");
    const refreshExpiresAt = new Date(Date.now() + this.refreshTtlMs);
    await this.tokenRepo.createRefreshToken(user.userId, sha256(refreshToken), refreshExpiresAt);

    return { token, expiresAt: expires, refreshToken: refreshToken, refreshExpiredAt: refreshExpiresAt };
  }

  private toSelfUser(user: User): SelfUser {
    const { passwordHashed: _p, consentSrc: _c, ...self } = user;
    return self;
  }
}
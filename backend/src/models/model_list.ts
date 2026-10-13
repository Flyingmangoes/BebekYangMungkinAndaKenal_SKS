import type { User, RefreshToken } from "../generated/prisma/client";

export type AuthUser = Pick<User, "userId" | "username" | "role">;
export type PublicUser = Pick<User, "userId" | "username" | "fullname" | "role" >;
export type SelfUser = Omit<User, "passwordHashed" | "consentSrc">;
export type NewUser = Omit<User, "userId" | "createdAt" | "updatedAt">;
export type ProfileUpdate = Partial<Pick<User, "username" | "fullname">>;
export type AccountDetailUpdate = Partial<
  Pick<User, "phoneNumber" | "location" | "country" | "timezone">
>;

export interface Session {
    sessionId: string;
    userId: User["userId"];
    username: User["username"];
    role: User["role"];
    issuedAt: Date;
    expiredAt: Date;
}

export interface AuthTokens {
    token: string;
    expiresAt: Date;
    refreshToken: string;
    refreshExpiredAt: Date;
}

export interface EncodeResult { token: string; expires: Date; issued: Date; }

export type DecodeResult =
    | { type: "valid"; session: Session }
    | { type: "expired" }
    | { type: "invalid_tokens" };

export type ExpirationStatus = "expired" | "valid" | "invalid";

export type PartialSession = Omit<Session, "sessionId" | "issuedAt" | "expiredAt">;
export type NewRefreshToken = Pick<RefreshToken, "userId" | "tokenHash" | "expiresAt">;
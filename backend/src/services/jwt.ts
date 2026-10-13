import jwt, { TokenExpiredError } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { config } from "../config/config";
import type {
  Session, PartialSession, EncodeResult, DecodeResult, ExpirationStatus,
} from "../models/token";
import { ROLES} from "./rbac";

const ALGORITHM = "HS256" as const;
const TTL_SECONDS = 60 * 60 * 24 * 7;

function isRole(v: unknown): v is Session["Role"] {
    return typeof v === "string" && (ROLES as readonly string[]).includes(v);
}

export function encodeSession(partial: PartialSession): EncodeResult {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + TTL_SECONDS;

    const token = jwt.sign(
        { username: partial.Username, role: partial.Role, iat, exp },
        config.Auth.jwtSecret,
        { subject: partial.UserID, jwtid: randomUUID(), algorithm: ALGORITHM },
    );

  return { token, issued: new Date(iat * 1000), expires: new Date(exp * 1000) };
}

export function decodeSession(token: string): DecodeResult {
    try {
        const p = jwt.verify(token, config.Auth.jwtSecret, { algorithms: [ALGORITHM] });

        if (typeof p === "string") return { type: "invalid_tokens" };

        const { sub, jti, username, role, iat, exp } = p;
        if (
            typeof sub !== "string" || typeof jti !== "string" ||
            typeof username !== "string" || !isRole(role) ||
            typeof iat !== "number" || typeof exp !== "number"
        ) {
            return { type: "invalid_tokens" };
        }
    return {
        type: "valid",
        session: {
                SessionID: jti,
                UserID: sub,
                Username: username,
                Role: role,
                issuedAt: new Date(iat * 1000),
                expiredAt: new Date(exp * 1000),
            },
        };
    } catch (err) {
        if (err instanceof TokenExpiredError) return { type: "expired" };
        return { type: "invalid_tokens" };
    }
}

export function checkExpiration(session: Session, now: Date = new Date()): ExpirationStatus {
    if (Number.isNaN(session.expiredAt.getTime())) return "invalid";
    return session.expiredAt.getTime() > now.getTime() ? "valid" : "expired";
}
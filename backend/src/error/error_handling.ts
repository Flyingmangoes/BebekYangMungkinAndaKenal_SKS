import {
  AuthError,
  AuthErrorCode,
  ArticleError,
  ArticleErrorCode,
  MissionError,
  MissionErrorCode,
} from "./exception";
import { NextFunction, Response } from "express";

const STATUS: Record<AuthErrorCode, { status: number; message: string }> = {
  INVALID_CREDENTIALS: { status: 401, message: "Invalid credentials" },
  INVALID_REFRESH: {
    status: 401,
    message: "Session expired, please log in again",
  },
  ACCOUNT_CONFLICT: {
    status: 409,
    message: "Username or email already in use",
  },
  USER_NOT_FOUND: { status: 404, message: "User not found" },
  WRONG_PASSWORD: { status: 401, message: "Wrong password" },
  INVALID_INPUT: { status: 400, message: "Invalid input" },
  ALREADY_CHECKED_IN: { status: 409, message: "Already checked in today" },
};

const ARTICLE_STATUS: Record<
  ArticleErrorCode,
  { status: number; message: string }
> = {
  NOT_FOUND: { status: 404, message: "Article not found" },
  FORBIDDEN: { status: 403, message: "You are not the author of this article" },
};

export function handleAuthError(
  err: unknown,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AuthError) {
    const { status, message } = STATUS[err.code];
    res.status(status).json({ message });
    return;
  }
  next(err);
}

export function handleArticleError(
  err: unknown,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof ArticleError) {
    const { status, message } = ARTICLE_STATUS[err.code];
    res.status(status).json({ message });
    return;
  }
  next(err);
}

const MISSION_STATUS: Record<
  MissionErrorCode,
  { status: number; message: string }
> = {
  NOT_FOUND: { status: 404, message: "Mission not found" },
};

export function handleMissionError(
  err: unknown,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof MissionError) {
    const { status, message } = MISSION_STATUS[err.code];
    res.status(status).json({ message });
    return;
  }
  next(err);
}

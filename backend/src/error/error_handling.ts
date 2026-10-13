import { AuthError, AuthErrorCode } from "./exception";
import { NextFunction, Response } from "express";

const STATUS: Record<AuthErrorCode, { status: number; message: string }> = {
  INVALID_CREDENTIALS: { status: 401, message: "Invalid credentials" },
  INVALID_REFRESH:     { status: 401, message: "Session expired, please log in again" },
  CONFLICT:            { status: 409, message: "Username or email already in use" },
};

export function handleAuthError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof AuthError) {
    const { status, message } = STATUS[err.code];
    res.status(status).json({ message });
    return;
  }
  next(err);
}
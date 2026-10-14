export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "INVALID_REFRESH"
  | "ACCOUNT_CONFLICT"
  | "USER_NOT_FOUND"
  | "WRONG_PASSWORD"
  | "INVALID_INPUT"
  | "ALREADY_CHECKED_IN";

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message?: string,            
  ) {
    super(message ?? code);
    this.name = "AuthError";
  }
}


export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "INVALID_REFRESH"
  | "CONFLICT";

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message?: string,            
  ) {
    super(message ?? code);
    this.name = "AuthError";
  }
}
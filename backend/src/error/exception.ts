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

export type ArticleErrorCode = 
  | "NOT_FOUND" 
  | "FORBIDDEN";

export class ArticleError extends Error {
  constructor(public readonly code: ArticleErrorCode) {
    super(code);
    this.name = "ArticleError";
  }
}

export type Ph9ErrorCode = 
  |"INVALID_INPUT" 
  | "UNAUTHORIZED" 
  | "SUBMISSION_NOT_FOUND";

export class Ph9Error extends Error {
  constructor(public readonly code: Ph9ErrorCode) {
    super(code);
    this.name = "Ph9Error";
  }
}
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api/v1").replace(/\/$/, "");
const TOKEN_KEY = "sks.auth.tokens";

export interface AuthTokens {
  token: string;
  expiresAt: string;
  refreshToken: string;
  refreshExpiredAt: string;
}

export interface RegisterInput {
  username: string;
  fullname: string;
  email: string;
  password: string;
  emailConsent: boolean;
  phoneNumberConsent: boolean;
}

export interface SelfUser {
  userId: string;
  username: string;
  fullname: string;
  role: string;
  email: string;
  phoneNumber: string;
  location: string;
  country: string;
  timezone: string;
  emailConsent: boolean;
  phoneNumberConsent: boolean;
  privacyConset: boolean;
  consentAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ph9Question {
  questionId: string;
  questionIndex: number;
  questionBody: string;
}

export interface Ph9AnswerInput {
  questionId: string;
  answerValue: number;
}

export type Ph9Severity = "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";

export interface Ph9SubmissionResult {
  submissionId: string;
  submittedAt: string;
  totalScore: number;
  severity: Ph9Severity;
  selfHarmFlag: boolean;
}

export type EnergyLevel = "low" | "medium" | "high";

export interface SuggestedQuest {
  questTitle: string;
  questDescription: string;
}

export type QuestSuggestions =
  | { kind: "crisis" }
  | {
      kind: "quests";
      source: "ai" | "fallback";
      quests: Record<EnergyLevel, SuggestedQuest[]>;
      generatedAt: string;
      refreshAvailableAt: string;
    };

export interface Mission {
  questId: string;
  submissionId: string;
  userId: string;
  questTitle: string;
  questDescription: string;
  progress: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  checkedInToday: boolean;
}

export interface CheckInRecord {
  id: string;
  userId: string;
  checkInDate: string;
  createdAt: string;
}

export interface Article {
  articleId: string;
  authorId: string;
  articleTitle: string;
  articleDescription: string;
  thumbnailUrl: string;
  likeCounts: number;
  saveCounts: number;
  sharedCounts: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetail extends Article {
  articleBody: { imageUrls: string[]; content: string } | null;
}

export interface GeneratedInsight {
  summary: string;
  tips: string[];
}

export type InsightResult =
  | { kind: "crisis" }
  | { kind: "insight"; source: "ai" | "fallback"; insight: GeneratedInsight };

export interface Ph9HistoryItem {
  submissionId: string;
  totalScore: number;
  severity: Ph9Severity;
  submittedAt: string;
}

export interface Ph9HistoryPage {
  items: Ph9HistoryItem[];
  nextCursor: string | null;
}

export interface Ph9SubmissionDetail extends Ph9SubmissionResult {
  answers: { questionIndex: number; answerValue: number }[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
  retryAfterRefresh?: boolean;
}

function getStoredTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
  if (!stored) return null;

  try {
    const tokens: unknown = JSON.parse(stored);
    if (
      typeof tokens === "object" &&
      tokens !== null &&
      "token" in tokens &&
      typeof tokens.token === "string" &&
      "expiresAt" in tokens &&
      typeof tokens.expiresAt === "string" &&
      "refreshToken" in tokens &&
      typeof tokens.refreshToken === "string" &&
      "refreshExpiredAt" in tokens &&
      typeof tokens.refreshExpiredAt === "string"
    ) {
      return tokens as AuthTokens;
    }
    clearAuthTokens();
    return null;
  } catch {
    clearAuthTokens();
    return null;
  }
}

function notifyAuthChange(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("sks:auth-change"));
}

export function hasAuthTokens(): boolean {
  return getStoredTokens() !== null;
}

export function setAuthTokens(tokens: AuthTokens, rememberMe = true): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  notifyAuthChange();
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
}

function responseMessage(body: unknown, fallback: string): { message: string; code?: string } {
  if (typeof body === "string") return { message: body };
  if (typeof body === "object" && body !== null) {
    const response = body as { message?: unknown; code?: unknown };
    return {
      message: typeof response.message === "string" ? response.message : fallback,
      code: typeof response.code === "string" ? response.code : undefined,
    };
  }
  return { message: fallback };
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) return response.json();
  const text = await response.text();
  return text || undefined;
}

let refreshInFlight: Promise<AuthTokens | null> | null = null;

async function refreshTokens(): Promise<AuthTokens | null> {
  const current = getStoredTokens();
  if (!current) return null;

  const rememberMe = typeof window !== "undefined" && window.localStorage.getItem(TOKEN_KEY) !== null;
  const result = await request<AuthTokens>(
    "/auth/refresh",
    { method: "POST", body: JSON.stringify({ refreshToken: current.refreshToken }) },
    { authenticated: false, retryAfterRefresh: false },
  );
  setAuthTokens(result, rememberMe);
  return result;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  options: Pick<RequestOptions, "authenticated" | "retryAfterRefresh"> = {},
): Promise<T> {
  const { authenticated = true, retryAfterRefresh = true } = options;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const tokens = getStoredTokens();
    if (tokens) headers.set("Authorization", `Bearer ${tokens.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (response.status === 401 && authenticated && retryAfterRefresh && getStoredTokens()) {
    try {
      refreshInFlight ??= refreshTokens().finally(() => {
        refreshInFlight = null;
      });
      if (await refreshInFlight) return request<T>(path, init, { authenticated, retryAfterRefresh: false });
    } catch {
      clearAuthTokens();
    }
  }

  const body = await readBody(response);
  if (!response.ok) {
    const { message, code } = responseMessage(body, response.statusText || "Request failed");
    throw new ApiError(message, response.status, code);
  }
  return body as T;
}

export function login(input: { email: string; password: string }): Promise<AuthTokens> {
  return request("/auth/login", { method: "POST", body: JSON.stringify(input) }, { authenticated: false });
}

export function register(input: RegisterInput): Promise<SelfUser> {
  return request("/auth/register", { method: "POST", body: JSON.stringify(input) }, { authenticated: false });
}

export async function logout(): Promise<void> {
  const tokens = getStoredTokens();
  try {
    if (tokens) {
      await request<void>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
    }
  } finally {
    clearAuthTokens();
  }
}

export async function logoutAll(): Promise<void> {
  await request<void>("/auth/logout-all", { method: "POST" });
  clearAuthTokens();
}

export function getPh9Questions(lang: "id" | "en" = "id"): Promise<{ questions: Ph9Question[] }> {
  return request(`/ph9/questions?lang=${lang}`, {}, { authenticated: false });
}

export function submitPh9(input: {
  language: "id" | "en";
  answers: Ph9AnswerInput[];
}): Promise<Ph9SubmissionResult> {
  return request("/ph9/submissions", { method: "POST", body: JSON.stringify(input) });
}

export function getPh9History(limit = 20, cursor?: string): Promise<Ph9HistoryPage> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor) query.set("cursor", cursor);
  return request(`/ph9/submissions?${query.toString()}`);
}

export function getPh9Submission(submissionId: string): Promise<Ph9SubmissionDetail> {
  return request(`/ph9/submissions/${encodeURIComponent(submissionId)}`);
}

export function checkIn(): Promise<{ checkIn: CheckInRecord; streak: StreakSummary }> {
  return request("/checkin", { method: "POST" });
}

export function getStreak(): Promise<StreakSummary> {
  return request("/checkin/streak");
}

export function getCheckInHistory(limit = 30): Promise<CheckInRecord[]> {
  return request(`/checkin/history?limit=${limit}`);
}

export function getQuestSuggestions(lang: "id" | "en" = "id"): Promise<QuestSuggestions> {
  return request(`/ai/quests?lang=${lang}`);
}

export function refreshQuestSuggestions(lang: "id" | "en" = "id"): Promise<QuestSuggestions> {
  return request(`/ai/quests/refresh?lang=${lang}`, { method: "POST" });
}

export function createMission(input: SuggestedQuest): Promise<Mission> {
  return request("/missions", { method: "POST", body: JSON.stringify(input) });
}

export function getMissions(): Promise<Mission[]> {
  return request("/missions");
}

export function getMission(questId: string): Promise<Mission> {
  return request(`/missions/${encodeURIComponent(questId)}`);
}

export function updateMission(questId: string, progress: number): Promise<Mission> {
  return request(`/missions/${encodeURIComponent(questId)}`, {
    method: "PATCH",
    body: JSON.stringify({ progress }),
  });
}

export function deleteMission(questId: string): Promise<void> {
  return request<void>(`/missions/${encodeURIComponent(questId)}`, { method: "DELETE" });
}

export function getInsight(lang: "id" | "en" = "id"): Promise<InsightResult> {
  return request(`/ai/insight?lang=${lang}`);
}

export interface ArticleListResult {
  data: Article[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateArticleInput {
  articleTitle: string;
  articleDescription: string;
  thumbnailUrl: string;
  imageUrls?: string[];
  content: string;
}

export type UpdateArticleInput = Partial<CreateArticleInput> &
  (
    | { articleTitle: string }
    | { articleDescription: string }
    | { thumbnailUrl: string }
    | { imageUrls: string[] }
    | { content: string }
  );

export function getArticles(page = 1, limit = 10): Promise<ArticleListResult> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return request(`/articles?${query.toString()}`, {}, { authenticated: false });
}

export function getArticle(articleId: string): Promise<ArticleDetail> {
  return request(`/articles/${encodeURIComponent(articleId)}`, {}, { authenticated: false });
}

export function createArticle(input: CreateArticleInput): Promise<ArticleDetail> {
  return request("/articles", { method: "POST", body: JSON.stringify(input) });
}

export function updateArticle(articleId: string, input: UpdateArticleInput): Promise<ArticleDetail> {
  return request(`/articles/${encodeURIComponent(articleId)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteArticle(articleId: string): Promise<void> {
  return request<void>(`/articles/${encodeURIComponent(articleId)}`, { method: "DELETE" });
}

export function updateArticleEngagement(
  articleId: string,
  action: "like" | "save" | "share",
): Promise<{ likeCounts?: number; saveCounts?: number; sharedCounts?: number }> {
  return request(`/articles/${encodeURIComponent(articleId)}/${action}`, { method: "POST" });
}

export function updateUserProfile(input: { username?: string; fullname?: string }): Promise<SelfUser> {
  return request("/user/update-profile", { method: "PUT", body: JSON.stringify(input) });
}

export function updateUserAccount(input: {
  phoneNumber?: string;
  location?: string;
  country?: string;
  timezone?: string;
}): Promise<SelfUser> {
  return request("/user/update-account", { method: "PUT", body: JSON.stringify(input) });
}

export function deleteUserAccount(currentPassword: string): Promise<void> {
  return request("/user", { method: "DELETE", body: JSON.stringify({ currentPassword }) });
}

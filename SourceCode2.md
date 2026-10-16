import type { Ph9Language } from "../../ph9_service/ph9.schema";
import type { QuestSource, QuestsByEnergy } from "../ai.schema";

export interface CachedQuestSet {
  submissionId: string; // the PH9 result the set was generated for
  language: Ph9Language;
  source: QuestSource;
  quests: QuestsByEnergy;
  generatedAt: number; // epoch ms
}

// Async on purpose: a Redis or database implementation can replace the memory one.
export interface QuestSetCache {
  get(userId: string): Promise<CachedQuestSet | undefined>;
  set(userId: string, entry: CachedQuestSet): Promise<void>;
  delete(userId: string): Promise<void>;
}

export class MemoryQuestSetCache implements QuestSetCache {
  private readonly entries = new Map<string, CachedQuestSet>();

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries: number,
  ) {}

  async get(userId: string): Promise<CachedQuestSet | undefined> {
    const entry = this.entries.get(userId);
    if (!entry) return undefined;
    if (Date.now() - entry.generatedAt > this.ttlMs) {
      this.entries.delete(userId);
      return undefined;
    }
    return entry;
  }

  async set(userId: string, entry: CachedQuestSet): Promise<void> {
    this.entries.delete(userId); // re-insert so the oldest entry is always first
    this.entries.set(userId, entry);
    if (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest !== undefined) this.entries.delete(oldest);
    }
  }

  async delete(userId: string): Promise<void> {
    this.entries.delete(userId);
  }
}

import type { NextFunction, Request, Response } from "express";
import { SuggestionError } from "../../../error/exception";
import type { SuggestionErrorCode } from "../../../error/exception";
import { questionsQuerySchema } from "../../ph9_service/ph9.schema";
import type { QuestSuggestionService } from "./suggestion.services";

const ERROR_RESPONSES: Record<SuggestionErrorCode, { status: number; message: string }> = {
  INVALID_INPUT: { status: 400, message: "Invalid request" },
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  PH9_REQUIRED: { status: 409, message: "Complete the PH9 questionnaire first" },
  REFRESH_TOO_SOON: { status: 429, message: "Please wait before refreshing again" },
};

// userId comes from the verified token and nowhere else.
const userIdOf = (req: Request): string => {
  const userId = req.authUser?.userId;
  if (!userId) throw new SuggestionError("UNAUTHORIZED");
  return userId;
};

const fail = (err: unknown, res: Response, next: NextFunction): void => {
  if (err instanceof SuggestionError) {
    const { status, message } = ERROR_RESPONSES[err.code];
    if (err.retryAfterMs) res.set("Retry-After", String(Math.ceil(err.retryAfterMs / 1000)));
    res.status(status).json({ code: err.code, message });
    return;
  }
  next(err);
};

export const SuggestionController = (service: QuestSuggestionService) => ({
  async current(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = userIdOf(req);
      const query = questionsQuerySchema.safeParse(req.query);
      if (!query.success) throw new SuggestionError("INVALID_INPUT");

      res.set("Cache-Control", "no-store").json(await service.getCurrent(userId, query.data.lang));
    } catch (err) {
      fail(err, res, next);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = userIdOf(req);
      const query = questionsQuerySchema.safeParse(req.query);
      if (!query.success) throw new SuggestionError("INVALID_INPUT");

      res.set("Cache-Control", "no-store").json(await service.refresh(userId, query.data.lang));
    } catch (err) {
      fail(err, res, next);
    }
  },
});

import { Router } from "express";
import type { RequestHandler } from "express";
import type { SuggestionController } from "./suggestion.controllers";

export interface SuggestionRouterDeps {
  controller: ReturnType<typeof SuggestionController>;
  requireAuth: RequestHandler;
  refreshLimiter: RequestHandler;
}

export const createSuggestionRouter = ({
  controller,
  requireAuth,
  refreshLimiter,
}: SuggestionRouterDeps): Router => {
  const router = Router();

  router.get("/quests", requireAuth, controller.current);
  router.post("/quests/refresh", requireAuth, refreshLimiter, controller.refresh);

  return router;
};

import { SuggestionError } from "../../../error/exception";
import type { Ph9Language } from "../../ph9_service/ph9.schema";
import type { Ph9Service } from "../../ph9_service/ph9.services";
import type { QuestSource, QuestsByEnergy } from "../ai.schema";
import { toQuestRequest } from "../ai.services";
import type { AIService } from "../ai.services";
import type { CachedQuestSet, QuestSetCache } from "./suggestion.cache";

export type SuggestionResult =
  | { kind: "crisis" }
  | {
      kind: "quests";
      source: QuestSource;
      quests: QuestsByEnergy;
      generatedAt: Date;
      refreshAvailableAt: Date;
    };

export class QuestSuggestionService {
  private readonly inflight = new Map<string, Promise<SuggestionResult>>();

  constructor(
    private readonly ph9Service: Ph9Service,
    private readonly aiService: AIService,
    private readonly cache: QuestSetCache,
    private readonly refreshCooldownMs: number = 20_000,
  ) {}

  // Quest window opened: the stored set if it's still valid, otherwise generate.
  getCurrent(userId: string, language: Ph9Language): Promise<SuggestionResult> {
    return this.resolve(userId, language, false);
  }

  // Refresh button: always a new generation (after the cooldown).
  refresh(userId: string, language: Ph9Language): Promise<SuggestionResult> {
    return this.resolve(userId, language, true);
  }

  private async resolve(
    userId: string,
    language: Ph9Language,
    forceNew: boolean,
  ): Promise<SuggestionResult> {
    // The server decides what the quests are based on. The client never sends severity.
    const latest = (await this.ph9Service.getHistory(userId, { limit: 1 })).items[0];
    if (!latest) throw new SuggestionError("PH9_REQUIRED");

    const cached = await this.cache.get(userId);
    if (cached && cached.submissionId === latest.submissionId && cached.language === language) {
      const age = Date.now() - cached.generatedAt;
      const cooling = age < this.refreshCooldownMs;
      if (forceNew && cooling) {
        throw new SuggestionError("REFRESH_TOO_SOON", this.refreshCooldownMs - age);
      }
      // A fallback set means Gemini failed last time: retry it once the cooldown is over.
      if (!forceNew && (cached.source === "ai" || cooling)) return this.present(cached);
    }

    // Concurrent calls (React StrictMode, double taps) share one Gemini request.
    const key = `${userId}:${language}`;
    const running = this.inflight.get(key);
    if (running) return running;

    const generation = this.generate(userId, language, latest.submissionId).finally(() =>
      this.inflight.delete(key),
    );
    this.inflight.set(key, generation);
    return generation;
  }

  private async generate(
    userId: string,
    language: Ph9Language,
    submissionId: string,
  ): Promise<SuggestionResult> {
    const detail = await this.ph9Service.getSubmission(userId, submissionId);
    const plan = await this.aiService.planQuestSet(toQuestRequest(detail, { language }));

    if (plan.kind === "crisis") {
      await this.cache.delete(userId); // never cache anything for a crisis result
      return { kind: "crisis" };
    }

    const entry: CachedQuestSet = {
      submissionId,
      language,
      source: plan.source,
      quests: plan.quests,
      generatedAt: Date.now(),
    };
    await this.cache.set(userId, entry);
    return this.present(entry);
  }

  private present(entry: CachedQuestSet): SuggestionResult {
    return {
      kind: "quests",
      source: entry.source,
      quests: entry.quests,
      generatedAt: new Date(entry.generatedAt),
      refreshAvailableAt: new Date(entry.generatedAt + this.refreshCooldownMs),
    };
  }
}

import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";
import { QUESTS_PER_LEVEL, needsReachOut } from "./ai.schema";
import type { EnergyLevel, FocusArea, GenerationInput } from "./ai.schema";

export const SYSTEM_INSTRUCTION = [
  "You write small daily self-care quests for a mental wellbeing app used by young adults.",
  "You are not a clinician. Never diagnose, never name any mental health condition, and never mention scores, tests or severity.",
  "Never mention medication, supplements, diets, calories, weight, fasting, alcohol or intense exercise.",
  "Never mention self-harm, suicide, death or dying.",
  "Each quest is ONE concrete, safe action that can be done at home today, for free, without equipment.",
  "Tone: warm, calm and encouraging. Never use guilt, pressure or urgency. Do not promise that a quest will fix anything.",
  "Write each title in at most 6 words and each description in at most 2 short sentences.",
  "Return only JSON that matches the provided schema.",
].join("\n");

const EFFORT_GUIDE: Record<PH9Severity, string> = {
  minimal: "Light, enjoyable habits. Up to 15 minutes each.",
  mild: "Small, easy habits. Up to 10 minutes each.",
  moderate: "Very small, low-effort steps. Up to 10 minutes each.",
  moderately_severe: "Tiny steps only. Up to 5 minutes each, minimal effort.",
  severe: "Tiny steps only. Up to 5 minutes each, minimal effort.",
};

const ENERGY_GUIDE: Record<EnergyLevel, string> = {
  low: "gentle, restful quests that can be done sitting or lying down, such as breathing, calm music, a one-sentence note or a short message to someone",
  medium: "calm quests with a little light activity, such as a short walk or a small creative moment",
  high: "more active or creative quests, such as a walk outside, tidying one small spot or making something, while staying gentle and safe",
};

const FOCUS_GUIDE: Record<FocusArea, string> = {
  interest: "gently reconnecting with something small the person used to enjoy",
  mood: "gentle mood support, such as daylight, calm music or writing one kind sentence",
  sleep: "a calm wind-down routine before bed (no sleep aids or supplements)",
  energy: "very light movement or short rest breaks, never intense exercise",
  self_worth: "noticing one thing that went okay today and kind self-talk",
  concentration: "short single-task focus sessions with breaks",
};

const LANGUAGE_NAME: Record<Ph9Language, string> = {
  en: "English",
  id: "Indonesian (Bahasa Indonesia), friendly and informal, using 'kamu'",
};

export const buildUserPrompt = (input: GenerationInput): string => {
  const themes =
    input.focusAreas.length > 0
      ? input.focusAreas.map((area) => `- ${FOCUS_GUIDE[area]}`).join("\n")
      : "- general wellbeing: simple calming or grounding habits";

  const lines = [
    `Create ${QUESTS_PER_LEVEL} quest(s) for EACH of three energy levels: low, medium and high. All quests must be different from each other.`,
    `Language of the output: ${LANGUAGE_NAME[input.language]}.`,
    `Effort limit (applies to every energy level): ${EFFORT_GUIDE[input.severity]}`,
    "The energy level changes the TYPE of quest, never the effort limit above.",
    `low: ${ENERGY_GUIDE.low}`,
    `medium: ${ENERGY_GUIDE.medium}`,
    `high: ${ENERGY_GUIDE.high}`,
  ];
  if (needsReachOut(input.severity)) {
    lines.push(
      'Exactly one quest in the "low" level must be about reaching out to someone trusted (a friend, family member or counsellor).',
    );
  }
  lines.push("Themes (spread them across the levels where possible):", themes);
  return lines.join("\n");
};

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { SYSTEM_INSTRUCTION, buildUserPrompt } from "./ai.prompt";
import type { GenerationInput } from "./ai.schema";

export interface QuestGenerator {
  generate(input: GenerationInput): Promise<unknown>;
}

export interface GeminiOptions {
  apiKey: string;
  model: string;
  timeoutMs: number;
}

// Lenient on purpose: it's the shape sent to Gemini. Strict limits are enforced
// afterwards by generatedQuestSetSchema in AIService.
const questSchema = z.object({ questTitle: z.string(), questDescription: z.string() });
const modelOutputSchema = z.object({
  low: z.array(questSchema),
  medium: z.array(questSchema),
  high: z.array(questSchema),
});

export class GeminiQuestGenerator implements QuestGenerator {
  private readonly google: ReturnType<typeof createGoogleGenerativeAI>;

  constructor(private readonly opts: GeminiOptions) {
    this.google = createGoogleGenerativeAI({ apiKey: opts.apiKey });
  }

  async generate(input: GenerationInput): Promise<unknown> {
    const { output } = await generateText({
      model: this.google(this.opts.model),
      system: SYSTEM_INSTRUCTION,
      prompt: buildUserPrompt(input),
      output: Output.object({ schema: modelOutputSchema }),
      temperature: 0.7,
      maxOutputTokens: 2048,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(this.opts.timeoutMs),
    });
    return output;
  }
}

import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";
import { ENERGY_LEVELS, QUESTS_PER_LEVEL, needsReachOut, QuestsByEnergy } from "./ai.schema";
import type { GeneratedQuest, GenerationInput, FocusArea, EnergyLevel } from "./ai.schema";

const BLOCKED_PATTERNS: readonly RegExp[] = [
  // English
  /\b(medic\w*|prescription|dose|dosage|antidepress\w*|supplement\w*)\b/i,
  /\b(diagnos\w*|disorder|depress\w*|cure|score|phq\w*|ph9)\b/i,
  /\b(diet|calorie\w*|fasting|weight|alcohol)\b/i,
  /\b(suicid\w*|self[- ]harm|hurt yourself|kill|die|dies|death|dead)\b/i,
  // intense exercise (English and Indonesian)
  /\b(workout|gym|hiit|jog\w*|sprint\w*|marathon)\b/i,
  /\b(lari|jogging|angkat beban|latihan berat)\b/i,
  // Indonesian
  /\b(obat|dosis|suplemen|diagnosis|gangguan|depresi|sembuh|penyembuhan|skor)\b/i,
  /\b(diet|kalori|puasa|berat badan|alkohol)\b/i,
  /\b(bunuh|mengakhiri hidup|mati|kematian|melukai|menyakiti diri)\b/i,
];

export const isSafeQuest = (quest: GeneratedQuest): boolean =>
  !BLOCKED_PATTERNS.some(
    (pattern) => pattern.test(quest.questTitle) || pattern.test(quest.questDescription),
  );

type FallbackKey = FocusArea | "general" | "reach_out" | "move" | "tidy" | "create" | "rest" | "comfort";

interface FallbackEntry {
  minutes: number; // time the quest asks for, compared against the severity cap
  energy: readonly EnergyLevel[]; // energy levels the quest suits
  text: Record<Ph9Language, GeneratedQuest>;
}

const ALL: readonly EnergyLevel[] = ["low", "medium", "high"];

const FALLBACK_QUESTS: Record<FallbackKey, FallbackEntry> = {
  general: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "Five slow breaths", questDescription: "Sit comfortably and breathe in for 4 counts and out for 6 counts, five times. Notice how your body feels afterwards." },
      id: { questTitle: "Lima napas pelan", questDescription: "Duduk dengan nyaman, tarik napas 4 hitungan dan hembuskan 6 hitungan, ulangi lima kali. Perhatikan apa yang kamu rasakan setelahnya." },
    },
  },
  sleep: {
    minutes: 5, energy: ALL,
    text: {
      en: { questTitle: "Wind-down time", questDescription: "Put your phone away 20 minutes before bed and dim the lights. Do something calm, like gentle stretching or quiet music." },
      id: { questTitle: "Waktunya menenangkan diri", questDescription: "Simpan ponselmu 20 menit sebelum tidur dan redupkan lampu. Lakukan hal yang menenangkan, seperti peregangan ringan atau mendengarkan musik pelan." },
    },
  },
  energy: {
    minutes: 5, energy: ALL,
    text: {
      en: { questTitle: "Step into daylight", questDescription: "Spend 5 minutes outside or by an open window in natural light. A slow walk is enough." },
      id: { questTitle: "Keluar cari cahaya", questDescription: "Habiskan 5 menit di luar atau dekat jendela yang terbuka dengan cahaya alami. Berjalan santai saja sudah cukup." },
    },
  },
  mood: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "One kind sentence", questDescription: "Write one kind sentence to yourself, as if you were talking to a friend. Keep it where you can see it." },
      id: { questTitle: "Satu kalimat baik", questDescription: "Tulis satu kalimat yang baik untuk dirimu sendiri, seolah kamu sedang bicara pada sahabat. Simpan di tempat yang mudah kamu lihat." },
    },
  },
  interest: {
    minutes: 10, energy: ALL,
    text: {
      en: { questTitle: "A tiny favorite", questDescription: "Pick something you used to enjoy, like a song, a show or a hobby, and spend 10 minutes on it. It's fine if it doesn't feel exciting yet." },
      id: { questTitle: "Hal kecil favoritmu", questDescription: "Pilih sesuatu yang dulu kamu suka, seperti lagu, tontonan, atau hobi, lalu luangkan 10 menit untuk itu. Tidak apa-apa kalau belum terasa seru." },
    },
  },
  self_worth: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "One thing that went okay", questDescription: "Write down one thing you did today that went okay, however small. Small things count." },
      id: { questTitle: "Satu hal yang berjalan baik", questDescription: "Tulis satu hal yang berhasil kamu lakukan hari ini, sekecil apa pun. Hal kecil tetap berarti." },
    },
  },
  concentration: {
    minutes: 10, energy: ["medium", "high"],
    text: {
      en: { questTitle: "One task, ten minutes", questDescription: "Choose one small task and work on only that for 10 minutes. Take a short break afterwards." },
      id: { questTitle: "Satu tugas, sepuluh menit", questDescription: "Pilih satu tugas kecil dan kerjakan hanya itu selama 10 menit. Setelahnya, istirahatlah sebentar." },
    },
  },
  reach_out: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "Say hi to someone you trust", questDescription: "Send a message to a friend or family member you trust. You don't need to explain everything, a simple hello is enough." },
      id: { questTitle: "Sapa orang yang kamu percaya", questDescription: "Kirim pesan ke teman atau keluarga yang kamu percaya. Kamu tidak perlu menjelaskan semuanya, sapaan sederhana sudah cukup." },
    },
  },
  // energy-specific quests
  move: {
    minutes: 10, energy: ["medium", "high"],
    text: {
      en: { questTitle: "Move for ten minutes", questDescription: "Take an easy walk or dance to one or two songs you like. Stop whenever you want." },
      id: { questTitle: "Bergerak sepuluh menit", questDescription: "Jalan santai atau menari mengikuti satu atau dua lagu yang kamu suka. Berhenti kapan saja kamu mau." },
    },
  },
  tidy: {
    minutes: 10, energy: ["high"],
    text: {
      en: { questTitle: "Tidy one small spot", questDescription: "Pick one small spot, like your desk or a shelf, and tidy it for 10 minutes. Stop when the time is up." },
      id: { questTitle: "Rapikan satu sudut kecil", questDescription: "Pilih satu sudut kecil, misalnya meja atau rak, lalu rapikan selama 10 menit. Berhenti saat waktunya habis." },
    },
  },
  create: {
    minutes: 10, energy: ["medium", "high"],
    text: {
      en: { questTitle: "Make something small", questDescription: "Doodle, write a few lines, or take a photo of something you like. It doesn't need to be good." },
      id: { questTitle: "Buat sesuatu yang kecil", questDescription: "Coba corat-coret, tulis beberapa baris, atau foto sesuatu yang kamu suka. Tidak perlu bagus." },
    },
  },
  rest: {
    minutes: 5, energy: ["low"],
    text: {
      en: { questTitle: "Rest your eyes", questDescription: "Lie down or sit back and close your eyes for 5 minutes. Let your thoughts pass without following them." },
      id: { questTitle: "Istirahatkan mata", questDescription: "Berbaring atau bersandar dan pejamkan mata selama 5 menit. Biarkan pikiran lewat tanpa perlu diikuti." },
    },
  },
  comfort: {
    minutes: 5, energy: ["low", "medium"],
    text: {
      en: { questTitle: "Something comforting", questDescription: "Wrap yourself in a blanket or have something warm to drink, and listen to one calm song." },
      id: { questTitle: "Sesuatu yang menenangkan", questDescription: "Berselimut atau minum sesuatu yang hangat, sambil mendengarkan satu lagu yang tenang." },
    },
  },
};

const ALL_KEYS = Object.keys(FALLBACK_QUESTS) as FallbackKey[];

// Same caps as the prompt's effort levels.
const EFFORT_CAP_MINUTES: Record<PH9Severity, number> = {
  minimal: 15,
  mild: 10,
  moderate: 10,
  moderately_severe: 5,
  severe: 5,
};

const ENERGY_PRIORITY: Record<EnergyLevel, FallbackKey[]> = {
  low: ["rest", "comfort"],
  medium: ["move", "energy", "comfort"],
  high: ["move", "create", "tidy", "energy"],
};

export const pickFallbackSet = (input: GenerationInput): QuestsByEnergy => {
  const cap = EFFORT_CAP_MINUTES[input.severity];
  const used = new Set<FallbackKey>();
  const set: QuestsByEnergy = { low: [], medium: [], high: [] };

  for (const level of ENERGY_LEVELS) {
    const priority: FallbackKey[] = [
      ...(level === "low" && needsReachOut(input.severity) ? (["reach_out"] as const) : []),
      ...ENERGY_PRIORITY[level],
      ...input.focusAreas,
      "general",
      ...ALL_KEYS,
    ];

    const picks = [...new Set(priority)]
      .filter((key) => {
        const entry = FALLBACK_QUESTS[key];
        return !used.has(key) && entry.minutes <= cap && entry.energy.includes(level);
      })
      .slice(0, QUESTS_PER_LEVEL);

    picks.forEach((key) => used.add(key));
    set[level] = picks.map((key) => FALLBACK_QUESTS[key].text[input.language]);
  }
  return set;
};

import { z } from "zod";
import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";

export const FOCUS_AREAS = [
  "interest",
  "mood",
  "sleep",
  "energy",
  "self_worth",
  "concentration",
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

export const ENERGY_LEVELS = ["low", "medium", "high"] as const;
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];

// One Gemini call returns this many quests for EACH energy level (3 levels x 1 = 3 quests).
export const QUESTS_PER_LEVEL = 1;

export interface QuestRequest {
  severity: PH9Severity;
  selfHarmFlag: boolean;
  language: Ph9Language;
  focusAreas: FocusArea[];
}

// What the generator may see. selfHarmFlag is excluded on purpose.
export type GenerationInput = Omit<QuestRequest, "selfHarmFlag">;

export const needsReachOut = (severity: PH9Severity): boolean =>
  severity === "moderate" || severity === "moderately_severe" || severity === "severe";

// Tighter than the Quest table (200/1000): short quests are easier to act on.
export const generatedQuestSchema = z.strictObject({
  questTitle: z.string().trim().min(3).max(80),
  questDescription: z.string().trim().min(10).max(400),
});

const questsForLevel = z.array(generatedQuestSchema).length(QUESTS_PER_LEVEL);

export const generatedQuestSetSchema = z.strictObject({
  low: questsForLevel,
  medium: questsForLevel,
  high: questsForLevel,
});

export type GeneratedQuest = z.infer<typeof generatedQuestSchema>;
export type QuestsByEnergy = Record<EnergyLevel, GeneratedQuest[]>;
export type QuestSource = "ai" | "fallback";

export type QuestSetPlan =
  | { kind: "quests"; source: QuestSource; quests: QuestsByEnergy }
  | { kind: "crisis" };

import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { Ph9SubmissionDetail } from "../ph9_service/ph9.services";
import { ENERGY_LEVELS, generatedQuestSetSchema } from "./ai.schema";
import type { FocusArea, QuestRequest, QuestSetPlan } from "./ai.schema";
import type { QuestGenerator } from "./ai.provider";
import { isSafeQuest, pickFallbackSet } from "./ai.safety.fallback";

export interface AIServiceLogger {
  warn(message: string, meta?: Record<string, unknown>): void;
}

// PHQ-9 item number -> theme. Items 5 (appetite), 8 (psychomotor) and 9 (self-harm)
// are deliberately not mapped: quests for them risk unsafe advice or aren't actionable.
const THEME_BY_ITEM: Partial<Record<number, FocusArea>> = {
  1: "interest",
  2: "mood",
  3: "sleep",
  4: "energy",
  6: "self_worth",
  7: "concentration",
};
const FOCUS_MIN_ANSWER = 2; // "more than half the days"

export interface QuestRequestOptions {
  language: Ph9Language;
}

// Pure mapper: a stored PH9 result -> the minimal request the AI layer is allowed to see.
export const toQuestRequest = (
  detail: Ph9SubmissionDetail,
  { language }: QuestRequestOptions,
): QuestRequest => ({
  severity: detail.severity,
  selfHarmFlag: detail.selfHarmFlag,
  language,
  focusAreas: detail.answers
    .filter((a) => a.answerValue >= FOCUS_MIN_ANSWER)
    .flatMap((a) => {
      const theme = THEME_BY_ITEM[a.questionIndex];
      return theme ? [theme] : [];
    }),
});

export class AIService {
  constructor(
    private readonly generator: QuestGenerator | null, // null = no API key: fallback only
    private readonly logger: AIServiceLogger,
  ) {}

  async planQuestSet(request: QuestRequest): Promise<QuestSetPlan> {
    // 1. Safety gate. The flag never leaves this method.
    const { selfHarmFlag, ...input } = request;
    if (selfHarmFlag) return { kind: "crisis" };

    // 2. AI generation, 3. validation. Anything wrong falls through to the fallback.
    if (this.generator) {
      try {
        const raw = await this.generator.generate(input);
        const parsed = generatedQuestSetSchema.safeParse(raw);
        if (!parsed.success) {
          this.logger.warn("AI quest output failed schema validation");
        } else {
          const quests = parsed.data;
          const all = ENERGY_LEVELS.flatMap((level) => quests[level]);
          const distinct = new Set(all.map((q) => q.questTitle.toLowerCase())).size === all.length;
          if (distinct && all.every(isSafeQuest)) return { kind: "quests", source: "ai", quests };
          this.logger.warn("AI quest output rejected by content filter or duplicates");
        }
      } catch (error) {
        const status =
          typeof error === "object" && error !== null && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;
        // reason + status only: never log prompts, outputs or user data
        this.logger.warn("AI quest generation failed", {
          reason: error instanceof Error ? error.name : "unknown",
          status,
        });
      }
    }

    // 4. Curated fallback
    return { kind: "quests", source: "fallback", quests: pickFallbackSet(input) };
  }
}
